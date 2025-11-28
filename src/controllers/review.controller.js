import Course from "../models/course.js";
import Enrollment from "../models/enrollment.js";
import Review from "../models/review.js";
import { validateObjectId, validateRequiredFields, sanitizeInput } from "../utils/validation.js";
import mongoose from "mongoose";

const addReview = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { rating, comment } = req.body;
        
        // Validate inputs
        validateRequiredFields(['rating', 'comment'], req.body);
        
        if (!validateObjectId(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }
        
        // Validate rating range
        const numRating = Number(rating);
        if (isNaN(numRating) || numRating < 1 || numRating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }
        
        const sanitizedComment = sanitizeInput(comment);
        
        const enrolled = await Enrollment.findOne({
            student: req.user._id,
            course: courseId,
        });
        
        if (!enrolled) {
            return res.status(403).json({ message: "You must be enrolled to give review" });
        }
        
        const review = await Review.create({
            rating: numRating,
            comment: sanitizedComment,
            student: req.user._id,
            course: courseId,
        });
        
        const stats = await Review.aggregate([
            { $match: { course: new mongoose.Types.ObjectId(courseId) } },
            { $group: { _id: "$course", avgRating: { $avg: "$rating" } } },
        ]);
        
        if (stats.length > 0) {
            await Course.findByIdAndUpdate(courseId, { averageRating: stats[0].avgRating });
        }
        
        res.status(201).json({ message: "Review created successfully", review });
    } catch (error) {
        console.error('Review error:', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteReview=async(req,res)=>{
    try {
        const {reviewId}=req.params
        const review=await Review.findById(reviewId)
        if(!review){
            return res.status(404).json({message:"review not found"})
        }
        if(review.student.toString()!==req.user._id.toString() && req.user.role!=="admin"){
            return res.status(403).json({message:"unauthorized user"})
        }
        const deleteReview=await Review.findByIdAndDelete(reviewId)
        const stats= await Review.aggregate([{$match:{course:review.course}},{$group:{_id:"$course",avgRating:{$avg:"$rating"}}}])
        const newAvg = stats.length>0?
            stats[0].avgRating : 0;
        await Course.findByIdAndUpdate(review.course,{averageRating:newAvg})
        res.status(200).json({message:"review deleted successfully",deleteReview})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
}

export{addReview,deleteReview}
