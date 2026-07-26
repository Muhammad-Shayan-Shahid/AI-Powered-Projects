const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
const Appointment = require('../models/appointment.model');
const Availability = require('../models/availability.model');
const Service = require('../models/service.model');
const User = require('../models/user.model');
const { CLINIC_TIMEZONE } = require('../config/config');

// Extracted from appointment.controller.js so the exact same slot-generation
// and slot-conflict logic can be called in-process by the chatbot's booking
// tools (chatbot.service.js) without duplicating it or round-tripping through
// HTTP — appointment.controller.js's HTTP handlers are now thin wrappers
// around these two functions. Behavior/response shapes are unchanged.

function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minutes = String(totalMinutes % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Slices a doctor's availability window into fixed-length chunks matching the
// service's duration, e.g. 09:00-11:00 in 30-min chunks -> 09:00, 09:30, 10:00, 10:30.
// Only full chunks that fit entirely inside the window are offered.
function generateSlots(startTime, endTime, durationMinutes) {
  const slots = [];
  const windowStart = timeToMinutes(startTime);
  const windowEnd = timeToMinutes(endTime);
  for (let slotStart = windowStart; slotStart + durationMinutes <= windowEnd; slotStart += durationMinutes) {
    slots.push(minutesToTime(slotStart));
  }
  return slots;
}

// date strings come in as "YYYY-MM-DD"; parsed as UTC midnight so the weekday
// and the stored `date` value never drift with server-local timezone.
function parseDateOnly(dateString) {
  const parsed = new Date(`${dateString}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function combineDateAndTime(dateOnly, timeSlot) {
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const combined = new Date(dateOnly);
  combined.setUTCHours(hours, minutes, 0, 0);
  return combined;
}

// Ranges overlap when one starts before the other ends, in both directions.
function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

// Slots starting within this many minutes of "now" aren't realistically
// bookable — a patient can't reliably show up for a slot a few minutes away.
const MIN_BOOKING_LEAD_MINUTES = 15;

// `date` ("YYYY-MM-DD") and timeSlot ("HH:MM") are always clinic-local
// wall-clock values (the clinic operates in Pakistan Standard Time), NOT the
// server's own system timezone — most hosts/dev machines run UTC, so
// comparing a raw `new Date()` against these would silently be off by a
// fixed 5-hour offset (worse, one that isn't even always fixed, if the
// server or clinic zone ever has DST). dayjs' timezone plugin resolves "now"
// through the real IANA zone database instead of manual hour math, so this
// stays correct regardless of where the server happens to be hosted.
function isSlotInPast(dateString, timeSlot) {
  const nowInClinicTz = dayjs().tz(CLINIC_TIMEZONE);
  if (dateString !== nowInClinicTz.format('YYYY-MM-DD')) return false;
  const nowMinutesInClinicTz = nowInClinicTz.hour() * 60 + nowInClinicTz.minute();
  return timeToMinutes(timeSlot) < nowMinutesInClinicTz + MIN_BOOKING_LEAD_MINUTES;
}

// The frontend only offers a doctor's own services in the booking wizard, but
// that's UI-only — never trust it alone (same principle as slot-conflict
// checking). Re-verified server-side here so neither the real booking flow
// nor the chatbot's booking tools (both call into this file) can create an
// appointment for a service the doctor doesn't actually offer.
function doctorOffersService(doctor, serviceId) {
  return doctor.services.some((id) => String(id) === String(serviceId));
}

// Existing appointments can carry a different service (and therefore a
// different duration) than the one currently being checked, so slots can't be
// excluded by exact timeSlot string match alone — an overlapping range check
// is required to actually prevent double-booking.
async function getBookedRanges(doctorId, dayStart) {
  const booked = await Appointment.find({
    doctorId,
    date: dayStart,
    status: { $in: ['pending', 'confirmed'] },
  }).populate('serviceId', 'durationMinutes');

  return booked.map((appointment) => {
    const start = timeToMinutes(appointment.timeSlot);
    const duration = appointment.serviceId?.durationMinutes || 0;
    return [start, start + duration];
  });
}

// Returns { error: { status, message } } on any failure, or
// { slots, service, doctor, dayStart } on success.
async function computeAvailableSlots({ doctorId, serviceId, date }) {
  const [service, doctor] = await Promise.all([
    Service.findById(serviceId),
    User.findOne({ _id: doctorId, role: 'doctor', status: 'active' }),
  ]);
  if (!service) return { error: { status: 404, message: 'Service not found.' } };
  if (!doctor) return { error: { status: 404, message: 'Doctor not found.' } };
  if (!doctorOffersService(doctor, serviceId)) {
    return { error: { status: 400, message: 'This doctor does not offer the selected service.' } };
  }

  const dayStart = parseDateOnly(date);
  if (!dayStart) return { error: { status: 400, message: 'Invalid date.' } };
  const dayOfWeek = dayStart.getUTCDay();

  const availabilityBlocks = await Availability.find({ doctorId, dayOfWeek });
  const candidateSlots = new Set();
  for (const block of availabilityBlocks) {
    for (const slot of generateSlots(block.startTime, block.endTime, service.durationMinutes)) {
      candidateSlots.add(slot);
    }
  }

  const bookedRanges = await getBookedRanges(doctorId, dayStart);
  const slots = [...candidateSlots]
    .filter((slot) => !isSlotInPast(date, slot))
    .filter((slot) => {
      const slotStart = timeToMinutes(slot);
      const slotEnd = slotStart + service.durationMinutes;
      return !bookedRanges.some(([bookedStart, bookedEnd]) => rangesOverlap(slotStart, slotEnd, bookedStart, bookedEnd));
    })
    .sort();

  return { slots, service, doctor, dayStart };
}

// Returns { error: { status, message } } on any failure, or
// { appointment, service, doctor } on success. Always re-checks availability
// server-side right before writing (CLAUDE.md: never trust a slot is still
// open just because it was open when it was shown) and relies on the model's
// partial unique index as the final atomic safety net against a concurrent race.
async function bookAppointment({ patientId, doctorId, serviceId, date, timeSlot }) {
  const [service, doctor] = await Promise.all([
    Service.findById(serviceId),
    User.findOne({ _id: doctorId, role: 'doctor', status: 'active' }),
  ]);
  if (!service) return { error: { status: 404, message: 'Service not found.' } };
  if (!doctor) return { error: { status: 404, message: 'Doctor not found.' } };
  if (!doctorOffersService(doctor, serviceId)) {
    return { error: { status: 400, message: 'This doctor does not offer the selected service.' } };
  }

  const dayStart = parseDateOnly(date);
  if (!dayStart) return { error: { status: 400, message: 'Invalid date.' } };
  const dayOfWeek = dayStart.getUTCDay();

  const availabilityBlocks = await Availability.find({ doctorId, dayOfWeek });
  const validSlots = new Set();
  for (const block of availabilityBlocks) {
    for (const slot of generateSlots(block.startTime, block.endTime, service.durationMinutes)) {
      validSlots.add(slot);
    }
  }
  if (!validSlots.has(timeSlot)) {
    return { error: { status: 400, message: "This slot is not within the doctor's availability." } };
  }
  if (isSlotInPast(date, timeSlot)) {
    return { error: { status: 400, message: 'This time slot has already passed. Please choose a later time.' } };
  }

  const slotStart = timeToMinutes(timeSlot);
  const slotEnd = slotStart + service.durationMinutes;
  const bookedRanges = await getBookedRanges(doctorId, dayStart);
  const conflict = bookedRanges.some(([bookedStart, bookedEnd]) => rangesOverlap(slotStart, slotEnd, bookedStart, bookedEnd));
  if (conflict) {
    return { error: { status: 409, message: 'This time slot is no longer available. Please choose another.' } };
  }

  let appointment;
  try {
    appointment = await Appointment.create({
      patientId,
      doctorId,
      serviceId,
      date: dayStart,
      timeSlot,
      status: 'pending',
      // Stripe Checkout (Phase 10) is now wired up — every new appointment
      // requires payment once confirmed, so it starts 'pending' rather than
      // the old 'not_required' placeholder default.
      paymentStatus: 'pending',
    });
  } catch (error) {
    // Atomic safety net: the partial unique index on {doctorId, date, timeSlot}
    // catches a concurrent request that slipped past the check above.
    if (error.code === 11000) {
      return { error: { status: 409, message: 'This time slot is no longer available. Please choose another.' } };
    }
    throw error;
  }

  return { appointment, service, doctor };
}

module.exports = {
  computeAvailableSlots,
  bookAppointment,
  parseDateOnly,
  timeToMinutes,
  minutesToTime,
  combineDateAndTime,
};
