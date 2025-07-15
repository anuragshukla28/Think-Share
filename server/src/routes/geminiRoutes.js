// src/routes/geminiRoutes.js
import express from "express";
import { askGemini } from "../controllers/gemini_ctrl.js";

const router = express.Router();

router.post("/ask", askGemini);

export default router;
