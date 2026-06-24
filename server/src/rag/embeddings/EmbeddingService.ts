import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

export class EmbeddingService {
    private ai: GoogleGenerativeAI;
    private modelName = "gemini-embedding-2";

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set in environment variables. Required for Embeddings.");
        }
        this.ai = new GoogleGenerativeAI(apiKey);
    }

    /**
     * Generates a vector embedding for a single text chunk.
     */
    async generateEmbedding(text: string): Promise<number[]> {
        const model = this.ai.getGenerativeModel({ model: this.modelName });
        const result = await model.embedContent(text);
        return result.embedding.values;
    }

    /**
     * Generates embeddings for multiple chunks in batch (or sequentially).
     */
    async generateEmbeddings(texts: string[]): Promise<number[][]> {
        // Sequential to avoid rate limits on free tier, though batching is possible
        const embeddings: number[][] = [];
        for (const text of texts) {
            const emb = await this.generateEmbedding(text);
            embeddings.push(emb);
        }
        return embeddings;
    }
}
