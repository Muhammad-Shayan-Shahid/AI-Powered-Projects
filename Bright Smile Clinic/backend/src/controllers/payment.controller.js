const Appointment = require('../models/appointment.model');
const paymentService = require('../services/payment.service');

// A patient can only pay for their own appointment, only once the doctor has
// confirmed it, and only once — never trust the frontend's view of these
// three facts, always re-check server-side (same rule as slot booking).
async function createCheckoutSession(req, res, next) {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId).populate('serviceId', 'name price');
    if (!appointment) {
      return res.status(404).json({ success: false, data: null, message: 'Appointment not found.' });
    }
    if (String(appointment.patientId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, data: null, message: 'You can only pay for your own appointments.' });
    }
    if (appointment.status !== 'confirmed') {
      return res
        .status(400)
        .json({ success: false, data: null, message: 'This appointment must be confirmed by the doctor before it can be paid for.' });
    }
    if (appointment.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, data: null, message: 'This appointment has already been paid for.' });
    }

    const session = await paymentService.createCheckoutSession({ appointment, service: appointment.serviceId });

    return res.status(200).json({ success: true, data: { checkoutUrl: session.url }, message: 'Checkout session created.' });
  } catch (error) {
    next(error);
  }
}

// Public route, trusted only via Stripe's signature (verified in
// payment.service.js's constructWebhookEvent) — never by auth middleware.
// Must always respond 200 once the event itself is authenticated, even if the
// appointment it refers to can't be found, so Stripe doesn't retry forever.
async function handleWebhook(req, res) {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = paymentService.constructWebhookEvent(req.body, signature);
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const appointmentId = session.metadata?.appointmentId;

    if (!appointmentId) {
      console.error(`Stripe webhook: checkout.session.completed (session ${session.id}) had no appointmentId in metadata.`);
      return res.status(200).json({ received: true });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      console.error(`Stripe webhook: no appointment found for id ${appointmentId} (session ${session.id}).`);
      return res.status(200).json({ received: true });
    }

    appointment.paymentStatus = 'paid';
    await appointment.save();
  }

  return res.status(200).json({ received: true });
}

module.exports = { createCheckoutSession, handleWebhook };
