const express = require('express');
const adminController = require('../controllers/admin.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { validate, validateQuery } = require('../validator/common');
const { rejectDoctorSchema, appointmentsQuerySchema } = require('../validator/admin.validator');

const router = express.Router();

router.use(verifyToken, requireRole('admin'));

router.get('/doctors/pending', adminController.listPendingDoctors);
router.patch('/doctors/:id/approve', adminController.approveDoctor);
router.patch('/doctors/:id/reject', validate(rejectDoctorSchema), adminController.rejectDoctor);

router.get('/appointments', validateQuery(appointmentsQuerySchema), adminController.listAllAppointments);

module.exports = router;
