const { z } = require('zod');

const createServiceSchema = z.object({
  name: z.string().trim().min(1, 'name is required.'),
  description: z.string().trim().optional(),
  durationMinutes: z.coerce.number().int().min(5, 'durationMinutes must be at least 5.'),
  price: z.coerce.number().min(0, 'price cannot be negative.').optional(),
});

const updateServiceSchema = z.object({
  name: z.string().trim().min(1, 'name is required.').optional(),
  description: z.string().trim().optional(),
  durationMinutes: z.coerce.number().int().min(5, 'durationMinutes must be at least 5.').optional(),
  price: z.coerce.number().min(0, 'price cannot be negative.').optional(),
});

module.exports = { createServiceSchema, updateServiceSchema };
