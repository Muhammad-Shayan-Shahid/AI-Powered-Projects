const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { validate } = require('../validator/common');
const { updateDoctorProfileSchema, updateDoctorServicesSchema } = require('../validator/user.validator');
const { uploadImage } = require('../middlewares/upload.middleware');

const router = express.Router();

router.patch(
  '/doctor-profile',
  verifyToken,
  requireRole('doctor'),
  uploadImage,
  validate(updateDoctorProfileSchema),
  userController.updateDoctorProfile
);

// Mounted under /api/users (not /api/doctor/services) to follow this project's
// locked-in auth/users split: `users` owns every doctor self-service edit
// (see PATCH /api/users/doctor-profile), so the "services offered" editor
// lives alongside it rather than starting a second self-edit route family.
router.patch(
  '/doctor-services',
  verifyToken,
  requireRole('doctor'),
  validate(updateDoctorServicesSchema),
  userController.updateDoctorServices
);

module.exports = router;
