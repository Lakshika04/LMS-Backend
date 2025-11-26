import Enrollment from "../models/enrollment.js"
import Progress from "../models/progress.js"
import { validateObjectId, validateRequiredFields } from "../utils/validation.js"

const markProgress = async (req, res) => {
    try {
        const { courseId, lessonId } = req.body;
        
        validateRequiredFields(['courseId', 'lessonId'], req.body);
        
        if (!validateObjectId(courseId) || !validateObjectId(lessonId)) {
            return res.status(400).json({ message: "Invalid course or lesson ID" });
        }
        
        const enrolled = await Enrollment.findOne({ 
            course: courseId, 
            student: req.user._id 
        });
        
        if (!enrolled) {
            return res.status(403).json({ message: "You are not enrolled in this course" });
        }
        
        let progress = await Progress.findOne({ 
            course: courseId, 
            student: req.user._id 
        });
        
        if (!progress) {
            progress = await Progress.create({
                student: req.user._id,
                course: courseId,
                completedLessons: [lessonId],
                lastLesson: lessonId
            });
        } else {
            if (!progress.completedLessons.includes(lessonId)) {
                progress.completedLessons.push(lessonId);
            }
            progress.lastLesson = lessonId;
            await progress.save();
        }
        
        res.status(201).json({ message: "Progress saved successfully", progress });
    } catch (error) {
        console.error('Progress error:', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export{markProgress}