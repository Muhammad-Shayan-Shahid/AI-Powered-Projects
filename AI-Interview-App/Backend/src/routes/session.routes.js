import express from 'express';
import { startSession, completeSession, getSessionReport } from '../controllers/session.controllers.js';
import authMiddleware from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/start', authMiddleware, startSession);
router.post('/complete', authMiddleware, completeSession);
router.get('/report/:sessionId', authMiddleware, getSessionReport);

export default router;