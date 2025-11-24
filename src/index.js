import express from 'express'
import connectDb from './config/database.js';
import router from './routes/user.route.js';

const app= express();

app.use(express.json())

//db connection

connectDb();

app.get("/",(req,res)=>{
    res.send('server is running')
})

app.use("/user",router)

app.listen(5000,()=>{
    console.log("server is running on port 5000")
})