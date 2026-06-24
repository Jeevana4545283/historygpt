import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenerativeAI(apiKey);

export const generateResponse = async (prompt: string) => {
    try {
        const model = ai.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const result = await model.generateContent(prompt);

        return result.response.text();
    } catch (error) {
        console.error("Gemini Service Error:", error);
        throw error;
    }
};