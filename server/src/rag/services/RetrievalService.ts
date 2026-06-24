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
     * Retrieves the top 5 relevant context chunks for a given character and query.
     */
    async retrieveContext(character: string, query: string, topK: number = 5): Promise<{ text: string, sources: any[] }> {
        try {
            // 1. Generate query embedding
            const queryEmbedding = await this.embeddingService.generateEmbedding(query);

            // 2. Search vector store with character filter
            const results = this.vectorStore.search(queryEmbedding, { character }, topK);

            // 3. Combine retrieved text
            if (results.length === 0) {
                return { text: "", sources: [] };
            }

            const contextText = results.map((r, i) => `[Source ${i + 1}: ${r.metadata.source}]\n${r.text}`).join("\n\n");
            
            const sources = results.map(r => ({
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
