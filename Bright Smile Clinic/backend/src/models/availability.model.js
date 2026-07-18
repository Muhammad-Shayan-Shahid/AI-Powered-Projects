const mongoose = require('mongoose');

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const availabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    startTime: {
      type: String,
      required: true,
      match: TIME_REGEX,
    },
    endTime: {
      type: String,
      required: true,
      match: TIME_REGEX,
      // Schema-level validation so a bad window can never persist, even if
      // something bypasses the zod validator (e.g. a future admin script).
      validate: {
        validator: function endsAfterStart(value) {
          return value > this.startTime;
        },
        message: 'endTime must be after startTime.',
      },
    },
  },
  { timestamps: true }
);

availabilitySchema.index({ doctorId: 1, dayOfWeek: 1 });

module.exports = mongoose.model('Availability', availabilitySchema);
