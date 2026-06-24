import fs from "fs";
import path from "path";

export interface VectorDocument {
    id: string;
    text: string;
    embedding: number[];
    metadata: Record<string, any>;
}

export class VectorStore {
    private storageFile: string;
    private vectors: VectorDocument[] = [];

    constructor(storagePath: string = path.join(__dirname, "../../data/vectors.json")) {
        this.storageFile = storagePath;
        this.load();
    }

    /**
     * Calculates cosine similarity between two vectors.
     */
    private cosineSimilarity(vecA: number[], vecB: number[]): number {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        if (normA === 0 || normB === 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * Loads vectors from JSON file.
     */
    private load() {
        if (fs.existsSync(this.storageFile)) {
            try {
                const data = fs.readFileSync(this.storageFile, "utf-8");
                this.vectors = JSON.parse(data);
            } catch (err) {
                console.error("Failed to load vectors:", err);
            }
        } else {
            // Ensure directory exists
            fs.mkdirSync(path.dirname(this.storageFile), { recursive: true });
        }
    }

    /**
     * Saves vectors to JSON file.
     */
    public save() {
        fs.writeFileSync(this.storageFile, JSON.stringify(this.vectors, null, 2), "utf-8");
    }

    /**
     * Adds documents to the store and persists them.
     */
    public addDocuments(docs: VectorDocument[]) {
        this.vectors.push(...docs);
        this.save();
    }

    /**
     * Searches for the most similar chunks.
     */
    public search(queryEmbedding: number[], filterMetadata?: Record<string, any>, limit: number = 5): VectorDocument[] {
        let candidates = this.vectors;

        if (filterMetadata) {
            candidates = candidates.filter(doc => {
                for (const key in filterMetadata) {
                    if (doc.metadata[key] !== filterMetadata[key]) return false;
                }
                return true;
            });
        }

        const scored = candidates.map(doc => ({
            doc,
            score: this.cosineSimilarity(queryEmbedding, doc.embedding)
        }));

        scored.sort((a, b) => b.score - a.score);

        return scored.slice(0, limit).map(s => s.doc);
    }
}
