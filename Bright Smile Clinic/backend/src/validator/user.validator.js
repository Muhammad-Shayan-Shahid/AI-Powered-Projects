const { z } = require('zod');

const updateDoctorProfileSchema = z.object({
  specialization: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  photoUrl: z.string().trim().optional(),
});

module.exports = { updateDoctorProfileSchema };
