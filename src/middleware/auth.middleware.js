import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import dotenv from 'dotenv'
dotenv.config()

const verifyToken= async(req,res,next)=>{
    try {
        const token=req.headers.authorization
        const decode= jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user=await User.findById(decode.id).select("-password")
        next();
    } catch (error) {
        console.log(error.message)
        res.status(400).json({message:"invalid token"})
        
    }
}

export default verifyToken