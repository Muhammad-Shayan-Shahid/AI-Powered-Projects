const mongoose = require('mongoose');
const { GoogleGenAI, Type } = require('@google/genai');
const { GEMINI_API_KEY, GEMINI_EMBEDDING_MODEL, GEMINI_EMBEDDING_DIMENSIONS, GEMINI_CHAT_MODEL } = require('../config/config');
const DocumentChunk = require('../models/documentChunk.model');
const Document = require('../models/document.model');
const User = require('../models/user.model');
const Service = require('../models/service.model');
const { embedTexts } = require('./embedding.service');
const bookingService = require('./booking.service');
const { notifyAppointmentCreated } = require('./notification.service');
const { formatDoctorName } = require('../utils/formatDoctorName');

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Must match the index created manually in the Atlas dashboard (see
// CLAUDE.md / setup notes) — name, field path, and dimensions all have to line up.
const VECTOR_INDEX_NAME = 'document_chunks_vector_index';
const VECTOR_FIELD_PATH = 'embedding';
const TOP_K_CHUNKS = 5;

// Typed, user-safe error for anything that goes wrong talking to Gemini
// (quota, network, timeout, malformed response, etc). The controller catches
// this specifically and responds with { success: false } instead of letting
// the raw SDK error reach the generic 500 handler or, worse, escape uncaught.
class ChatbotUnavailableError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ChatbotUnavailableError';
    this.status = status;
  }
}

function isQuotaExceededError(error) {
  return error?.status === 429 || /RESOURCE_EXHAUSTED/i.test(error?.message || '');
}

// Every Gemini SDK call in this file goes through here — never call
// ai.models.* or embedTexts directly. Converts ANY thrown error (quota,
// network blip, timeout, a future SDK change, anything) into a
// ChatbotUnavailableError so it can never crash the request, let alone the process.
async function callGemini(fn) {
  try {
    return await fn();
  } catch (error) {
    console.error('Gemini API call failed:', error);
    if (isQuotaExceededError(error)) {
      throw new ChatbotUnavailableError("I'm a bit busy right now, please try again in a moment.", 429);
    }
    throw new ChatbotUnavailableError(
      "Sorry, I'm having trouble answering right now. Please try again shortly or call the clinic directly.",
      503
    );
  }
}

// In-memory per-session chat history + booking state. Not persisted — a
// server restart just starts patients fresh, an accepted tradeoff already
// made in Phase 9a. Sessions idle for 30+ minutes are dropped.
// pendingConfirmation is what makes the "must confirm before booking" rule a
// hard guarantee rather than a prompt suggestion — see present_booking_confirmation
// and createBookingTool below.
const SESSION_TTL_MS = 30 * 60 * 1000;
const MAX_HISTORY_TURNS = 6; // user+model pairs kept per session
const sessions = new Map();

function getSession(sessionId) {
  const existing = sessions.get(sessionId);
  if (existing && Date.now() - existing.lastActiveAt < SESSION_TTL_MS) {
    return existing;
  }
  const fresh = { history: [], lastActiveAt: Date.now(), pendingConfirmation: null, knownSelection: null };
  sessions.set(sessionId, fresh);
  return fresh;
}

function pruneSessions() {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastActiveAt >= SESSION_TTL_MS) sessions.delete(id);
  }
}

