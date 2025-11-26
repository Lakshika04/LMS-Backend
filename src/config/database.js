import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

const connectDb = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL;
        if (!mongoUrl) {
            throw new Error('MONGODB_URL environment variable is not defined');
        }
        await mongoose.connect(mongoUrl);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}

export default connectDb