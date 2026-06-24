import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

// Trigger restart gemma4
export const generateResponse = async (messages: { role: string, content: string }[]) => {
    try {
        const model = process.env.LLM_MODEL || "openai/gpt-3.5-turbo";
        console.log("MODEL:", model);
        console.log("MESSAGES:", JSON.stringify(messages, null, 2));

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: model,
                messages: messages,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "HistoryGPT",
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.data || !response.data.choices || response.data.choices.length === 0) {
            throw new Error("Empty response from LLM");
        }

        return response.data.choices[0].message.content;
    } catch (error: any) {
        console.error("FULL OPENROUTER ERROR:");
        console.error(error?.response?.data || error);

        throw error;
    }
};