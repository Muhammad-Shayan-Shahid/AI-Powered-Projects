const Stripe = require('stripe');
const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_CURRENCY, CLIENT_URL } = require('../config/config');

// Constructed lazily (not at module load) because the Stripe SDK throws
// immediately if the API key is missing — doing this at require-time would
// crash the entire app on startup whenever STRIPE_SECRET_KEY isn't set yet,
// instead of only failing the one request that actually needs it.
let stripe = null;
function getStripe() {
  if (!stripe) stripe = new Stripe(STRIPE_SECRET_KEY);
  return stripe;
}

// Stripe wants the smallest currency unit (e.g. cents for usd) — Service.price
// is stored as a plain decimal number, so this is the one place it gets
// multiplied up before being sent to Stripe.
function toStripeAmount(price) {
  return Math.round(price * 100);
}

// appointmentId travels in the session metadata so the webhook can identify
// which appointment a given checkout.session.completed event belongs to —
// Stripe Checkout has no other reliable link back to our own records.
async function createCheckoutSession({ appointment, service }) {
  return getStripe().checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: STRIPE_CURRENCY,
          product_data: { name: service.name },
          unit_amount: toStripeAmount(service.price),
        },
        quantity: 1,
      },
    ],
    metadata: { appointmentId: String(appointment._id) },
    success_url: `${CLIENT_URL}/booking/payment-success?appointmentId=${appointment._id}`,
    cancel_url: `${CLIENT_URL}/booking/payment-cancelled?appointmentId=${appointment._id}`,
  });
}

// Throws if the signature doesn't match — callers must treat that as a
// rejected/untrusted request, never as a normal application error.
function constructWebhookEvent(rawBody, signature) {
  return getStripe().webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
}

module.exports = { createCheckoutSession, constructWebhookEvent };
