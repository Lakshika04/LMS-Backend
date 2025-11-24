import mongoose from "mongoose";

const enrollmentSchema= new mongoose.Schema({
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true,
    },
    paidAmount:{
        type:Number,
        required:true,
    },
    paymentStatus:{
        type:String,
        enum:['pending','completed','failed'],
        required:true,
    },
},{timestamps:true})

const Enrollment= mongoose.model("Enrollment",enrollmentSchema);
export default Enrollment;