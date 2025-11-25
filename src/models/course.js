import mongoose from "mongoose";

const courseSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    subtitle:{
        type:String,
       
        trim:true,
    },
    description:{
        type:String,
       
        trim:true,
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    price:{
     type:Number,
      
    },
    category:{
        type:String,
      
        trim:true,
    },
    level:{
        type:String,
        enum:['beginner','intermediate','advance'],
       default:'beginner',
    },
    thumbnailUrl:{
        type:String,
       
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