const { z } = require('zod');
const { objectId } = require('./common');

// photoUrl is no longer client-supplied — it's derived server-side from the
// uploaded file (see upload.service.js), never accepted directly as input.
// removePhoto is a multipart form field, so it arrives as the string "true",
// not a boolean — the controller checks it against that literal.
const updateDoctorProfileSchema = z.object({
  specialization: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  removePhoto: z.string().optional(),
});

// Full replace of the doctor's services list (not a partial patch) — an
// empty array is valid and means "no services listed yet".
const updateDoctorServicesSchema = z.object({
  services: z.array(objectId),
});

module.exports = { updateDoctorProfileSchema, updateDoctorServicesSchema };
