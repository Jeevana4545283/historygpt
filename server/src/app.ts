import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import { getTimeline, refreshTimeline } from "./controllers/timelineController";
import { uploadMiddleware, handleUpload, getMedia } from "./controllers/uploadController";
import { generateResponse } from "./services/openrouterService";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("InspireBooks Backend Running...");
});

app.get("/api/test-llm", async (req, res) => {
    try {
        const response = await generateResponse([{ role: "user", content: "Hello" }]);
        res.json({ success: true, response });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// InspireBooks API Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Legacy/RAG Compatibility Routes
app.use("/api/chat", chatRoutes);
app.get("/api/timeline/:character", getTimeline);
app.post("/api/timeline/:character/refresh", refreshTimeline);
app.post("/api/upload", uploadMiddleware, handleUpload);
app.get("/api/media/:character", getMedia);

app.use("/media", express.static(path.join(__dirname, "../../data")));

export default app;