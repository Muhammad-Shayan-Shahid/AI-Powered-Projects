const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    // Stored as a UTC midnight timestamp for the calendar day (no time-of-day
    // component) so { doctorId, date, timeSlot } queries are exact matches.
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    // Driven by Stripe Checkout (Phase 10): new appointments start 'pending',
    // flip to 'paid' via the checkout.session.completed webhook. 'not_required'
    // remains only for appointments created before this phase.
    paymentStatus: {
      type: String,
      enum: ['not_required', 'pending', 'paid'],
      default: 'not_required',
    },
    // Optional note a doctor can leave when rejecting a pending request.
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Belt-and-suspenders against double-booking: the controller re-checks
// availability before insert, but this index is what actually guarantees no
// two active (pending/confirmed) appointments can ever land on the same
// doctor+date+timeSlot, even under a concurrent race the pre-check misses.
appointmentSchema.index(
  { doctorId: 1, date: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } } }
);

appointmentSchema.index({ patientId: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
