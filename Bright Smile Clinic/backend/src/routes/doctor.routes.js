const express = require('express');
const doctorController = require('../controllers/doctor.controller');

const router = express.Router();

router.get('/', doctorController.listDoctors);

module.exports = router;
