import { useEffect, useRef, useState } from "react";
import { 
    Send, Mic, MicOff, Volume2, VolumeX, History, BookOpen,
    Plus, FileText, Film, Music, File, UploadCloud, CheckCircle2, AlertCircle, X, Loader2, Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "./ChatMessage";
import { TypingLoader } from "./TypingLoader";
import { TimelinePanel } from "./TimelinePanel";
import { cn } from "../lib/utils";
import API from "../services/api";

interface Message {
    role: "user" | "assistant";
    text: string;
    sources?: any[];
}

interface Character {
    name: string;
    role: string;
    image: string;
}

interface ChatWindowProps {
    leader: Character;
    messages: Message[];
    isLoading: boolean;
    input: string;
    setInput: (val: string) => void;
    onSend: () => void;
}

export const ChatWindow = ({ leader, messages, isLoading, input, setInput, onSend }: ChatWindowProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isTimelineOpen, setIsTimelineOpen] = useState(false);
    
    const [isListening, setIsListening] = useState(false);
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
    
    const recognitionRef = useRef<any>(null);

    // Inline upload & Drag-and-drop state variables
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Status states
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "embedding" | "success" | "error">("idle");
    const [uploadError, setUploadError] = useState<string | null>(null);
    
    // Toast notification state
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    
    // Drag and drop overlay state
    const [isDragging, setIsDragging] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(input ? input + " " + transcript : transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [input, setInput]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    useEffect(() => {
        if (isVoiceEnabled && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === "assistant") {
                const utterance = new SpeechSynthesisUtterance(lastMessage.text);
                window.speechSynthesis.speak(utterance);
            }
        }
    }, [messages, isVoiceEnabled]);

    useEffect(() => {
        window.speechSynthesis.cancel();
    }, [leader.name]);

    const handleStoryMode = () => {
        setInput("Please tell me the story of your life in an engaging way.");
        setTimeout(() => {
            onSend();
        }, 100);
    };

    // Auto-revoking preview object URLs for images
    useEffect(() => {
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            const url = URL.createObjectURL(selectedFile);
            setImageUrl(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        } else {
            setImageUrl(null);
        }
    }, [selectedFile]);

    // Automatically clear toast message after delay
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => {
                setToastMessage(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    // Shared file selection processor
    const processSelectedFile = (file: File) => {
        setUploadStatus("idle");
        setUploadError(null);
        
        const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
        const size = file.size;
        const allowedExtensions = [".pdf", ".docx", ".txt", ".jpg", ".jpeg", ".png", ".webp", ".mp3", ".wav", ".mp4", ".webm"];
        
        if (!allowedExtensions.includes(ext)) {
            setUploadError("Unsupported file type");
            setSelectedFile(file);
            return;
        }
        
        if (ext === ".pdf" && size > 25 * 1024 * 1024) {
            setUploadError("PDF exceeds 25MB limit");
        } else if (ext === ".docx" && size > 10 * 1024 * 1024) {
            setUploadError("DOCX exceeds 10MB limit");
        } else if (ext === ".txt" && size > 5 * 1024 * 1024) {
            setUploadError("TXT exceeds 5MB limit");
        } else if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext) && size > 10 * 1024 * 1024) {
            setUploadError("Image exceeds 10MB limit");
        } else if ([".mp3", ".wav"].includes(ext) && size > 25 * 1024 * 1024) {
            setUploadError("Audio exceeds 25MB limit");
        } else if ([".mp4", ".webm"].includes(ext) && size > 100 * 1024 * 1024) {
            setUploadError("Video exceeds 100MB limit");
        }
        
        setSelectedFile(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processSelectedFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleCancelUpload = () => {
        setSelectedFile(null);
        setUploadError(null);
        setUploadStatus("idle");
        setIsUploadingFile(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUploadFile = async () => {
        if (!selectedFile || uploadError) return;
        
        setIsUploadingFile(true);
        setUploadStatus("uploading");
        setUploadError(null);
        
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("character", leader.name);
        
        try {
            const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();
            const isDoc = [".pdf", ".docx", ".txt"].includes(ext);
            
            const res = await API.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            if (res.data.success) {
                if (isDoc) {
                    setUploadStatus("processing");
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    setUploadStatus("embedding");
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
                
                setUploadStatus("success");
                setToastMessage(`✓ ${leader.name} knowledge base updated successfully`);
                
                setTimeout(() => {
                    setSelectedFile(null);
                    setUploadStatus("idle");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                }, 2000);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Upload failed.";
            setUploadStatus("error");
            setUploadError(msg);
        } finally {
            setIsUploadingFile(false);
        }
    };

    const getFileIcon = (file: File) => {
        const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
        if ([".pdf", ".docx", ".txt"].includes(ext)) {
            return <FileText className="w-6 h-6 text-sky-400" />;
        }
        if ([".mp4", ".webm"].includes(ext)) {
            return <Film className="w-6 h-6 text-amber-400" />;
        }
        if ([".mp3", ".wav"].includes(ext)) {
            return <Music className="w-6 h-6 text-violet-400" />;
        }
        return <File className="w-6 h-6 text-slate-400" />;
    };

    const getFileCategory = (file: File) => {
        const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
        if ([".pdf", ".docx", ".txt"].includes(ext)) return "Document";
        if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) return "Image";
        if ([".mp4", ".webm"].includes(ext)) return "Video";
        if ([".mp3", ".wav"].includes(ext)) return "Audio";
        return "File";
    };

    const getUploadStatusText = () => {
        switch (uploadStatus) {
            case "uploading": return "Uploading...";
            case "processing": return "Processing...";
            case "embedding": return "Generating Embeddings...";
            case "success": return "Knowledge Base Updated ✓";
            default: return "";
        }
    };

    const menuOptions = [
        { label: "Upload Document", accept: ".pdf,.docx,.txt", icon: <FileText className="w-4 h-4 text-sky-400" /> },
        { label: "Upload Image", accept: ".jpg,.jpeg,.png,.webp", icon: <ImageIcon className="w-4 h-4 text-emerald-400" /> },
        { label: "Upload Video", accept: ".mp4,.webm", icon: <Film className="w-4 h-4 text-amber-400" /> },
        { label: "Upload Audio", accept: ".mp3,.wav", icon: <Music className="w-4 h-4 text-violet-400" /> }
    ];

    const handleMenuOptionClick = (accept: string) => {
        setIsMenuOpen(false);
        if (fileInputRef.current) {
            fileInputRef.current.accept = accept;
            fileInputRef.current.click();
        }
    };

    return (
        <div 
            className="flex flex-col h-[100dvh] w-full bg-transparent relative overflow-hidden"
            onDragEnter={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
        >
            {/* Drag and Drop Glowing Overlay */}
            <AnimatePresence>
                {isDragging && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md border-2 border-dashed border-sky-500/50 m-4 rounded-2xl"
                        onDragOver={(e) => e.preventDefault()}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                        }}
                        onDrop={handleDrop}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 10 }}
                            className="flex flex-col items-center gap-4 text-center p-8 pointer-events-none"
                        >
                            <div className="w-16 h-16 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.2)]">
                                <UploadCloud className="w-8 h-8 animate-bounce" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-100 mb-1">Drop files here</h3>
                                <p className="text-slate-400 text-sm max-w-xs">
                                    Add documents or media directly to {leader.name}'s knowledge base
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Knowledge Update Toast */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] text-emerald-400 text-sm font-semibold tracking-wide"
                    >
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="h-16 shrink-0 flex items-center justify-between px-4 md:px-6 border-b border-slate-700/30 bg-slate-950/20 backdrop-blur-md z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="hidden md:block w-9 h-9 rounded-full overflow-hidden border border-slate-600/50 shadow-sm">
                        <img src={leader.image} alt={leader.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="hidden md:block">
                        <h2 className="font-bold text-slate-100 leading-tight">{leader.name}</h2>
                        <p className="text-[11px] text-sky-400/90 font-medium tracking-wide uppercase">{leader.role}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleStoryMode}
                        className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:shadow-[0_0_12px_rgba(14,165,233,0.3)] text-sm font-medium transition-all duration-300 border border-sky-500/20"
                    >
                        <BookOpen className="w-4 h-4" />
                        <span className="hidden sm:inline">Story Mode</span>
                    </button>
                    
                    <button 
                        onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                        className={cn(
                            "relative p-2 rounded-lg transition-all duration-300 group",
                            isVoiceEnabled 
                                ? "text-sky-400 bg-sky-500/10 shadow-[0_0_12px_rgba(14,165,233,0.3)] border border-sky-500/20" 
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                        )}
                        title={isVoiceEnabled ? "Voice Output On" : "Voice Output Off"}
                    >
                        {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>

                    <button 
                        onClick={() => setIsTimelineOpen(!isTimelineOpen)}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] border border-transparent hover:border-slate-700/50"
                        title="View Timeline"
                    >
                        <History className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth scrollbar-hide relative">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center mt-24 text-slate-500">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full" />
                                <img
                                    src={leader.image}
                                    alt={leader.name}
                                    className="relative w-28 h-28 rounded-full object-cover object-top mb-6 border-4 border-slate-700/50 shadow-2xl"
                                />
                            </motion.div>
                            <motion.h2 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                className="text-3xl font-bold text-slate-200 mb-2 drop-shadow-md"
                            >
                                {leader.name}
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                                className="text-sky-400 font-medium tracking-wide uppercase text-sm mb-4 drop-shadow-md"
                            >
                                {leader.role}
                            </motion.p>
                            <motion.p 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                                className="max-w-md text-slate-300 leading-relaxed drop-shadow-md"
                            >
                                "I am {leader.name}. Ask me anything about my life, my vision, and my legacy."
                            </motion.p>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {messages.map((msg, i) => (
                                <ChatMessage
                                    key={i}
                                    role={msg.role}
                                    text={msg.text}
                                    sources={msg.sources}
                                    leaderImage={leader.image}
                                    leaderName={leader.name}
                                />
                            ))}
                        </AnimatePresence>
                    )}
                    
                    {isLoading && (
                        <div className="flex">
                            <div className="w-8 h-8 shrink-0 mr-4" />
                            <TypingLoader />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="shrink-0 p-4 bg-gradient-to-t from-slate-950/80 to-transparent">
                <div className="max-w-3xl mx-auto space-y-3 relative">
                    {/* Hidden Dynamic Input */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                    />

                    {/* Preview Card */}
                    <AnimatePresence>
                        {selectedFile && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="relative flex items-center justify-between p-3 bg-slate-900/80 border border-slate-700/50 backdrop-blur-md rounded-2xl shadow-xl gap-4"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {selectedFile.type.startsWith("image/") && imageUrl ? (
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700/50 bg-slate-955 shrink-0">
                                            <img 
                                                src={imageUrl} 
                                                alt="preview" 
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg border border-slate-700/50 bg-slate-950 flex items-center justify-center text-slate-400 shrink-0">
                                            {getFileIcon(selectedFile)}
                                        </div>
                                    )}
                                    
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-slate-200 truncate">{selectedFile.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                            <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                                            <span>•</span>
                                            <span className="capitalize">{getFileCategory(selectedFile)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 shrink-0">
                                    {uploadError && (
                                        <div className="text-xs text-red-400 flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-xl">
                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                            <span>{uploadError}</span>
                                        </div>
                                    )}
                                    
                                    {uploadStatus !== "idle" && uploadStatus !== "error" && (
                                        <div className={cn(
                                            "text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-xl border font-medium",
                                            uploadStatus === "success" 
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                                : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                                        )}>
                                            {uploadStatus !== "success" ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="w-3 h-3" />
                                            )}
                                            <span>{getUploadStatusText()}</span>
                                        </div>
                                    )}
                                    
                                    {uploadStatus === "idle" && !uploadError && (
                                        <button
                                            onClick={handleUploadFile}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-lg hover:shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all duration-200"
                                        >
                                            <UploadCloud className="w-3.5 h-3.5" />
                                            <span>Upload</span>
                                        </button>
                                    )}
                                    
                                    {uploadStatus !== "success" && (
                                        <button
                                            onClick={handleCancelUpload}
                                            disabled={isUploadingFile}
                                            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
                                            title="Remove attachment"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Chat Input Row */}
                    <div className="flex items-end gap-2">
                        {/* "+" Button & Floating Menu */}
                        <div className="relative mb-1">
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-3.5 rounded-full bg-slate-900/60 backdrop-blur-2xl border border-slate-700/60 text-slate-400 hover:text-sky-400 hover:border-sky-500/50 hover:bg-sky-500/10 hover:shadow-[0_0_15px_rgba(14,165,233,0.25)] transition-all duration-300 flex items-center justify-center shrink-0"
                                title="Attach knowledge file"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                            
                            {/* Floating Menu */}
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <>
                                        {/* Click-away backdrop */}
                                        <div 
                                            className="fixed inset-0 z-10" 
                                            onClick={() => setIsMenuOpen(false)} 
                                        />
                                        
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute bottom-16 left-0 z-20 w-56 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden p-2 space-y-1"
                                        >
                                            {menuOptions.map(option => (
                                                <button
                                                    key={option.label}
                                                    type="button"
                                                    onClick={() => handleMenuOptionClick(option.accept)}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sky-500/10 text-slate-300 hover:text-sky-400 transition-colors text-sm font-medium text-left"
                                                >
                                                    {option.icon}
                                                    <span>{option.label}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Input Area Box */}
                        <div className="relative flex-1 group">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        onSend();
                                    }
                                }}
                                placeholder={`Message ${leader.name}...`}
                                className={cn(
                                    "w-full bg-slate-900/60 backdrop-blur-2xl border border-slate-700/60 rounded-3xl",
                                    "pl-5 pr-14 py-4 text-[15px] text-slate-100 placeholder-slate-400",
                                    "focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/50 focus:shadow-[0_0_20px_rgba(14,165,233,0.15)]",
                                    "resize-none overflow-hidden min-h-[56px] max-h-[150px] shadow-lg transition-all duration-300"
                                )}
                                rows={1}
                                style={{ fieldSizing: "content" } as any} 
                            />
                            <button
                                onClick={toggleListening}
                                type="button"
                                className={cn(
                                    "absolute right-3 bottom-3 p-2 rounded-full transition-all duration-300",
                                    isListening 
                                        ? "bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse" 
                                        : "text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 hover:shadow-[0_0_10px_rgba(14,165,233,0.2)]"
                                )}
                            >
                                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                        </div>
                        
                        <button
                            onClick={onSend}
                            disabled={isLoading || !input.trim()}
                            className={cn(
                                "shrink-0 mb-1 p-3.5 rounded-full transition-all duration-300",
                                input.trim() 
                                    ? "bg-sky-500 text-white hover:bg-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:scale-105" 
                                    : "bg-slate-800/80 border border-slate-700/50 text-slate-500 backdrop-blur-md",
                                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            )}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                
                <div className="text-center text-xs text-slate-400 mt-3 hidden md:block drop-shadow-md">
                    HistoryGPT can make mistakes. Consider verifying important information.
                </div>
            </div>

            {/* Timeline Overlay Panel */}
            <TimelinePanel 
                leaderName={leader.name} 
                isOpen={isTimelineOpen} 
                onClose={() => setIsTimelineOpen(false)} 
            />
        </div>
    );
}
