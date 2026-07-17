const express = require('express');
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const {
  validate,
  registerPatientSchema,
  registerDoctorSchema,
  loginSchema,
} = require('../validator/auth.validator');

const router = express.Router();

router.post('/patient/signup', validate(registerPatientSchema), authController.registerPatient);
router.post('/patient/login', validate(loginSchema), authController.login('patient'));

router.post('/doctor/signup', validate(registerDoctorSchema), authController.registerDoctor);
router.post('/doctor/login', validate(loginSchema), authController.login('doctor'));

router.post('/admin/login', validate(loginSchema), authController.login('admin'));

router.post('/logout', authController.logout);
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
