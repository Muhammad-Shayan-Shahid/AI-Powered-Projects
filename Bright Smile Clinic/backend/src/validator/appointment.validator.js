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

const rejectAppointmentSchema = z.object({
  reason: z.string().trim().optional(),
});

module.exports = { availableSlotsQuerySchema, createAppointmentSchema, rejectAppointmentSchema };
