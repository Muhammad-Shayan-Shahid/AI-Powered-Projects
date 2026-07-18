const mongoose = require('mongoose');
const Availability = require('../models/availability.model');

async function createAvailability(req, res, next) {
  try {
    const { dayOfWeek, startTime, endTime } = req.body;
    const availability = await Availability.create({
      doctorId: req.user._id,
      dayOfWeek,
      startTime,
      endTime,
    });
    return res.status(201).json({ success: true, data: { availability }, message: 'Availability added.' });
  } catch (error) {
    next(error);
  }
}

async function listMyAvailability(req, res, next) {
  try {
    const availability = await Availability.find({ doctorId: req.user._id }).sort({ dayOfWeek: 1, startTime: 1 });
    return res.status(200).json({ success: true, data: { availability }, message: 'OK' });
  } catch (error) {
    next(error);
  }
}

async function updateAvailability(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid availability id.' });
    }

    const availability = await Availability.findById(id);
    if (!availability) {
      return res.status(404).json({ success: false, data: null, message: 'Availability not found.' });
    }
    if (String(availability.doctorId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, data: null, message: 'You can only edit your own availability.' });
    }

    const { dayOfWeek, startTime, endTime } = req.body;
    if (dayOfWeek !== undefined) availability.dayOfWeek = dayOfWeek;
    if (startTime !== undefined) availability.startTime = startTime;
    if (endTime !== undefined) availability.endTime = endTime;
    await availability.save();

    return res.status(200).json({ success: true, data: { availability }, message: 'Availability updated.' });
  } catch (error) {
    next(error);
  }
}

async function deleteAvailability(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid availability id.' });
    }

    const availability = await Availability.findById(id);
    if (!availability) {
      return res.status(404).json({ success: false, data: null, message: 'Availability not found.' });
    }
    if (String(availability.doctorId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, data: null, message: 'You can only delete your own availability.' });
    }

    await availability.deleteOne();
    return res.status(200).json({ success: true, data: null, message: 'Availability removed.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { createAvailability, listMyAvailability, updateAvailability, deleteAvailability };
