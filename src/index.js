import express from 'express'
import cors from 'cors';
import connectDb from './config/database.js';

// Import all routes
import userRouter from './routes/user.route.js';
import courseRouter from './routes/course.route.js';
import enrollmentRouter from './routes/enrollment.route.js';
import lessonRouter from './routes/lesson.route.js';
import reviewRouter from './routes/review.route.js';
import progressRouter from './routes/progress.route.js';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

//db connection

connectDb();

app.get("/",(req,res)=>{
    res.send('server is running')
})

// Route middlewares
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/api/lessons", lessonRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/progress", progressRouter);

app.listen(5000,()=>{
    console.log("server is running on port 5000")
})

