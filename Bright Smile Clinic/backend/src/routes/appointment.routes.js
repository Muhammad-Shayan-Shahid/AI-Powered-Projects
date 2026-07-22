const express = require('express');
const appointmentController = require('../controllers/appointment.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { validate, validateQuery } = require('../validator/common');
const { availableSlotsQuerySchema, createAppointmentSchema, rejectAppointmentSchema } = require('../validator/appointment.validator');

const router = express.Router();

// Public (like GET /api/services) so patients can browse open slots before signing in.
router.get('/available-slots', validateQuery(availableSlotsQuerySchema), appointmentController.getAvailableSlots);
router.post('/', verifyToken, requireRole('patient'), validate(createAppointmentSchema), appointmentController.createAppointment);
router.get('/mine', verifyToken, requireRole('patient'), appointmentController.listMyAppointments);
router.get('/doctor', verifyToken, requireRole('doctor'), appointmentController.listDoctorAppointments);
router.get('/doctor/stats', verifyToken, requireRole('doctor'), appointmentController.getDoctorStats);
router.patch('/:id/confirm', verifyToken, requireRole('doctor'), appointmentController.confirmAppointment);
router.patch('/:id/reject', verifyToken, requireRole('doctor'), validate(rejectAppointmentSchema), appointmentController.rejectAppointment);
router.patch('/:id/cancel', verifyToken, requireRole('patient'), appointmentController.cancelAppointment);

module.exports = router;
