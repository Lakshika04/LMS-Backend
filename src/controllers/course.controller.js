import Course from "../models/course.js";

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

export {addCourse,getCourses}