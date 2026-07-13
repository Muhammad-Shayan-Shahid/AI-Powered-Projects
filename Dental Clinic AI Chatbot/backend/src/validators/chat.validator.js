import { body } from "express-validator";

export const chatValidator = [
  body("question")
    .trim()
    .notEmpty()
    .withMessage("Question is required")
    .isLength({ max: 500 })
    .withMessage("Question must be under 500 characters"),
];
