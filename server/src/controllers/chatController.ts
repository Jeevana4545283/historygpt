import { Request, Response } from "express";
import { generateResponse } from "../services/openrouterService";
import { buildSystemPrompt } from "../utils/promptBuilder";
import { RetrievalService } from "../rag/services/RetrievalService";

const retrievalService = new RetrievalService();

export const handleChat = async (req: Request, res: Response) => {
    try {
        console.log("REQ BODY:", req.body);
        const { character, prompt, history = [] } = req.body;

        if (!character || !prompt) {
            return res.status(400).json({ success: false, message: "Character and prompt are required" });
        }

        const contextData = await retrievalService.retrieveContext(character, prompt);

        const systemMessage = {
            role: "system",
            content: buildSystemPrompt(character, contextData.text)
        };

        const userMessage = {
            role: "user",
            content: prompt
        };

        const messages = [systemMessage, ...history, userMessage];

        const reply = await generateResponse(messages);

        res.json({ success: true, reply, sources: contextData.sources });
    } catch (error: any) {
        console.error("Chat Controller Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to connect to the AI network. Please try again later.",
        });
    }
};
