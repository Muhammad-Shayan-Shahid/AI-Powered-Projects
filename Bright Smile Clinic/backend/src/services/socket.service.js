const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const { JWT_SECRET } = require('../config/config');
const User = require('../models/user.model');

let io = null;

// One shared io instance for the whole app — every feature emits through
// getIO() rather than creating its own server.
function initSocket(httpServer, clientUrl) {
  io = new Server(httpServer, {
    cors: { origin: clientUrl, credentials: true },
  });

  // Sockets carry the same httpOnly JWT cookie as regular requests — parse and
  // verify it during the handshake so unauthenticated sockets never connect.
  io.use(async (socket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie;
      const token = rawCookie ? cookie.parse(rawCookie).token : null;
      if (!token) {
        return next(new Error('Not authenticated.'));
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error('Not authenticated.'));
      }

      socket.userId = String(user._id);
      next();
    } catch (error) {
      next(new Error('Not authenticated.'));
    }
  });

  io.on('connection', (socket) => {
    // Each user gets a private room keyed to their own id, so events can be
    // targeted at exactly one user without tracking socket ids anywhere.
    socket.join(socket.userId);
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io has not been initialized. Call initSocket() first.');
  }
  return io;
}

module.exports = { initSocket, getIO };
