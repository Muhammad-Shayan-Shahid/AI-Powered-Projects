import { Router } from "express";
import { appointmentValidator } from "../validators/appointment.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createAppointment, getAppointments } from "../controllers/appointment.controller.js";

const router = Router();

router.post("/", appointmentValidator, validate, createAppointment);
router.get("/", getAppointments);

export default router;
