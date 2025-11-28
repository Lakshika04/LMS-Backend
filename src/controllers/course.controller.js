import Course from "../models/course.js";
import Enrollment from "../models/enrollment.js";
import Lesson from "../models/lesson.js";
import Progress from "../models/progress.js";
import Review from "../models/review.js";

const addCourse=async(req, res)=>{
    try {
        const{title,subtitle,description,price,category,level}=req.body;
        const course = await Course.create({title,subtitle,description,price,category,level,instructor:req.user._id})
        return res.status(201).json({message:"course is created",course})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
}

const getCourses=async(req,res)=>{
    try {
        const courses= (await Course.find().populate("instructor","name"))
        res.status(200).json({message:"all courses fetched",courses})

    } catch (error) {
         console.log(error.message)
        res.status(500).json({message:error.message})
        
    }
}

const updateCourse= async(req,res)=>{
    try {
        const{courseId} = req.params
        const{title,description,subtitle,price,category,level,published}=req.body
        const course= await Course.findById(courseId)
        if(!course){
            return res.status(404).json({message:"course not found"})
        }
     
        if(course.instructor.toString()!==req.user._id.toString() && req.user.role!=="admin"){
           return res.status(403).json({message:"Unauthorized User"})
        }
        const updateCourse=await Course.findByIdAndUpdate(courseId,{title,description,subtitle,price,category,level,published},{new:true})
         res.status(200).json({message:"updated successfully",updateCourse})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
}

const deleteCourse=async(req,res)=>{
    try {
        const{courseId}=req.params
        const course= await Course.findById(courseId)
        if(!course){
            return res.status(404).json({message:"course not found"})
        }
        if(course.instructor.toString()!==req.user._id.toString() && req.user.role!=="admin"){
            return res.status(403).json({message:"unauthorized User"})
        }
        const deleteCourse=await Course.findByIdAndDelete(courseId)
        await Lesson.deleteMany({course:courseId})
        await Progress.deleteMany({course:courseId})
        await Review.deleteMany({course:courseId})
        await Enrollment.deleteMany({course:courseId})
        res.status(200).json({message:"deleted successfully",deleteCourse})
    } catch (error) {
         console.log(error.message)
        res.status(500).json({message:error.message})
    }
}

export {addCourse,getCourses,updateCourse,deleteCourse}