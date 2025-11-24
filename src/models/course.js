import mongoose from "mongoose";

const courseSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    subtitle:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    price:{
     type:Number,
     required:true,   
    },
    category:{
        type:String,
        required:true,
        trim:true,
    },
    level:{
        type:String,
        enum:['beginner','intermediate','advance'],
        required:true,
    },
    thumbnailUrl:{
        type:String,
        required:true,
    },
    published:{
        type:Boolean,
        default:false,
    },
    studentCount:{
        type:Number,
        default:0,
    },
    averageRating:{
        type:Number,
        default:0,
    }

},{timestamps:true})


const Course=mongoose.model("Course",courseSchema);
export default Course;