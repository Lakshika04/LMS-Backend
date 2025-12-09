import mongoose from "mongoose";
const progressSchema= new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true,
    },
    completedLessons:{
        type:[{type:mongoose.Schema.Types.ObjectId,ref:'Lesson'}],
    },
    lastLesson:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Lesson'
    }
    
},{timestamps:true})

const Progress=mongoose.model("Progress",progressSchema);
export default Progress;