// Only the final text of each turn is kept in session.history (see below) —
// the actual doctorId/serviceId a tool resolved is NOT retrievable from that
// text alone, so a naive "reuse what you found earlier" prompt instruction has
// nothing reliable to work from. This tracks the booking-relevant ids/names
// resolved so far, server-side, and gets injected into the system prompt every
// turn (see buildSystemInstruction) so Gemini never has to re-derive or
// re-search for something it already resolved.
function updateKnownSelection(session, patch) {
  session.knownSelection = { ...(session.knownSelection || {}), ...patch };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Retrieves the most relevant DocumentChunk records for a patient's question via
// Atlas Vector Search, then attaches each chunk's parent Document title/category
// (the $vectorSearch stage alone can't join collections) for the system prompt.
async function retrieveRelevantChunks(question) {
  const [queryEmbedding] = await callGemini(() => embedTexts([question], 'RETRIEVAL_QUERY'));

  let results;
  try {
    results = await DocumentChunk.aggregate([
      {
        $vectorSearch: {
          index: VECTOR_INDEX_NAME,
          path: VECTOR_FIELD_PATH,
          queryVector: queryEmbedding,
          numCandidates: TOP_K_CHUNKS * 20,
          limit: TOP_K_CHUNKS,
        },
      },
      {
        $project: {
          chunkText: 1,
          documentId: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);
  } catch (error) {
    // Most likely cause: the Atlas Vector Search index hasn't been created yet
    // (it's a manual dashboard step, see setup notes) — degrade to "no context"
    // instead of failing the whole chat request.
    console.warn('Vector search failed (has the Atlas index been created?):', error.message);
    return [];
  }

  if (results.length === 0) return [];

  const documentIds = [...new Set(results.map((r) => String(r.documentId)))];
  const documents = await Document.find({ _id: { $in: documentIds } }).select('title category');
  const documentsById = new Map(documents.map((doc) => [String(doc._id), doc]));

  return results.map((chunk) => ({
    chunkText: chunk.chunkText,
    title: documentsById.get(String(chunk.documentId))?.title || 'Untitled document',
    category: documentsById.get(String(chunk.documentId))?.category || 'unknown',
  }));
}

// ---------------------------------------------------------------------------
// Tools. Each implementation optionally sets `card` on the shared per-turn
// ctx object — that's how the frontend knows which inline card to render,
// always built from the exact data a tool call returned/received, never from
// the model's own prose (see handleChatMessage's card selection at the end).
// ---------------------------------------------------------------------------

// FAQ + live-lookup tools (Phase 9a) — hit the database directly, never the
// document store. Reused as-is for the booking flow's doctor-lookup step too
// (see system prompt) rather than adding a second near-duplicate tool.
const faqToolDeclarations = [
  {
    name: 'find_doctors_by_service',
    description:
      "Looks up active clinic doctors whose specialization matches a service or procedure name (e.g. 'root canal', 'orthodontics', 'teeth whitening'). Use this for any question asking which doctor(s) provide a given treatment, AND as the first step of a booking flow to get real doctor ids.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        service: {
          type: Type.STRING,
          description: "The service, procedure, or specialization to search for, e.g. 'root canal'.",
        },
      },
      required: ['service'],
    },
  },
  {
    name: 'list_services',
    description: "Lists all services/procedures the clinic currently offers, with id, price and duration. Use this for questions like 'what services do you offer' or 'do you do X', and to get a real serviceId before booking.",
    parameters: { type: Type.OBJECT, properties: {} },
  },
];

async function findDoctorsByService({ service }, ctx) {
  const pattern = new RegExp(escapeRegex(service), 'i');
  const doctors = await User.find({
    role: 'doctor',
    status: 'active',
    $or: [{ specialization: pattern }, { bio: pattern }],
  }).select('name specialization bio');

  const doctorList = doctors.map((d) => ({ id: String(d._id), name: formatDoctorName(d.name), specialization: d.specialization || null }));
  ctx.card = { type: 'doctor_picker', data: { service, doctors: doctorList } };
  if (doctorList.length === 1) {
    updateKnownSelection(ctx.session, { doctorId: doctorList[0].id, doctorName: doctorList[0].name });
  }
  return { doctors: doctorList };
}

async function listServices(_args, ctx) {
  const services = await Service.find().select('name description durationMinutes price');
  const serviceList = services.map((s) => ({
    id: String(s._id),
    name: s.name,
    description: s.description || null,
    durationMinutes: s.durationMinutes,
    price: s.price,
  }));
  // No dedicated "service picker" card was asked for, and this tool can be
  // called mid-booking-flow as a lookup step — deliberately leaves ctx.card
  // untouched rather than clearing whatever an earlier tool call this turn set.
  return { services: serviceList };
}

// Booking tools (Phase 9b) — only ever declared to Gemini when ctx.patient is
// set (see handleChatMessage), so an unauthenticated session can't even
// request them. get_available_slots mirrors the real GET
// /api/appointments/available-slots endpoint, which is itself public (browsing
// slots doesn't require login) — only presenting/creating a booking does.
const bookingToolDeclarations = [
  {
    name: 'get_available_slots',
    description:
      "Gets the real available appointment time slots for a specific doctor, service, and date. Use this after the patient has picked a doctor and service, to show real openings before booking. Never invent slot times.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        doctorId: { type: Type.STRING, description: 'The MongoDB id of the chosen doctor (from find_doctors_by_service).' },
        serviceId: { type: Type.STRING, description: 'The MongoDB id of the chosen service (from list_services).' },
        date: { type: Type.STRING, description: 'Date in YYYY-MM-DD format.' },
      },
      required: ['doctorId', 'serviceId', 'date'],
    },
  },
  {
    name: 'present_booking_confirmation',
    description:
      "Call this exactly when you are ready to ask the patient to confirm a specific appointment (doctor, service, date, time) before booking it. You MUST call this tool before asking for confirmation in your reply text — never just ask in plain text without calling it. Do NOT call create_booking in the same turn as this tool.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        doctorId: { type: Type.STRING },
        doctorName: { type: Type.STRING },
        serviceId: { type: Type.STRING },
        serviceName: { type: Type.STRING },
        date: { type: Type.STRING, description: 'YYYY-MM-DD' },
        timeSlot: { type: Type.STRING, description: 'HH:mm 24-hour' },
      },
      required: ['doctorId', 'doctorName', 'serviceId', 'serviceName', 'date', 'timeSlot'],
    },
  },
  {
    name: 'create_booking',
    description:
      "Books a real appointment for the currently logged-in patient. Only call this AFTER the patient has explicitly replied confirming the exact details you presented via present_booking_confirmation in an EARLIER message — never call this to satisfy an initial booking request.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        doctorId: { type: Type.STRING },
        serviceId: { type: Type.STRING },
        date: { type: Type.STRING, description: 'YYYY-MM-DD' },
        timeSlot: { type: Type.STRING, description: 'HH:mm 24-hour' },
      },
      required: ['doctorId', 'serviceId', 'date', 'timeSlot'],
    },
  },
];

