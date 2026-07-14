import { Router } from "express";
import { chatValidator } from "../validators/chat.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { handleChat } from "../controllers/chat.controller.js";

const router = Router();

router.post("/", chatValidator, validate, handleChat);

export default router;
