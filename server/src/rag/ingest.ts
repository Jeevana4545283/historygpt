import path from "path";
import crypto from "crypto";
import { DocumentLoader } from "./loaders/DocumentLoader";
import { TextSplitter } from "./loaders/TextSplitter";
import { EmbeddingService } from "./embeddings/EmbeddingService";
import { VectorStore, VectorDocument } from "./vectorstore/VectorStore";
import { CHARACTER_MAP } from "../utils/characterMap";

export const ingestCharacter = async (characterName: string, dataDir: string) => {
    console.log(`Starting ingestion for ${characterName} from ${dataDir}...`);

    // 1. Load documents
    const rawDocs = await DocumentLoader.loadDirectory(dataDir);
    console.log(`Loaded ${rawDocs.length} documents.`);

    if (rawDocs.length === 0) return;

    // 2. Split into chunks
    const chunks: { text: string; source: string }[] = [];
    for (const doc of rawDocs) {
        const splitText = TextSplitter.split(doc.text, 1000, 200);
        for (const t of splitText) {
            chunks.push({ text: t, source: doc.source });
        }
    }
    console.log(`Split into ${chunks.length} chunks.`);

    // 3. Generate Embeddings
    console.log("Generating embeddings (this may take a moment)...");
    const embeddingService = new EmbeddingService();
    const store = new VectorStore();
    
    const docsToAdd: VectorDocument[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        try {
            const embedding = await embeddingService.generateEmbedding(chunk.text);
            docsToAdd.push({
                id: crypto.randomUUID(),
                text: chunk.text,
                embedding,
                metadata: {
                    source: chunk.source,
                    character: characterName
                }
            });
            console.log(`Embedded chunk ${i + 1}/${chunks.length}`);
        } catch (error) {
            console.error(`Failed to embed chunk ${i + 1}:`, error);
        }
    }

    // 4. Save to Vector Store
    if (docsToAdd.length > 0) {
        await store.addDocuments(docsToAdd);
        console.log(`Successfully ingested ${docsToAdd.length} vectors into the database.`);
    }
};

// Run ingestion for all characters
const run = async () => {
    for (const [name, folder] of Object.entries(CHARACTER_MAP)) {
        const dir = path.join(__dirname, "../../data", folder);
        await ingestCharacter(name, dir);
    }
};

if (require.main === module) {
    run().catch(console.error);
}
