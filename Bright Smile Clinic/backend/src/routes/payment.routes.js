const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { validate } = require('../validator/common');
const { createCheckoutSessionSchema } = require('../validator/payment.validator');

const router = express.Router();

// The webhook route is NOT defined here — it's mounted directly in app.js,
// before the global express.json() middleware, since Stripe's signature
// verification requires the raw request body. See app.js for details.
router.post(
  '/create-checkout-session',
  verifyToken,
  requireRole('patient'),
  validate(createCheckoutSessionSchema),
  paymentController.createCheckoutSession
);

module.exports = router;
