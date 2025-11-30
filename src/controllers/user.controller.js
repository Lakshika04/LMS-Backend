import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

const signup=async(req,res)=>{
    try {
        const{name,email,password,role}=req.body;
        console.log("data received",name,email,password,role);
        const userExist= await User.findOne({email});
        if(userExist){
            return res.status(200).json({message:"this user already exist"})
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt)

        const newUser= new User({name,email,password:hashedPassword,role})
        await newUser.save();
        res.status(201).json({message:" new user created successfully"})
        } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
}

const login=async(req,res)=>{
    try {
        const{email,password}=req.body;
        const user= await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"this user is not found"})
        }

        const isPasswordValid=await bcrypt.compare(password,user.password)

        if(!isPasswordValid){
            return res.status(401).json({message:"this password is invalid"})
        }
        const token=jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET_KEY,{expiresIn:"1hr"})
        res.status(201).json({message:"login successfully",user,token})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
}

const getProfile=async(req,res)=>{
    try {
        const profile= req.user
        res.status(200).json({message:"profile fetched successfully",profile})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
}

const updateProfile=async(req,res)=>{
    try {
        const{name,password}=req.body
        const userId= req.user._id
        const updateData={}
        if(name){
            updateData.name=name
        }
        if(password){
            const salt= await bcrypt.genSalt(15);
            const hashedPassword=await bcrypt.hash(password,salt)
            updateData.password=hashedPassword
        }
        const updatedProfile = await User.findByIdAndUpdate(userId,updateData,{new:true}).select("-password")
        res.status(200).json({message:"profile updated successfully",updatedProfile})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
}

const userBlocked = async(req,res)=>{
    try {
        const {userId}=req.params
        const user=await User.findById(userId)
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const userBlocked= await User.findByIdAndUpdate(userId,{isBlocked:true},{new:true})
        res.status(200).json({message:"user blocked successfully",userBlocked})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
}

export {signup,login,getProfile,updateProfile,userBlocked}