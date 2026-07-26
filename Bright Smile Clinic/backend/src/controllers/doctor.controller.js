const mongoose = require('mongoose');
const User = require('../models/user.model');
const Review = require('../models/review.model');

// One aggregate query for however many doctors are in a listing, rather than
// one Review query per doctor — used by both listDoctors (card ratings) and
// getDoctor (full profile rating).
async function getRatingsByDoctorId(doctorIds) {
  const rows = await Review.aggregate([
    { $match: { doctorId: { $in: doctorIds } } },
    { $group: { _id: '$doctorId', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
  ]);
  return new Map(
    rows.map((row) => [String(row._id), { averageRating: Math.round(row.averageRating * 10) / 10, reviewCount: row.reviewCount }])
  );
}

// Public directory of doctors patients can browse/book against — only active
// (admin-approved) doctors are exposed, never pending/rejected/deactivated ones.
// Optional ?service= filters by the doctor's real `services` relationship
// (a Service ObjectId) — no longer specialization-text matching.
async function listDoctors(req, res, next) {
  try {
    const { service } = req.query;
    const filter = { role: 'doctor', status: 'active' };
    if (service) {
      if (!mongoose.Types.ObjectId.isValid(service)) {
        return res.status(400).json({ success: false, data: null, message: 'Invalid service id.' });
      }
      filter.services = service;
    }

    const doctors = await User.find(filter)
      .select('name specialization bio photoUrl featured services')
      .populate('services', 'name')
      .sort({ name: 1 })
      .lean();

    const ratingsById = await getRatingsByDoctorId(doctors.map((d) => d._id));
    const withRatings = doctors.map((doctor) => ({
      ...doctor,
      averageRating: ratingsById.get(String(doctor._id))?.averageRating || 0,
      reviewCount: ratingsById.get(String(doctor._id))?.reviewCount || 0,
    }));

    return res.status(200).json({ success: true, data: { doctors: withRatings }, message: 'OK' });
  } catch (error) {
    next(error);
  }
}

// Single active doctor's public profile, for the Doctor Profile screen —
// includes their services offered plus rating/review data computed live
// from Review (never stored as a fixed field on the doctor).
async function getDoctor(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid doctor id.' });
    }

    const doctor = await User.findOne({ _id: id, role: 'doctor', status: 'active' })
      .select('name specialization bio photoUrl featured services')
      .populate('services', 'name');
    if (!doctor) {
      return res.status(404).json({ success: false, data: null, message: 'Doctor not found.' });
    }

    const [reviews, ratingsById] = await Promise.all([
      Review.find({ doctorId: id }).populate('patientId', 'name').sort({ createdAt: -1 }),
      getRatingsByDoctorId([doctor._id]),
    ]);
    const { averageRating = 0, reviewCount = 0 } = ratingsById.get(String(doctor._id)) || {};

    return res.status(200).json({
      success: true,
      data: { doctor, averageRating, reviewCount, reviews },
      message: 'OK',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { listDoctors, getDoctor };
