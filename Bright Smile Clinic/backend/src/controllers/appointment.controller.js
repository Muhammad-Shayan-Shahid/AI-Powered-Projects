const mongoose = require('mongoose');
const Appointment = require('../models/appointment.model');
const bookingService = require('../services/booking.service');
const { combineDateAndTime } = bookingService;
const {
  notifyAppointmentCreated,
  notifyAppointmentConfirmed,
  notifyAppointmentRejected,
} = require('../services/notification.service');

// Thin HTTP wrappers around booking.service.js — the actual slot-generation
// and slot-conflict logic lives there so the chatbot's booking tools
// (chatbot.service.js) can call the exact same code in-process, with zero
// duplication. See booking.service.js for the implementation.

async function getAvailableSlots(req, res, next) {
  try {
    const { doctorId, serviceId, date } = req.validatedQuery;
    const result = await bookingService.computeAvailableSlots({ doctorId, serviceId, date });
    if (result.error) {
      return res.status(result.error.status).json({ success: false, data: null, message: result.error.message });
    }
    return res.status(200).json({ success: true, data: { slots: result.slots }, message: 'OK' });
  } catch (error) {
    next(error);
  }
}

async function createAppointment(req, res, next) {
  try {
    const { doctorId, serviceId, date, timeSlot } = req.body;
    const result = await bookingService.bookAppointment({ patientId: req.user._id, doctorId, serviceId, date, timeSlot });
    if (result.error) {
      return res.status(result.error.status).json({ success: false, data: null, message: result.error.message });
    }

    const { appointment, doctor, service } = result;

    // Fire-and-forget: a socket/email failure must never break or slow the booking response.
    notifyAppointmentCreated({ appointment, doctor, patient: req.user, service }).catch((error) => {
      console.error('Failed to send appointment:created notification', error);
    });

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

async function confirmAppointment(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid appointment id.' });
    }

    const appointment = await Appointment.findById(id)
      .populate('patientId', 'name email')
      .populate('serviceId', 'name');
    if (!appointment) {
      return res.status(404).json({ success: false, data: null, message: 'Appointment not found.' });
    }
    if (String(appointment.doctorId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, data: null, message: 'You can only confirm your own appointments.' });
    }
    if (appointment.status !== 'pending') {
      return res.status(400).json({ success: false, data: null, message: 'Only pending appointments can be confirmed.' });
    }

    appointment.status = 'confirmed';
    await appointment.save();

    // Fire-and-forget: a socket/email failure must never break or slow this response.
    notifyAppointmentConfirmed({ appointment, doctor: req.user }).catch((error) => {
      console.error('Failed to send appointment:confirmed notification', error);
    });

    return res.status(200).json({ success: true, data: { appointment }, message: 'Appointment confirmed.' });
  } catch (error) {
    next(error);
  }
}

async function rejectAppointment(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid appointment id.' });
    }

    const appointment = await Appointment.findById(id)
      .populate('patientId', 'name email')
      .populate('serviceId', 'name');
    if (!appointment) {
      return res.status(404).json({ success: false, data: null, message: 'Appointment not found.' });
    }
    if (String(appointment.doctorId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, data: null, message: 'You can only reject your own appointments.' });
    }
    if (appointment.status !== 'pending') {
      return res.status(400).json({ success: false, data: null, message: 'Only pending appointments can be rejected.' });
    }

    const { reason } = req.body;
    appointment.status = 'rejected';
    if (reason) appointment.rejectionReason = reason;
    await appointment.save();

    // Fire-and-forget: a socket/email failure must never break or slow this response.
    notifyAppointmentRejected({ appointment, doctor: req.user }).catch((error) => {
      console.error('Failed to send appointment:rejected notification', error);
    });

    return res.status(200).json({ success: true, data: { appointment }, message: 'Appointment rejected.' });
  } catch (error) {
    next(error);
  }
}

// "Patients seen" counts only encounters the doctor actually had (confirmed or
// completed) — pending/rejected/cancelled appointments were never seen.
async function getDoctorStats(req, res, next) {
  try {
    const doctorId = req.user._id;
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const [pendingCount, todaysConfirmedCount, distinctPatients] = await Promise.all([
      Appointment.countDocuments({ doctorId, status: 'pending' }),
      Appointment.countDocuments({ doctorId, status: 'confirmed', date: todayStart }),
      Appointment.distinct('patientId', { doctorId, status: { $in: ['confirmed', 'completed'] } }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        pendingCount,
        todaysConfirmedCount,
        totalPatientsSeen: distinctPatients.length,
      },
      message: 'OK',
    });
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
  confirmAppointment,
  rejectAppointment,
  getDoctorStats,
  cancelAppointment,
};
