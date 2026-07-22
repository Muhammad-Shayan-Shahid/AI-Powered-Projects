const mongoose = require('mongoose');
const Service = require('../models/service.model');

async function listServices(req, res, next) {
  try {
    const services = await Service.find().sort({ name: 1 });
    return res.status(200).json({ success: true, data: { services }, message: 'OK' });
  } catch (error) {
    next(error);
  }
}

async function createService(req, res, next) {
  try {
    const { name, description, durationMinutes, price } = req.body;
    const service = await Service.create({ name, description, durationMinutes, price });
    return res.status(201).json({ success: true, data: { service }, message: 'Service created.' });
  } catch (error) {
    next(error);
  }
}

async function updateService(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid service id.' });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, data: null, message: 'Service not found.' });
    }

    const { name, description, durationMinutes, price } = req.body;
    if (name !== undefined) service.name = name;
    if (description !== undefined) service.description = description;
    if (durationMinutes !== undefined) service.durationMinutes = durationMinutes;
    if (price !== undefined) service.price = price;
    await service.save();

    return res.status(200).json({ success: true, data: { service }, message: 'Service updated.' });
  } catch (error) {
    next(error);
  }
}

async function deleteService(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid service id.' });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, data: null, message: 'Service not found.' });
    }

    await service.deleteOne();
    return res.status(200).json({ success: true, data: null, message: 'Service removed.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listServices, createService, updateService, deleteService };
