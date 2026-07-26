const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { CLIENT_URL } = require('./config/config');
const authRoutes = require('./routes/auth.routes');
const serviceRoutes = require('./routes/service.routes');
const doctorRoutes = require('./routes/doctor.routes');
const availabilityRoutes = require('./routes/availability.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const documentRoutes = require('./routes/document.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const reviewRoutes = require('./routes/review.routes');
const paymentRoutes = require('./routes/payment.routes');
const paymentController = require('./controllers/payment.controller');

const app = express();

// credentials: true is required for the httpOnly auth cookie to be sent/received
// across the frontend (Vite) <-> backend dev servers, which run on different origins.
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// Stripe webhook signature verification needs the raw, unparsed request body,
// so this route MUST be registered before express.json() below — once the
// global JSON parser consumes the body, the raw bytes needed for the
// signature check are gone. Every other route (including the rest of
// payment.routes.js) is mounted after express.json() as usual.
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

app.use(express.json());
app.use(cookieParser());

// Health check route to confirm the API is reachable.
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/documents', documentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);

// Single combined deployment: this Express server also serves the built React
// app (manually built + copied into backend/public — see CLAUDE.md's "Manual
// deploy" convention) so only one Render service is needed. This MUST come
// after every /api route above — express.static/the SPA catch-all below only
// run once none of the API routes matched, so they can never shadow a real
// API response.
//
// trust proxy is required behind Render's reverse proxy so req.secure/req.ip
// and the httpOnly auth cookie's `secure` flag behave correctly.
app.set('trust proxy', 1);
app.use(express.static(path.resolve(__dirname, '../public')));

// Anything else that isn't an /api/* call is a client-side route (React
// Router) — serve index.html and let the browser router take over, so a hard
// refresh/direct URL visit on e.g. /booking/my-appointments works instead of
// 404ing. Express 5's path-to-regexp requires the named-wildcard `{*splat}`
// form instead of a bare `*`.
app.get('{*splat}', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// Catch-all for unmatched routes. The SPA catch-all above only registers for
// GET, so this is reached by non-GET requests to unmatched routes (including
// /api/*) — a GET to an unmatched /api/* path now gets index.html, not this
// JSON 404, since the SPA catch-all has no /api exclusion.
app.use((req, res) => {
  res.status(404).json({ success: false, data: null, message: 'Route not found.' });
});

// Centralized error handler — controllers call next(error) instead of letting
// promise rejections crash the process or leak stack traces to the client.
app.use((err, req, res, next) => {
  console.error(err);

  // Duplicate key (e.g. a race on the unique email index that the pre-check missed).
  if (err.code === 11000) {
    return res.status(409).json({ success: false, data: null, message: 'An account with this email already exists.' });
  }

  res.status(500).json({ success: false, data: null, message: 'Something went wrong. Please try again.' });
});

module.exports = app;
