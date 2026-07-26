const express = require('express');
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

// Catch-all for unmatched routes.
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