async function getAvailableSlotsTool({ doctorId, serviceId, date }, ctx) {
  const result = await bookingService.computeAvailableSlots({ doctorId, serviceId, date });
  if (result.error) {
    // Leave ctx.card untouched (e.g. a doctor_picker from earlier this turn) —
    // an invalid doctor/service/date combo isn't a reason to blank the UI.
    return { error: result.error.message };
  }
  const doctorName = formatDoctorName(result.doctor.name);
  ctx.card = {
    type: 'slot_picker',
    data: {
      doctorId,
      doctorName,
      serviceId,
      serviceName: result.service.name,
      date,
      slots: result.slots,
    },
  };
  updateKnownSelection(ctx.session, { doctorId, doctorName, serviceId, serviceName: result.service.name, date });
  return { doctorName, serviceName: result.service.name, slots: result.slots };
}

// Purely a structured "intent signal" — makes no DB write. Recording it on
// the session (not just returning it to Gemini) is what create_booking checks
// against on a LATER turn, so confirmation can never be satisfied within the
// same request/tool-loop it's requested in.
async function presentBookingConfirmationTool(args, ctx) {
  const { doctorId, doctorName, serviceId, serviceName, date, timeSlot } = args;
  ctx.session.pendingConfirmation = { doctorId, doctorName, serviceId, serviceName, date, timeSlot };
  updateKnownSelection(ctx.session, { doctorId, doctorName, serviceId, serviceName, date, timeSlot });
  ctx.card = { type: 'confirmation', data: { doctorId, doctorName, serviceId, serviceName, date, timeSlot } };
  return { presented: true, doctorId, doctorName, serviceId, serviceName, date, timeSlot };
}

function matchesPendingConfirmation(pending, args) {
  return (
    pending &&
    pending.doctorId === args.doctorId &&
    pending.serviceId === args.serviceId &&
    pending.date === args.date &&
    pending.timeSlot === args.timeSlot
  );
}

