import express from 'express';
import { submitAnswer } from '../controllers/answer.controllers.js';
import authMiddleware from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/submit', authMiddleware, submitAnswer);

export default router;