export class TextSplitter {
    /**
     * Splits text into chunks of roughly `chunkSize` characters, with `chunkOverlap`.
     * It attempts to split at natural boundaries like paragraphs or sentences.
     */
    static split(text: string, chunkSize: number = 1000, chunkOverlap: number = 200): string[] {
        // Clean up whitespace
        text = text.replace(/\s+/g, " ").trim();
        
        const chunks: string[] = [];
        
        // Simple sentence-based splitting for better context boundaries
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        
        let currentChunk = "";
        
        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            if (!trimmedSentence) continue;

            if (currentChunk.length + trimmedSentence.length > chunkSize && currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                
                // Calculate overlap
                // Take the last part of the current chunk up to the overlap limit
                const overlapText = currentChunk.slice(Math.max(0, currentChunk.length - chunkOverlap));
                // Find the first full word in the overlap to avoid cutting words
                const overlapStart = overlapText.indexOf(" ");
                currentChunk = (overlapStart !== -1 ? overlapText.slice(overlapStart) : overlapText).trim() + " " + trimmedSentence;
            } else {
                currentChunk += (currentChunk ? " " : "") + trimmedSentence;
            }
        }
        
        if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
        }
        
        return chunks;
    }
}
