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
     * Loads vectors from JSON file and deduplicates them.
     */
    private load() {
        if (fs.existsSync(this.storageFile)) {
            try {
                const data = fs.readFileSync(this.storageFile, "utf-8");
                const rawVectors: VectorDocument[] = JSON.parse(data);
                
                const seen = new Set<string>();
                this.vectors = [];
                for (const vec of rawVectors) {
                    const key = `${vec.metadata.character || ""}:${vec.text}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        this.vectors.push(vec);
                    }
                }
                
                if (this.vectors.length < rawVectors.length) {
                    console.log(`[DEDUPLICATE] Removed ${rawVectors.length - this.vectors.length} duplicate vectors from database.`);
                    fs.writeFileSync(this.storageFile, JSON.stringify(this.vectors, null, 2), "utf-8");
                }
            } catch (err) {
                console.error("Failed to load vectors:", err);
            }
        } else {
            // Ensure directory exists
            fs.mkdirSync(path.dirname(this.storageFile), { recursive: true });
        }
    }

    /**
     * Saves vectors to JSON file asynchronously.
     */
    public async save(): Promise<void> {
        try {
            await fs.promises.writeFile(this.storageFile, JSON.stringify(this.vectors, null, 2), "utf-8");
        } catch (err) {
            console.error("Failed to save vectors asynchronously:", err);
            throw err;
        }
    }

    /**
     * Adds documents to the store and persists them asynchronously, filtering out duplicates.
     */
    public async addDocuments(docs: VectorDocument[]): Promise<void> {
        const existingKeys = new Set(this.vectors.map(vec => `${vec.metadata.character || ""}:${vec.text}`));
        const newDocs = docs.filter(doc => {
            const key = `${doc.metadata.character || ""}:${doc.text}`;
            if (existingKeys.has(key)) return false;
            existingKeys.add(key);
            return true;
        });

        if (newDocs.length > 0) {
            this.vectors.push(...newDocs);
            await this.save();
            console.log(`[VECTORSTORE] Added ${newDocs.length} new vectors (skipped ${docs.length - newDocs.length} duplicates).`);
        } else {
            console.log("[VECTORSTORE] No new vectors to add (all were duplicates).");
        }
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
