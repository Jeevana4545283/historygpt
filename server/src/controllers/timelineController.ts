import { Request, Response } from "express";
import { TimelineService } from "../rag/services/TimelineService";

const timelineService = new TimelineService();

export const getTimeline = async (req: Request, res: Response) => {
    try {
        const { character } = req.params;
        if (!character || typeof character !== "string") {
            return res.status(400).json({ success: false, message: "Character parameter is required" });
        }

        const events = await timelineService.getTimeline(character, false);
        res.json({ success: true, events });
    } catch (error: any) {
        console.error("Get Timeline Error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const refreshTimeline = async (req: Request, res: Response) => {
    try {
        const { character } = req.params;
        if (!character || typeof character !== "string") {
            return res.status(400).json({ success: false, message: "Character parameter is required" });
        }

        const events = await timelineService.getTimeline(character, true);
        res.json({ success: true, events });
    } catch (error: any) {
        console.error("Refresh Timeline Error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
