const express = require('express');
const serviceController = require('../controllers/service.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { validate } = require('../validator/common');
const { createServiceSchema, updateServiceSchema } = require('../validator/service.validator');

const router = express.Router();

router.get('/', serviceController.listServices);
router.post('/', verifyToken, requireRole('admin'), validate(createServiceSchema), serviceController.createService);
router.put('/:id', verifyToken, requireRole('admin'), validate(updateServiceSchema), serviceController.updateService);
router.delete('/:id', verifyToken, requireRole('admin'), serviceController.deleteService);

module.exports = router;
