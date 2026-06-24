import fs from "fs";
import path from "path";
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

export class DocumentLoader {
    /**
     * Loads a file (.txt or .pdf) and extracts its text.
     */
    static async loadFile(filePath: string): Promise<string> {
        const ext = path.extname(filePath).toLowerCase();
        
        if (ext === ".txt" || ext === ".md") {
            return fs.promises.readFile(filePath, "utf-8");
        } 
        
        if (ext === ".pdf") {
            const dataBuffer = await fs.promises.readFile(filePath);
            const data = await pdfParse(dataBuffer);
            return data.text;
        }

        if (ext === ".docx") {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        }

        throw new Error(`Unsupported file type: ${ext}`);
    }

    /**
     * Loads all supported documents from a directory.
     */
    static async loadDirectory(dirPath: string): Promise<{ source: string, text: string }[]> {
        const documents: { source: string, text: string }[] = [];
        const files = await fs.promises.readdir(dirPath);

        for (const file of files) {
            const fullPath = path.join(dirPath, file);
            const stat = await fs.promises.stat(fullPath);

            if (stat.isFile() && (file.endsWith(".txt") || file.endsWith(".pdf") || file.endsWith(".md") || file.endsWith(".docx"))) {
                try {
                    const text = await this.loadFile(fullPath);
                    documents.push({ source: file, text });
                } catch (error) {
                    console.error(`Failed to load ${file}:`, error);
                }
            }
        }

        return documents;
    }
}
