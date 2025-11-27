import Lesson from '../models/lesson.js';
import Course from '../models/course.js';
import imagekit from '../config/imagekit.js';
import { validateObjectId, validateRequiredFields, sanitizeInput } from '../utils/validation.js';

// Upload video to ImageKit and create lesson
const uploadVideoAndCreateLesson = async (req, res) => {
    try {
        if (!imagekit) {
            return res.status(503).json({ message: 'Video upload service not configured' });
        }

        const { courseId, title, order, freePreview } = req.body;
        // Handle both single file and multiple files upload
        const videoFile = req.file || (req.files && req.files[0]);

        validateRequiredFields(['courseId', 'title', 'order'], req.body);
        
        if (!videoFile) {
            return res.status(400).json({ message: 'Video file is required' });
        }
        
        // Validate file type
        if (!videoFile.mimetype.startsWith('video/')) {
            return res.status(400).json({ message: 'Only video files are allowed' });
        }

        if (!validateObjectId(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID' });
        }

        const sanitizedTitle = sanitizeInput(title);
        const orderNum = parseInt(order);
        
        if (isNaN(orderNum) || orderNum < 1) {
            return res.status(400).json({ message: 'Order must be a positive number' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to add lessons to this course' });
        }

        // Upload video to ImageKit
        const uploadResponse = await imagekit.upload({
            file: videoFile.buffer,
            fileName: `lesson_${Date.now()}_${videoFile.originalname}`,
            folder: `/courses/${courseId}/lessons/`,
            useUniqueFileName: true
        });

        // Create lesson with ImageKit video URL
        const lesson = await Lesson.create({
            course: courseId,
            title: sanitizedTitle,
            videoPath: uploadResponse.url,
            order: orderNum,
            freePreview: freePreview === 'true',
            duration: 0
        });

        res.status(201).json({
            message: 'Lesson created successfully',
            lesson,
            videoUrl: uploadResponse.url
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get lessons for a course
const getLessonsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        
        const lessons = await Lesson.find({ course: courseId })
            .sort({ order: 1 })
            .select('title order freePreview duration');

        res.status(200).json({
            message: 'Lessons fetched successfully',
            lessons
        });

    } catch (error) {
        console.error('Fetch lessons error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Stream lesson video (with access control)
const streamLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;
        
        const lesson = await Lesson.findById(lessonId).populate('course');
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Check if lesson is free preview or user has access
        if (!lesson.freePreview) {
            // Add enrollment check here if needed
            // const enrollment = await Enrollment.findOne({ 
            //     user: req.user._id, 
            //     course: lesson.course._id 
            // });
            // if (!enrollment) {
            //     return res.status(403).json({ message: 'Access denied. Please enroll in the course.' });
            // }
        }

        // Generate signed URL for secure video streaming
        let signedUrl = lesson.videoPath;
        if (imagekit) {
            signedUrl = imagekit.url({
                src: lesson.videoPath,
                signed: true,
                expireSeconds: 3600 // 1 hour expiry
            });
        }

        res.status(200).json({
            message: 'Video stream URL generated',
            streamUrl: signedUrl,
            lesson: {
                id: lesson._id,
                title: lesson.title,
                duration: lesson.duration,
                freePreview: lesson.freePreview
            }
        });

    } catch (error) {
        console.error('Stream lesson error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get ImageKit authentication parameters for frontend
const getImageKitAuth = async (req, res) => {
    try {
        if (!imagekit) {
            return res.status(503).json({ message: 'ImageKit service not configured' });
        }
        const authenticationParameters = imagekit.getAuthenticationParameters();
        res.status(200).json(authenticationParameters);
    } catch (error) {
        console.error('ImageKit auth error:', error);
        res.status(500).json({ message: error.message });
    }
};

export { 
    uploadVideoAndCreateLesson, 
    getLessonsByCourse, 
    streamLesson, 
    getImageKitAuth 
};