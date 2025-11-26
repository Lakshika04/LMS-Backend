import express from 'express';
import multer from 'multer';
import { 
    uploadVideoAndCreateLesson, 
    getLessonsByCourse, 
    streamLesson, 
    getImageKitAuth 
} from '../controllers/lesson.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Configure multer for video upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed'), false);
        }
    }
});

// Routes
router.post('/upload', authenticateToken, upload.single('video'), uploadVideoAndCreateLesson);
router.get('/course/:courseId', getLessonsByCourse);
router.get('/stream/:lessonId', authenticateToken, streamLesson);
router.get('/imagekit-auth', authenticateToken, getImageKitAuth);

export default router;