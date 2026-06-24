import fs from "fs";
import path from "path";
import { RetrievalService } from "./RetrievalService";
import { generateResponse } from "../../services/openrouterService";

export class TimelineService {
    private retrievalService: RetrievalService;

    constructor() {
        this.retrievalService = new RetrievalService();
    }

    private getTimelinePath(characterName: string): string {
        // Map character name back to folder name
        const chars: Record<string, string> = {
            'Albert Einstein': 'einstein',
            'APJ Abdul Kalam': 'kalam',
            'Dr. B. R. Ambedkar': 'ambedkar',
            'Shivaji Maharaj': 'shivaji',
            'Swami Vivekananda': 'vivekananda',
            'Nikola Tesla': 'tesla',
            'Isaac Newton': 'newton',
            'Srinivasa Ramanujan': 'ramanujan',
            'Marie Curie': 'curie',
            'Stephen Hawking': 'hawking',
            'Mahatma Gandhi': 'gandhi'
        };
        const folder = chars[characterName] || characterName.toLowerCase().replace(/\s+/g, "");
        return path.join(__dirname, "../../../data", folder, "timeline.json");
    }

    public async getTimeline(character: string, forceRefresh: boolean = false): Promise<any[]> {
        const filePath = this.getTimelinePath(character);

        // 1. Check cache
        if (!forceRefresh && fs.existsSync(filePath)) {
            try {
                const data = await fs.promises.readFile(filePath, "utf-8");
                return JSON.parse(data);
            } catch (err) {
                console.error("Failed to read timeline cache:", err);
            }
        }

        // 2. Generate new timeline
        console.log(`Generating new timeline for ${character}...`);
        
        // RAG query for timeline events
        const query = "chronological major life events milestones birth career death dates";
        const contextData = await this.retrievalService.retrieveContext(character, query, 10);

        const prompt = `You are an expert historian. Extract a chronological timeline of major life events from the following historical context about ${character}.
        
Return ONLY a valid JSON array of objects. Do not wrap it in markdown code blocks like \`\`\`json.
Each object MUST have these exact keys: "year", "title", "description".
If the context lacks information, return a minimal timeline based on your general knowledge, but prioritize the context.

Historical Context:
${contextData.text}`;

        try {
            const reply = await generateResponse([{ role: "user", content: prompt }]);
            
            // Clean up potential markdown formatting
            let cleanJson = reply.trim();
            if (cleanJson.startsWith("```json")) {
                cleanJson = cleanJson.replace(/^```json\n?/, "").replace(/\n?```$/, "");
            } else if (cleanJson.startsWith("```")) {
                cleanJson = cleanJson.replace(/^```\n?/, "").replace(/\n?```$/, "");
            }

            const timelineData = JSON.parse(cleanJson);

            // Persist to cache
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                await fs.promises.mkdir(dir, { recursive: true });
            }
            await fs.promises.writeFile(filePath, JSON.stringify(timelineData, null, 2));

            return timelineData;

        } catch (error) {
            console.error("Timeline Generation Error:", error);
            return [
                {
                    year: "Error",
                    title: "Timeline Unavailable",
                    description: "Failed to generate the timeline from the historical database."
                }
            ];
        }
    }
}
