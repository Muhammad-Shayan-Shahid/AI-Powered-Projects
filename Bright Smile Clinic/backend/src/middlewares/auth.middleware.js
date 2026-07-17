const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const User = require('../models/user.model');

// Reads the httpOnly auth cookie, verifies it, and attaches the user to req.
// Runs before any protected controller.
async function verifyToken(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, data: null, message: 'Not authenticated.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, data: null, message: 'Not authenticated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, data: null, message: 'Invalid or expired session.' });
  }
}

// Restricts a route to specific roles, e.g. requireRole('doctor', 'admin').
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, data: null, message: 'Access denied.' });
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };
