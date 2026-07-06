import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { ingestCharacter } from "../rag/ingest";
import { getFolderFromCharacter } from "../utils/characterMap";

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const character = req.body.character;
        if (!character) {
            return cb(new Error("Character is required"), "");
        }
        
        const folder = getFolderFromCharacter(character);
        const dir = path.join(__dirname, "../../../data", folder);
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Sanitize filename
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
        cb(null, `${Date.now()}_${safeName}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB Max general limit, we'll validate strictly in route
    }
});

export const uploadMiddleware = upload.single("file");

export const handleUpload = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const ext = path.extname(req.file.originalname).toLowerCase();
        const size = req.file.size;

        // Size validations
        if (ext === ".pdf" && size > 25 * 1024 * 1024) throw new Error("PDF exceeds 25MB limit");
        if (ext === ".docx" && size > 10 * 1024 * 1024) throw new Error("DOCX exceeds 10MB limit");
        if (ext === ".txt" && size > 5 * 1024 * 1024) throw new Error("TXT exceeds 5MB limit");
        if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext) && size > 10 * 1024 * 1024) throw new Error("Image exceeds 10MB limit");
        if ([".mp3", ".wav"].includes(ext) && size > 25 * 1024 * 1024) throw new Error("Audio exceeds 25MB limit");
        if ([".mp4", ".webm"].includes(ext) && size > 100 * 1024 * 1024) throw new Error("Video exceeds 100MB limit");

        // Auto-ingestion for documents
        if ([".pdf", ".txt", ".docx"].includes(ext)) {
            const character = req.body.character;
            const dir = req.file.destination;
            
            // Run ingest synchronously so we know it's done before responding
            await ingestCharacter(character, dir);
        }

        res.json({
            success: true,
            message: "File uploaded successfully",
            file: req.file.filename
        });
    } catch (error: any) {
        console.error("Upload Error:", error);
        
        // Cleanup file if validation failed
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(400).json({ success: false, message: error.message });
    }
};

export const getMedia = async (req: Request, res: Response) => {
    try {
        const { character } = req.params;
        if (!character || typeof character !== "string") return res.status(400).json({ success: false, message: "Character required" });

        const folder = getFolderFromCharacter(character);
        const dir = path.join(__dirname, "../../../data", folder);

        if (!fs.existsSync(dir)) {
            return res.json({ success: true, media: { documents: [], images: [], videos: [], audio: [] } });
        }

        const files = await fs.promises.readdir(dir);
        
        const media = {
            documents: [] as string[],
            images: [] as string[],
            videos: [] as string[],
            audio: [] as string[]
        };

        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            const url = `/media/${folder}/${file}`;
            
            if ([".pdf", ".txt", ".docx", ".md"].includes(ext)) media.documents.push(url);
            else if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) media.images.push(url);
            else if ([".mp4", ".webm"].includes(ext)) media.videos.push(url);
            else if ([".mp3", ".wav"].includes(ext)) media.audio.push(url);
        }

        res.json({ success: true, media });
    } catch (error: any) {
        console.error("Get Media Error:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
