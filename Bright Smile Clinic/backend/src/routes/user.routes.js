const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { validate } = require('../validator/common');
const { updateDoctorProfileSchema } = require('../validator/user.validator');
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

module.exports = router;
