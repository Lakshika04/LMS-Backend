import express from 'express';
import { markProgress } from '../controllers/progress.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All progress routes require authentication
router.post('/mark', authenticateToken, markProgress);

export default router;