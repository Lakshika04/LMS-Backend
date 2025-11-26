import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import dotenv from 'dotenv'
dotenv.config()

const verifyToken= async(req,res,next)=>{
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({message: "Access token required"})
        }
        const tokenParts = authHeader.split(' ');
        if (tokenParts.length !== 2) {
            return res.status(401).json({message: "Invalid token format"});
        }
        const token = tokenParts[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = await User.findById(decode.id).select("-password")
        if (!req.user) {
            return res.status(401).json({message: "User not found"})
        }
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({message: "Invalid token"})
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({message: "Token expired"})
        }
        res.status(500).json({message: "Authentication error"})
    }
}

const authenticateToken = verifyToken;

export { verifyToken, authenticateToken };
export default verifyToken;