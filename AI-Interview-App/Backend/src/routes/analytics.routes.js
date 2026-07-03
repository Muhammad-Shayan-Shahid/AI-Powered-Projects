import express from 'express';
import { getDashboard,getWeakTopics,getImprovement,getConfidence,getSessionHistory } from '../controllers/analytics.controllers.js';
import authMiddleware from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.get('/dashboard',        authMiddleware, getDashboard);
router.get('/weak-topics',      authMiddleware, getWeakTopics);
router.get('/improvement',      authMiddleware, getImprovement);
router.get('/confidence',       authMiddleware, getConfidence);
router.get('/session-history',  authMiddleware, getSessionHistory);

export default router;
