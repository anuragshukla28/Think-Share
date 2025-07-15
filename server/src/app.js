import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error_middlewares.js";

// Routes
import authRoutes from "./routes/user_routes.js"
import articleRoutes from "./routes/article_routes.js"
import geminiRoutes from "./routes/geminiRoutes.js";

dotenv.config();

const app =express()

app.use(
    cors({
        origin:process.env.CORS_ORIGIN,
        credentials: true,
    })
)

// common middleware
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/article", articleRoutes);
app.use("/api/v1/gemini", geminiRoutes);


// root route
app.get("/", (req, res) => {
    res.send("🚀 Think-Share API is running!");
  });
  

// ✅ error handler should be the last middleware
app.use(errorHandler);


export {app}

