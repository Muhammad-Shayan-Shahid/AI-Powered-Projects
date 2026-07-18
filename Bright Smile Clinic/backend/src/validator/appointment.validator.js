const { z } = require('zod');
const { objectId, isoDate, timeOfDay } = require('./common');

const availableSlotsQuerySchema = z.object({
  doctorId: objectId,
  serviceId: objectId,
  date: isoDate,
});

const createAppointmentSchema = z.object({
  doctorId: objectId,
  serviceId: objectId,
  date: isoDate,
  timeSlot: timeOfDay,
});

module.exports = { availableSlotsQuerySchema, createAppointmentSchema };
