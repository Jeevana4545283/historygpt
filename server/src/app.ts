import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes";
import { getTimeline, refreshTimeline } from "./controllers/timelineController";
import { uploadMiddleware, handleUpload, getMedia } from "./controllers/uploadController";
import { generateResponse } from "./services/openrouterService";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("HistoryGPT Backend Running...");
});

app.get("/api/test-llm", async (req, res) => {
    try {
        const response = await generateResponse([{ role: "user", content: "Hello" }]);
        res.json({ success: true, response });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.use("/api/chat", chatRoutes);
app.get("/api/timeline/:character", getTimeline);
app.post("/api/timeline/:character/refresh", refreshTimeline);

app.post("/api/upload", uploadMiddleware, handleUpload);
app.get("/api/media/:character", getMedia);

app.use("/media", express.static(path.join(__dirname, "../../data")));

export default app;