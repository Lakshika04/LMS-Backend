import mongoose from "mongoose";

const lessonSchema=new mongoose.Schema({
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true,
    },

    title:{
        type:String,
        required:true,
        trim:true,
    },

    videoPath:{
        type:String,
        required:true,
    },
    order:{
        type:Number,
        required:true,
    },
    freePreview:{
        type:Boolean,
        default:false,
    },
    duration:{
        type:Number,
    },

},{timestamps:true})

const Lesson=mongoose.model("Lesson",lessonSchema);
export default Lesson;