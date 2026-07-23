const mongoose = require('mongoose');
const User = require('../models/user.model');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Public directory of doctors patients can browse/book against — only active
// (admin-approved) doctors are exposed, never pending/rejected/deactivated ones.
// Optional ?service= filters by specialization (case-insensitive exact match) —
// doctors have no relational link to Service, specialization is the closest field.
async function listDoctors(req, res, next) {
  try {
    const { service } = req.query;
    const filter = { role: 'doctor', status: 'active' };
    if (service) {
      filter.specialization = new RegExp(`^${escapeRegex(service)}$`, 'i');
    }

    const doctors = await User.find(filter)
      .select('name specialization bio photoUrl featured')
      .sort({ name: 1 });
    return res.status(200).json({ success: true, data: { doctors }, message: 'OK' });
  } catch (error) {
    next(error);
  }
}

// Single active doctor's public profile, for the Doctor Profile screen.
async function getDoctor(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid doctor id.' });
    }

    const doctor = await User.findOne({ _id: id, role: 'doctor', status: 'active' }).select(
      'name specialization bio photoUrl featured'
    );
    if (!doctor) {
      return res.status(404).json({ success: false, data: null, message: 'Doctor not found.' });
    }

    return res.status(200).json({ success: true, data: { doctor }, message: 'OK' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listDoctors, getDoctor };
