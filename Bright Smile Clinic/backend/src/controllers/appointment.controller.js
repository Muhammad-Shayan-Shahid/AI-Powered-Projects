import Appointment from "../models/appointment.model.js";

export async function createAppointment(req, res, next) {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
}

export async function getAppointments(req, res, next) {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    next(err);
  }
}
