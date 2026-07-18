const { z } = require('zod');
const { timeOfDay } = require('./common');

const dayOfWeek = z.coerce.number().int().min(0, 'dayOfWeek must be 0-6.').max(6, 'dayOfWeek must be 0-6.');

function endsAfterStart(data, ctx) {
  if (data.startTime && data.endTime && data.startTime >= data.endTime) {
    ctx.addIssue({ code: 'custom', message: 'endTime must be after startTime.', path: ['endTime'] });
  }
}

const createAvailabilitySchema = z
  .object({
    dayOfWeek,
    startTime: timeOfDay,
    endTime: timeOfDay,
  })
  .superRefine(endsAfterStart);

const updateAvailabilitySchema = z
  .object({
    dayOfWeek: dayOfWeek.optional(),
    startTime: timeOfDay.optional(),
    endTime: timeOfDay.optional(),
  })
  .superRefine(endsAfterStart);

module.exports = { createAvailabilitySchema, updateAvailabilitySchema };
