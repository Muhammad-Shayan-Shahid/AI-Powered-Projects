const User = require('../models/user.model');
const { sanitizeUser } = require('./auth.controller');

// Doctors editing their own public-facing profile fields — never touches
// role/status/email, so this can't be used to self-approve or change identity.
async function updateDoctorProfile(req, res, next) {
  try {
    const { specialization, bio, photoUrl } = req.body;

    if (specialization !== undefined) req.user.specialization = specialization;
    if (bio !== undefined) req.user.bio = bio;
    if (photoUrl !== undefined) req.user.photoUrl = photoUrl;
    await req.user.save();

    return res.status(200).json({ success: true, data: { user: sanitizeUser(req.user) }, message: 'Profile updated.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { updateDoctorProfile };
