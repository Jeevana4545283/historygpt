import { EmbeddingService } from "../embeddings/EmbeddingService";
import { VectorStore } from "../vectorstore/VectorStore";

export class RetrievalService {
    private embeddingService: EmbeddingService;
    private vectorStore: VectorStore;

    constructor() {
        this.embeddingService = new EmbeddingService();
        this.vectorStore = new VectorStore();
    }

    /**
     * Retrieves the top relevant distinct context chunks for a given character and query.
     */
    async retrieveContext(character: string, query: string, topK: number = 3): Promise<{ text: string, sources: any[] }> {
        try {
            // 1. Generate query embedding
            const queryEmbedding = await this.embeddingService.generateEmbedding(query);

            // 2. Search vector store (retrieve slightly more to allow distinct filtering)
            const results = this.vectorStore.search(queryEmbedding, { character }, topK + 2);

            // 3. Filter out duplicate or near-duplicate text chunks
            const uniqueResults: typeof results = [];
            const seenTexts = new Set<string>();
            for (const r of results) {
                const normText = r.text.trim().toLowerCase();
                if (!seenTexts.has(normText)) {
                    seenTexts.add(normText);
                    uniqueResults.push(r);
                }
                if (uniqueResults.length >= topK) break;
            }

            // 4. Combine retrieved text
            if (uniqueResults.length === 0) {
                return { text: "", sources: [] };
            }

            const contextText = uniqueResults.map((r, i) => `[Source ${i + 1}: ${r.metadata.source}]\n${r.text}`).join("\n\n");
            
            const sources = uniqueResults.map(r => ({
                source: r.metadata.source,
                chunkId: r.id,
                document: r.text
            }));

            return { text: contextText, sources };

        } catch (error) {
            console.error("Retrieval Error:", error);
            return { text: "", sources: [] }; // Fail gracefully and fall back to pure LLM
        }
    }
}
