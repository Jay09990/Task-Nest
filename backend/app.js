import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// import cors from "cors";

app.use(cors({
    origin: "http://localhost:5173", // 🔥 Your frontend's origin
    credentials: true               // 🔥 Allow cookies to be sent
}));

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())

app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    next();
});

// importing routes

import userRouter from "./routes/user.routes.js"
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js"

//routes declaration

app.use("/api/users", userRouter)
app.use("/api/projects", projectRoutes);
app.use("/api/task", taskRoutes)

export { app }