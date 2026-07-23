const express = require('express');
const doctorController = require('../controllers/doctor.controller');

const router = express.Router();

router.get('/', doctorController.listDoctors);
router.get('/:id', doctorController.getDoctor);

module.exports = router;
