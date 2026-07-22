const { z } = require('zod');
const { objectId } = require('./common');

const rejectDoctorSchema = z.object({
  reason: z.string().trim().optional(),
});

const appointmentsQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'rejected', 'completed', 'cancelled']).optional(),
  doctorId: objectId.optional(),
});

module.exports = { rejectDoctorSchema, appointmentsQuerySchema };
