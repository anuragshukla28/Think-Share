import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askGemini = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    throw new ApiError(400, "Prompt is required");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // ✅ updated model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json(new ApiResponse(200, text));
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new ApiError(500, "Failed to fetch response from Gemini");
  }
});