async function createBookingTool(args, ctx) {
  const { doctorId, serviceId, date, timeSlot } = args;

  // Defense in depth: the tool is never even declared to Gemini when
  // ctx.patient is unset, but refuse here too in case that ever changes.
  if (!ctx.patient) {
    ctx.card = null;
    return { error: 'Not authenticated. The patient must log in or sign up before booking.' };
  }

  // The hard gate: confirmedBeforeThisTurn was snapshotted at the START of
  // handleChatMessage, before this turn's own tool calls could set it — so a
  // present_booking_confirmation call earlier in THIS SAME turn can never
  // satisfy it. Confirmation must have happened in a strictly earlier turn.
  if (!matchesPendingConfirmation(ctx.confirmedBeforeThisTurn, args)) {
    ctx.card = null;
    return {
      error:
        'These details were not confirmed by the patient in a previous message. Call present_booking_confirmation with these exact details and ask the patient to confirm first.',
    };
  }

  // Consumed either way — a used or stale confirmation can't be replayed for
  // a different (or the same) booking without re-confirming.
  ctx.session.pendingConfirmation = null;

  const result = await bookingService.bookAppointment({ patientId: ctx.patient._id, doctorId, serviceId, date, timeSlot });

  if (result.error) {
    // Slot-conflict (or any other) failure: hand back a freshly refreshed
    // slot picker instead of a dead end, per the "never a broken error" rule.
    const refreshed = await bookingService.computeAvailableSlots({ doctorId, serviceId, date });
    if (!refreshed.error) {
      ctx.card = {
        type: 'slot_picker',
        data: {
          doctorId,
          doctorName: formatDoctorName(refreshed.doctor.name),
          serviceId,
          serviceName: refreshed.service.name,
          date,
          slots: refreshed.slots,
        },
      };
      return { error: result.error.message, refreshedSlots: refreshed.slots };
    }
    ctx.card = null;
    return { error: result.error.message };
  }

  const { appointment, doctor, service } = result;

  // Same fire-and-forget notification path as the real POST /api/appointments
  // route — a slow/failing socket or email must never affect the chat response.
  notifyAppointmentCreated({ appointment, doctor, patient: ctx.patient, service }).catch((error) => {
    console.error('Failed to send appointment:created notification', error);
  });

  // Fresh start for a next, unrelated booking in the same session.
  ctx.session.knownSelection = null;

  ctx.card = {
    type: 'success',
    data: {
      appointmentId: String(appointment._id),
      doctorName: formatDoctorName(doctor.name),
      serviceName: service.name,
      date,
      timeSlot,
      status: appointment.status,
    },
  };
  return { booked: true, appointmentId: String(appointment._id), status: appointment.status };
}

const toolImplementations = {
  find_doctors_by_service: findDoctorsByService,
  list_services: listServices,
  get_available_slots: getAvailableSlotsTool,
  present_booking_confirmation: presentBookingConfirmationTool,
  create_booking: createBookingTool,
};

function buildSystemInstruction(retrievedChunks, patient, knownSelection) {
  const context =
    retrievedChunks.length > 0
      ? retrievedChunks
          .map((c, i) => `[${i + 1}] (${c.category} — "${c.title}")\n${c.chunkText}`)
          .join('\n\n')
      : '(No matching clinic documents were found for this question.)';

  const authStatus = patient
    ? `The patient IS logged in as "${patient.name}". You may use the booking tools (get_available_slots, present_booking_confirmation, create_booking) for them.`
    : 'The patient is NOT logged in. Do NOT attempt to use get_available_slots, present_booking_confirmation, or create_booking. If they want to book an appointment, tell them to log in or sign up first, then come back to finish booking.';

  // Ground truth for whatever doctor/service/date/time has already been
  // resolved in this session — session.history only keeps final reply text,
  // not raw tool results, so this is the ONLY reliable way for the model to
  // reuse an id across turns instead of re-searching (and possibly failing to
  // re-find it with different wording).
  const knownSelectionBlock =
    knownSelection && Object.keys(knownSelection).length > 0
      ? `CURRENT BOOKING SELECTION (already resolved this session — reuse these exact ids/values, do not re-search unless the patient wants something different):\n${JSON.stringify(knownSelection)}`
      : 'CURRENT BOOKING SELECTION: (none yet)';

  return `You are the patient-facing FAQ and booking assistant for Bright Smile Clinic.

STRICT RULES — follow these exactly, with no exceptions:
1. Answer FAQ-style questions ONLY using the "RETRIEVED CLINIC DOCUMENTS" below or the results of a tool call you make. Never invent, assume, or use outside knowledge about insurance, policies, procedures, prices, or doctors.
2. If the retrieved documents and tools don't contain the answer, say you don't have that information and suggest the patient call the clinic or book an appointment to ask directly. Do not guess.
3. You must NEVER give medical advice, diagnoses, treatment recommendations, or opinions on symptoms — even if asked directly or indirectly (e.g. "what medication should I take for tooth pain", "is this normal"). For ANY clinically-natured question, respond only by directing the patient to book an appointment or call the clinic so a doctor can evaluate them. Do not attempt to partially answer a clinical question first.
4. Use the find_doctors_by_service or list_services tools for any question about which doctors provide a treatment, or what services/prices the clinic offers — never answer those from memory or from documents.
5. Keep answers short, friendly, and in plain text (no markdown formatting).

BOOKING FLOW:
6. ${authStatus}
7. To book: find the doctor (find_doctors_by_service) and service (list_services) the patient wants, ask what date they'd like, then call get_available_slots with the real ids, and let the patient pick a real time from the real results. Never invent doctors, ids, or slot times.
8. IMPORTANT: once you have found a doctor's id and a service's id earlier in THIS conversation (they will have been mentioned by name in your own earlier replies), reuse those exact same ids for every later step (get_available_slots, present_booking_confirmation, create_booking) — do NOT call find_doctors_by_service or list_services again for a doctor/service you already identified, only if the patient asks about a different one.
9. CRITICAL: once the patient has picked a doctor, service, date, and time, you must call present_booking_confirmation with those exact details and then, in your reply text, clearly summarize them and explicitly ask the patient to confirm. You must NEVER call create_booking in the same turn as present_booking_confirmation, and NEVER call create_booking to satisfy the patient's original request directly — only call create_booking in a LATER message, after the patient has replied confirming.
10. If create_booking returns an error about the slot no longer being available, apologize conversationally and let the patient know you're showing fresh available times — do not repeat the old time as if it might still work.

${knownSelectionBlock}

RETRIEVED CLINIC DOCUMENTS:
${context}`;
}

