import express from "express";
import { askAI } from "../controllers/ai_ctrl.js";

const router = express.Router();

router.post("/ask", askAI);

export default router;