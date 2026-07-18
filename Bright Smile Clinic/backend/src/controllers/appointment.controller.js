const mongoose = require('mongoose');
const Appointment = require('../models/appointment.model');
const Availability = require('../models/availability.model');
const Service = require('../models/service.model');
const User = require('../models/user.model');

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

// date query/body params come in as "YYYY-MM-DD"; parsed as UTC midnight so the
// weekday and the stored `date` value never drift with server-local timezone.
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

async function getAvailableSlots(req, res, next) {
  try {
    const { doctorId, serviceId, date } = req.validatedQuery;

    const [service, doctor] = await Promise.all([
      Service.findById(serviceId),
      User.findOne({ _id: doctorId, role: 'doctor', status: 'active' }),
    ]);
    if (!service) {
      return res.status(404).json({ success: false, data: null, message: 'Service not found.' });
    }
    if (!doctor) {
      return res.status(404).json({ success: false, data: null, message: 'Doctor not found.' });
    }

    const dayStart = parseDateOnly(date);
    if (!dayStart) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid date.' });
    }
    const dayOfWeek = dayStart.getUTCDay();

    const availabilityBlocks = await Availability.find({ doctorId, dayOfWeek });
    const candidateSlots = new Set();
    for (const block of availabilityBlocks) {
      for (const slot of generateSlots(block.startTime, block.endTime, service.durationMinutes)) {
        candidateSlots.add(slot);
      }
    }

    const bookedRanges = await getBookedRanges(doctorId, dayStart);
    const availableSlots = [...candidateSlots]
      .filter((slot) => {
        const slotStart = timeToMinutes(slot);
        const slotEnd = slotStart + service.durationMinutes;
        return !bookedRanges.some(([bookedStart, bookedEnd]) => rangesOverlap(slotStart, slotEnd, bookedStart, bookedEnd));
      })
      .sort();

    return res.status(200).json({ success: true, data: { slots: availableSlots }, message: 'OK' });
  } catch (error) {
    next(error);
  }
}

async function createAppointment(req, res, next) {
  try {
    const { doctorId, serviceId, date, timeSlot } = req.body;

    const [service, doctor] = await Promise.all([
      Service.findById(serviceId),
      User.findOne({ _id: doctorId, role: 'doctor', status: 'active' }),
    ]);
    if (!service) {
      return res.status(404).json({ success: false, data: null, message: 'Service not found.' });
    }
    if (!doctor) {
      return res.status(404).json({ success: false, data: null, message: 'Doctor not found.' });
    }

    const dayStart = parseDateOnly(date);
    if (!dayStart) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid date.' });
    }
    const dayOfWeek = dayStart.getUTCDay();

    const availabilityBlocks = await Availability.find({ doctorId, dayOfWeek });
    const validSlots = new Set();
    for (const block of availabilityBlocks) {
      for (const slot of generateSlots(block.startTime, block.endTime, service.durationMinutes)) {
        validSlots.add(slot);
      }
    }
    if (!validSlots.has(timeSlot)) {
      return res.status(400).json({ success: false, data: null, message: "This slot is not within the doctor's availability." });
    }

    // Re-check server-side right before writing — never trust that the slot the
    // frontend showed is still open (CLAUDE.md: prevent double-booking).
    const slotStart = timeToMinutes(timeSlot);
    const slotEnd = slotStart + service.durationMinutes;
    const bookedRanges = await getBookedRanges(doctorId, dayStart);
    const conflict = bookedRanges.some(([bookedStart, bookedEnd]) => rangesOverlap(slotStart, slotEnd, bookedStart, bookedEnd));
    if (conflict) {
      return res.status(409).json({ success: false, data: null, message: 'This time slot is no longer available. Please choose another.' });
    }

    let appointment;
    try {
      appointment = await Appointment.create({
        patientId: req.user._id,
        doctorId,
        serviceId,
        date: dayStart,
        timeSlot,
        status: 'pending',
        paymentStatus: 'not_required',
      });
    } catch (error) {
      // Atomic safety net: the partial unique index on {doctorId, date, timeSlot}
      // catches a concurrent request that slipped past the check above.
      if (error.code === 11000) {
        return res.status(409).json({ success: false, data: null, message: 'This time slot is no longer available. Please choose another.' });
      }
      throw error;
    }

    return res.status(201).json({ success: true, data: { appointment }, message: 'Appointment requested.' });
  } catch (error) {
    next(error);
  }
}

async function listMyAppointments(req, res, next) {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate('doctorId', 'name specialization photoUrl')
      .populate('serviceId', 'name durationMinutes price')
      .sort({ date: -1, timeSlot: -1 });
    return res.status(200).json({ success: true, data: { appointments }, message: 'OK' });
  } catch (error) {
    next(error);
  }
}

async function listDoctorAppointments(req, res, next) {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate('patientId', 'name email phone')
      .populate('serviceId', 'name durationMinutes price')
      .sort({ date: -1, timeSlot: -1 });
    return res.status(200).json({ success: true, data: { appointments }, message: 'OK' });
  } catch (error) {
    next(error);
  }
}

async function cancelAppointment(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid appointment id.' });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, data: null, message: 'Appointment not found.' });
    }
    if (String(appointment.patientId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, data: null, message: 'You can only cancel your own appointments.' });
    }
    if (!['pending', 'confirmed'].includes(appointment.status)) {
      return res.status(400).json({ success: false, data: null, message: 'This appointment can no longer be cancelled.' });
    }

    const appointmentDateTime = combineDateAndTime(appointment.date, appointment.timeSlot);
    if (appointmentDateTime <= new Date()) {
      return res.status(400).json({ success: false, data: null, message: 'Past appointments cannot be cancelled.' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return res.status(200).json({ success: true, data: { appointment }, message: 'Appointment cancelled.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAvailableSlots,
  createAppointment,
  listMyAppointments,
  listDoctorAppointments,
  cancelAppointment,
};
