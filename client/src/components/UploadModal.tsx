import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { characters } from "../data/characters";
import API from "../services/api";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedLeader?: string;
}

export const UploadModal = ({ isOpen, onClose, preselectedLeader }: UploadModalProps) => {
    const [selectedLeader, setSelectedLeader] = useState(preselectedLeader || characters[0].name);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setStatus({ type: "", message: "" });
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setStatus({ type: "", message: "" });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("character", selectedLeader);

        try {
            const res = await API.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                setStatus({ type: "success", message: "File uploaded! Text documents are now automatically embedding in the background." });
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Upload failed.";
            setStatus({ type: "error", message: msg });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <h3 className="font-bold text-slate-100 flex items-center gap-2">
                                <UploadCloud className="w-5 h-5 text-sky-400" />
                                Upload Knowledge
                            </h3>
                            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Character Select */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Character</label>
                                <select 
                                    value={selectedLeader}
                                    onChange={(e) => setSelectedLeader(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                                >
                                    {characters.map(c => (
                                        <option key={c.name} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* File Upload Area */}
                            <div 
                                className="border-2 border-dashed border-slate-700 hover:border-sky-500/50 rounded-xl p-8 text-center transition-colors cursor-pointer bg-slate-950/50"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    className="hidden" 
                                    accept=".pdf,.txt,.docx,.jpg,.jpeg,.png,.webp,.mp4,.webm,.mp3,.wav"
                                />
                                
                                {file ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-slate-200 font-medium truncate max-w-[200px]">{file.name}</p>
                                            <p className="text-slate-500 text-xs mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center">
                                            <UploadCloud className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-slate-300 font-medium">Click to browse files</p>
                                            <p className="text-slate-500 text-xs mt-1">PDF, DOCX, TXT, JPG, MP4, MP3</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status Messages */}
                            {status.message && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    className={`p-3 rounded-lg text-sm flex items-start gap-2 ${status.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
                                >
                                    {status.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                    <span className="leading-relaxed">{status.message}</span>
                                </motion.div>
                            )}

                            {/* Upload Button */}
                            <button
                                onClick={handleUpload}
                                disabled={!file || isUploading}
                                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-medium p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] flex items-center justify-center gap-2"
                            >
                                {isUploading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Uploading...
                                    </span>
                                ) : "Upload to Knowledge Base"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
