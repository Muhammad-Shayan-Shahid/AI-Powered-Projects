const { z } = require('zod');

// photoUrl is no longer client-supplied — it's derived server-side from the
// uploaded file (see upload.service.js), never accepted directly as input.
// removePhoto is a multipart form field, so it arrives as the string "true",
// not a boolean — the controller checks it against that literal.
const updateDoctorProfileSchema = z.object({
  specialization: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  removePhoto: z.string().optional(),
});

module.exports = { updateDoctorProfileSchema };