// Runs one user turn end-to-end: retrieve context, call Gemini with the tools
// available for this caller's auth state, execute any tool calls Gemini
// requests, then return its final plain-text answer plus an optional inline
// card. Returns { reply, sessionId, card }.
async function handleChatMessage({ message, sessionId, patient }) {
  pruneSessions();
  const id = sessionId || new mongoose.Types.ObjectId().toString();
  const session = getSession(id);

  const retrievedChunks = await retrieveRelevantChunks(message);
  const systemInstruction = buildSystemInstruction(retrievedChunks, patient, session.knownSelection);

  const contents = [...session.history, { role: 'user', parts: [{ text: message }] }];

  // Booking tools only exist for Gemini to call at all when the caller is an
  // authenticated patient — the strongest possible guarantee an anonymous
  // session can't trigger them, on top of the code-level checks inside the
  // tools themselves.
  const functionDeclarations = patient ? [...faqToolDeclarations, ...bookingToolDeclarations] : faqToolDeclarations;
  const config = { systemInstruction, tools: [{ functionDeclarations }] };

  // Snapshotted BEFORE any tool runs this turn — see createBookingTool's comment.
  const confirmedBeforeThisTurn = session.pendingConfirmation;
  const ctx = { patient, session, confirmedBeforeThisTurn, card: null };

  let response = await callGemini(() => ai.models.generateContent({ model: GEMINI_CHAT_MODEL, contents, config }));

  // Gemini's tool-calling loop: execute every requested function call, feed the
  // results back as a "user" turn (functionResponse parts), and re-ask — capped
  // at a few rounds so a misbehaving tool loop can never hang the request.
  let rounds = 0;
  while (response.functionCalls?.length > 0 && rounds < 3) {
    // Replay the model's raw parts (not a reconstruction from response.functionCalls) —
    // newer Gemini models attach a thoughtSignature to each function-call part that
    // must be echoed back verbatim, or the next generateContent call 400s.
    contents.push({ role: 'model', parts: response.candidates[0].content.parts });

    const responseParts = await Promise.all(
      response.functionCalls.map(async (call) => {
        const impl = toolImplementations[call.name];
        const output = impl ? await impl(call.args || {}, ctx) : { error: `Unknown tool "${call.name}"` };
        return { functionResponse: { name: call.name, response: output } };
      })
    );
    contents.push({ role: 'user', parts: responseParts });

    response = await callGemini(() => ai.models.generateContent({ model: GEMINI_CHAT_MODEL, contents, config }));
    rounds += 1;
  }

  const reply = response.text?.trim() || "I'm sorry, I couldn't come up with an answer to that. Please call the clinic or book an appointment for help.";

  session.history.push({ role: 'user', parts: [{ text: message }] });
  session.history.push({ role: 'model', parts: [{ text: reply }] });
  // Cap stored history so long sessions don't grow the prompt unbounded.
  const maxEntries = MAX_HISTORY_TURNS * 2;
  if (session.history.length > maxEntries) {
    session.history = session.history.slice(session.history.length - maxEntries);
  }
  session.lastActiveAt = Date.now();

  return { reply, sessionId: id, card: ctx.card };
}

module.exports = { handleChatMessage, ChatbotUnavailableError, VECTOR_INDEX_NAME, VECTOR_FIELD_PATH };
