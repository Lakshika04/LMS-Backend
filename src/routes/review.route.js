import express from 'express';
import { addReview, deleteReview } from '../controllers/review.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All review routes require authentication
router.post('/:courseId', authenticateToken, addReview);
router.delete("/:reviewId", authenticateToken, deleteReview);

export default router;