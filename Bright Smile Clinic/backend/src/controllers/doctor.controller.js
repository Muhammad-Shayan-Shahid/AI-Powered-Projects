const User = require('../models/user.model');

// Public directory of doctors patients can browse/book against — only active
// (admin-approved) doctors are exposed, never pending ones.
async function listDoctors(req, res, next) {
  try {
    const doctors = await User.find({ role: 'doctor', status: 'active' })
      .select('name specialization bio photoUrl')
      .sort({ name: 1 });
    return res.status(200).json({ success: true, data: { doctors }, message: 'OK' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listDoctors };
