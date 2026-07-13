import { body } from "express-validator";

export const appointmentValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("preferredDate")
    .isISO8601()
    .withMessage("A valid date is required")
    .custom((value) => new Date(value) > new Date())
    .withMessage("Preferred date must be in the future"),
  body("reason").trim().notEmpty().withMessage("Reason is required"),
];
