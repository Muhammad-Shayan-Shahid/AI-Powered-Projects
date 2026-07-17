const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } = require('../config/config');

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days, matches JWT_EXPIRES_IN

function signToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// httpOnly + secure cookie so the token is never reachable from JS (XSS-safe),
// as locked in CLAUDE.md. sameSite 'lax' keeps it usable in local dev across ports.
function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
  });
}

// Never leak the hashed password or __v out of the API.
function sanitizeUser(user) {
  const { _id, name, email, phone, role, status, specialization, bio, photoUrl, createdAt } = user;
  return { id: _id, name, email, phone, role, status, specialization, bio, photoUrl, createdAt };
}

async function registerPatient(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, data: null, message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password, phone, role: 'patient', status: 'active' });
    const token = signToken(user._id);
    setAuthCookie(res, token);

    return res.status(201).json({ success: true, data: { user: sanitizeUser(user) }, message: 'Account created.' });
  } catch (error) {
    next(error);
  }
}

async function registerDoctor(req, res, next) {
  try {
    const { name, email, password, phone, specialization, bio, photoUrl } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, data: null, message: 'An account with this email already exists.' });
    }

    // New doctor signups start pending — they cannot log into the dashboard until an admin approves them.
    const user = await User.create({
      name,
      email,
      password,
      phone,
      specialization,
      bio,
      photoUrl,
      role: 'doctor',
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      data: { user: sanitizeUser(user) },
      message: 'Application submitted. Your account is pending admin approval.',
    });
  } catch (error) {
    next(error);
  }
}

// Shared by the patient/doctor/admin login routes — each route pins `role`
// so a patient can't log in through the doctor form, etc.
function login(role) {
  return async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email, role }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, data: null, message: 'Invalid email or password.' });
      }

      // Doctors awaiting approval get a distinct response, not a generic error,
      // so the frontend can route them to the Pending Approval screen.
      if (role === 'doctor' && user.status === 'pending') {
        return res.status(200).json({
          success: true,
          data: { pending: true, user: sanitizeUser(user) },
          message: 'Your account is pending admin approval.',
        });
      }

      const token = signToken(user._id);
      setAuthCookie(res, token);

      return res.status(200).json({ success: true, data: { user: sanitizeUser(user) }, message: 'Logged in.' });
    } catch (error) {
      next(error);
    }
  };
}

function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return res.status(200).json({ success: true, data: null, message: 'Logged out.' });
}

function getMe(req, res) {
  return res.status(200).json({ success: true, data: { user: sanitizeUser(req.user) }, message: 'OK' });
}

module.exports = {
  registerPatient,
  registerDoctor,
  login,
  logout,
  getMe,
};
