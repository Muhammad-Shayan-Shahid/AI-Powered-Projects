const mongoose = require('mongoose');
const { GoogleGenAI, Type } = require('@google/genai');
const { GEMINI_API_KEY, GEMINI_EMBEDDING_MODEL, GEMINI_EMBEDDING_DIMENSIONS, GEMINI_CHAT_MODEL } = require('../config/config');
const DocumentChunk = require('../models/documentChunk.model');
const Document = require('../models/document.model');
const User = require('../models/user.model');
const Service = require('../models/service.model');
const { embedTexts } = require('./embedding.service');

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

// In-memory per-session chat history so a session can ask short follow-ups
// ("what about Delta?") without re-explaining context. Not persisted — a
// server restart just starts patients fresh, which is an acceptable tradeoff
// for a non-diagnostic FAQ bot. Sessions idle for 30+ minutes are dropped.
const SESSION_TTL_MS = 30 * 60 * 1000;
const MAX_HISTORY_TURNS = 6; // user+model pairs kept per session
const sessions = new Map();

function getSession(sessionId) {
  const existing = sessions.get(sessionId);
  if (existing && Date.now() - existing.lastActiveAt < SESSION_TTL_MS) {
    return existing;
  }
  const fresh = { history: [], lastActiveAt: Date.now() };
  sessions.set(sessionId, fresh);
  return fresh;
}

function pruneSessions() {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastActiveAt >= SESSION_TTL_MS) sessions.delete(id);
  }
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

// Live lookup tools — these hit the database directly (the same queries that
// back GET /api/doctors and GET /api/services), never the document store, so
// questions like "which doctors do root canals" get real current data instead
// of whatever happened to be written into an insurance/policy document.
const toolDeclarations = [
  {
    name: 'find_doctors_by_service',
    description:
      "Looks up active clinic doctors whose specialization matches a service or procedure name (e.g. 'root canal', 'orthodontics', 'teeth whitening'). Use this for any question asking which doctor(s) provide a given treatment.",
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
    description: "Lists all services/procedures the clinic currently offers, with price and duration. Use this for questions like 'what services do you offer' or 'do you do X'.",
    parameters: { type: Type.OBJECT, properties: {} },
  },
];

async function findDoctorsByService({ service }) {
  const pattern = new RegExp(escapeRegex(service), 'i');
  const doctors = await User.find({
    role: 'doctor',
    status: 'active',
    $or: [{ specialization: pattern }, { bio: pattern }],
  }).select('name specialization bio');

  return {
    doctors: doctors.map((d) => ({ name: d.name, specialization: d.specialization || null })),
  };
}

async function listServices() {
  const services = await Service.find().select('name description durationMinutes price');
  return {
    services: services.map((s) => ({
      name: s.name,
      description: s.description || null,
      durationMinutes: s.durationMinutes,
      price: s.price,
    })),
  };
}

const toolImplementations = {
  find_doctors_by_service: findDoctorsByService,
  list_services: listServices,
};

function buildSystemInstruction(retrievedChunks) {
  const context =
    retrievedChunks.length > 0
      ? retrievedChunks
          .map((c, i) => `[${i + 1}] (${c.category} — "${c.title}")\n${c.chunkText}`)
          .join('\n\n')
      : '(No matching clinic documents were found for this question.)';

  return `You are the patient-facing FAQ assistant for Bright Smile Clinic.

STRICT RULES — follow these exactly, with no exceptions:
1. Answer ONLY using the "RETRIEVED CLINIC DOCUMENTS" below or the results of a tool call you make. Never invent, assume, or use outside knowledge about insurance, policies, procedures, prices, or doctors.
2. If the retrieved documents and tools don't contain the answer, say you don't have that information and suggest the patient call the clinic or book an appointment to ask directly. Do not guess.
3. You must NEVER give medical advice, diagnoses, treatment recommendations, or opinions on symptoms — even if asked directly or indirectly (e.g. "what medication should I take for tooth pain", "is this normal"). For ANY clinically-natured question, respond only by directing the patient to book an appointment or call the clinic so a doctor can evaluate them. Do not attempt to partially answer a clinical question first.
4. Use the find_doctors_by_service or list_services tools for any question about which doctors provide a treatment, or what services/prices the clinic offers — never answer those from memory or from documents.
5. Keep answers short, friendly, and in plain text (no markdown formatting).

RETRIEVED CLINIC DOCUMENTS:
${context}`;
}

// Runs one user turn end-to-end: retrieve context, call Gemini with tools
// available, execute any tool calls Gemini requests, then return its final
// plain-text answer. Returns { reply, sessionId }.
async function handleChatMessage(message, sessionId) {
  pruneSessions();
  const id = sessionId || new mongoose.Types.ObjectId().toString();
  const session = getSession(id);

  const retrievedChunks = await retrieveRelevantChunks(message);
  const systemInstruction = buildSystemInstruction(retrievedChunks);

  const contents = [...session.history, { role: 'user', parts: [{ text: message }] }];

  const config = {
    systemInstruction,
    tools: [{ functionDeclarations: toolDeclarations }],
  };

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
        const output = impl ? await impl(call.args || {}) : { error: `Unknown tool "${call.name}"` };
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

  return { reply, sessionId: id };
}

module.exports = { handleChatMessage, ChatbotUnavailableError, VECTOR_INDEX_NAME, VECTOR_FIELD_PATH };
