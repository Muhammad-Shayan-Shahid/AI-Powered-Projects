const express = require('express');
const availabilityController = require('../controllers/availability.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { validate } = require('../validator/common');
const { createAvailabilitySchema, updateAvailabilitySchema } = require('../validator/availability.validator');

const router = express.Router();

router.use(verifyToken, requireRole('doctor'));

router.post('/', validate(createAvailabilitySchema), availabilityController.createAvailability);
router.get('/', availabilityController.listMyAvailability);
router.patch('/:id', validate(updateAvailabilitySchema), availabilityController.updateAvailability);
router.delete('/:id', availabilityController.deleteAvailability);

module.exports = router;
