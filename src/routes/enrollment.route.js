import express from 'express';
import { enrollInCourse, getMyCourses } from '../controllers/enrollment.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All enrollment routes require authentication
router.post('/', authenticateToken, enrollInCourse);
router.get('/my-courses', authenticateToken, getMyCourses);

export default router;