const { z } = require('zod');
const { objectId } = require('./common');

const createCheckoutSessionSchema = z.object({
  appointmentId: objectId,
});

module.exports = { createCheckoutSessionSchema };
