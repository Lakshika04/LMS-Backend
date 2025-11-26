import express from 'express';
import { addCourse, getCourses } from '../controllers/course.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizedRoles } from '../middleware/roles.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);

// Protected routes - Instructor only
router.post('/', authenticateToken, authorizedRoles('instructor'), addCourse);

export default router;