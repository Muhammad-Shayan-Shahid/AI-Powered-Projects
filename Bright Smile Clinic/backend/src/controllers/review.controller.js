const Appointment = require('../models/appointment.model');
const Review = require('../models/review.model');

// Patients can only review an appointment that's actually theirs and that
// actually happened (status: 'completed') — never a pending/confirmed/
// rejected/cancelled one, and never someone else's appointment.
async function createReview(req, res, next) {
  try {
    const { appointmentId, rating, comment } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, data: null, message: 'Appointment not found.' });
    }
    if (String(appointment.patientId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, data: null, message: 'You can only review your own appointments.' });
    }
    if (appointment.status !== 'completed') {
      return res.status(400).json({ success: false, data: null, message: 'Only completed appointments can be reviewed.' });
    }

    const existing = await Review.findOne({ appointmentId });
    if (existing) {
      return res.status(409).json({ success: false, data: null, message: 'You have already reviewed this appointment.' });
    }

    let review;
    try {
      review = await Review.create({
        patientId: req.user._id,
        doctorId: appointment.doctorId,
        appointmentId,
        rating,
        comment,
      });
    } catch (error) {
      // Atomic safety net: the unique index on appointmentId catches a
      // concurrent double-submit that slipped past the check above.
      if (error.code === 11000) {
        return res.status(409).json({ success: false, data: null, message: 'You have already reviewed this appointment.' });
      }
      throw error;
    }

    return res.status(201).json({ success: true, data: { review }, message: 'Review submitted.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { createReview };
