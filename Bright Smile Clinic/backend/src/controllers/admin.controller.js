const mongoose = require('mongoose');
const User = require('../models/user.model');
const Appointment = require('../models/appointment.model');
const { sanitizeUser } = require('./auth.controller');
const { notifyDoctorApproved, notifyDoctorRejected } = require('../services/notification.service');

async function listPendingDoctors(req, res, next) {
  try {
    const doctors = await User.find({ role: 'doctor', status: 'pending' }).sort({ createdAt: 1 });
    return res.status(200).json({ success: true, data: { doctors: doctors.map(sanitizeUser) }, message: 'OK' });
  } catch (error) {
    next(error);
  }
}

async function approveDoctor(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid doctor id.' });
    }

    const doctor = await User.findOne({ _id: id, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, data: null, message: 'Doctor not found.' });
    }
    if (doctor.status !== 'pending') {
      return res.status(400).json({ success: false, data: null, message: 'Only pending doctors can be approved.' });
    }

    doctor.status = 'active';
    await doctor.save();

    // Fire-and-forget: a socket/email failure must never break or slow this response.
    notifyDoctorApproved({ doctor }).catch((error) => {
      console.error('Failed to send doctor:approved notification', error);
    });

    return res.status(200).json({ success: true, data: { doctor: sanitizeUser(doctor) }, message: 'Doctor approved.' });
  } catch (error) {
    next(error);
  }
}

async function rejectDoctor(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid doctor id.' });
    }

    const doctor = await User.findOne({ _id: id, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, data: null, message: 'Doctor not found.' });
    }
    if (doctor.status !== 'pending') {
      return res.status(400).json({ success: false, data: null, message: 'Only pending doctors can be rejected.' });
    }

    const { reason } = req.body;
    doctor.status = 'rejected';
    await doctor.save();

    // Fire-and-forget: a socket/email failure must never break or slow this response.
    notifyDoctorRejected({ doctor, reason }).catch((error) => {
      console.error('Failed to send doctor:rejected notification', error);
    });

    return res.status(200).json({ success: true, data: { doctor: sanitizeUser(doctor) }, message: 'Doctor rejected.' });
  } catch (error) {
    next(error);
  }
}

// Cross-doctor view for admin oversight, with optional status/doctorId filters —
// distinct from listMyAppointments/listDoctorAppointments, which are self-scoped.
async function listAllAppointments(req, res, next) {
  try {
    const { status, doctorId } = req.validatedQuery;

    const filter = {};
    if (status) filter.status = status;
    if (doctorId) filter.doctorId = doctorId;

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialization')
      .populate('serviceId', 'name durationMinutes price')
      .sort({ date: -1, timeSlot: -1 });

    return res.status(200).json({ success: true, data: { appointments }, message: 'OK' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listPendingDoctors, approveDoctor, rejectDoctor, listAllAppointments };
