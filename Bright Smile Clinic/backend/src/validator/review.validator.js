const { z } = require('zod');
const { objectId } = require('./common');

const createReviewSchema = z.object({
  appointmentId: objectId,
  rating: z.coerce.number().int().min(1, 'rating must be between 1 and 5.').max(5, 'rating must be between 1 and 5.'),
  comment: z.string().trim().optional(),
});

module.exports = { createReviewSchema };
