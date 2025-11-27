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

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'UNEXPECTED_FIELD') {
            return res.status(400).json({ 
                message: 'Unexpected field. Please use "video" as the field name for file upload.' 
            });
        }
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                message: 'File too large. Maximum size is 500MB.' 
            });
        }
    }
    if (error.message === 'Only video files are allowed') {
        return res.status(400).json({ message: error.message });
    }
    next(error);
};




// Routes - flexible upload that accepts any single file
router.post('/upload', authenticateToken, upload.any(), handleMulterError, uploadVideoAndCreateLesson);
// Alternative route with specific field name
router.post('/upload-video', authenticateToken, upload.single('video'), handleMulterError, uploadVideoAndCreateLesson);
router.get('/course/:courseId', getLessonsByCourse);
router.get('/stream/:lessonId', authenticateToken, streamLesson);
router.get('/imagekit-auth', authenticateToken, getImageKitAuth);

export default router;