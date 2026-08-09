import app from "./app";
import dotenv from "dotenv";
import { initializePostgresDatabase } from "./db/initDb";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`🚀 InspireBooks Server running on http://127.0.0.1:${PORT}`);
    console.log("Using Model:", process.env.LLM_MODEL || "openrouter/free");
    await initializePostgresDatabase();
});