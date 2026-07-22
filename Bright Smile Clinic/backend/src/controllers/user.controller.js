const User = require('../models/user.model');
const { sanitizeUser } = require('./auth.controller');
const { uploadToImageKit } = require('../services/upload.service');

// Doctors editing their own public-facing profile fields — never touches
// role/status/email, so this can't be used to self-approve or change identity.
// A new photo (req.file, see upload.middleware.js's uploadImage) is uploaded
// to ImageKit and the returned URL replaces photoUrl; removePhoto clears it
// back to empty instead; without either, the existing photoUrl is untouched.
// A new file always wins over removePhoto if both are somehow sent together.
async function updateDoctorProfile(req, res, next) {
  try {
    const { specialization, bio, removePhoto } = req.body;

    if (specialization !== undefined) req.user.specialization = specialization;
    if (bio !== undefined) req.user.bio = bio;

    if (req.file) {
      req.user.photoUrl = await uploadToImageKit({
        buffer: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: '/doctor-photos',
      });
    } else if (removePhoto === 'true') {
      req.user.photoUrl = '';
    }

    await req.user.save();

    return res.status(200).json({ success: true, data: { user: sanitizeUser(req.user) }, message: 'Profile updated.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { updateDoctorProfile };
