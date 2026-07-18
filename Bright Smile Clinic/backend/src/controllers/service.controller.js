const Service = require('../models/service.model');

async function listServices(req, res, next) {
  try {
    const services = await Service.find().sort({ name: 1 });
    return res.status(200).json({ success: true, data: { services }, message: 'OK' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listServices };
