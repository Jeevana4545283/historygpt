import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, FileText, Video, Mic, ExternalLink } from "lucide-react";
import { characters } from "../data/characters";
import API from "../services/api";
import { cn } from "../lib/utils";
import { TypingLoader } from "./TypingLoader";

interface GalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedLeader?: string;
}

const TABS = [
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "videos", label: "Videos", icon: Video },
    { id: "audio", label: "Audio", icon: Mic },
];

export const GalleryModal = ({ isOpen, onClose, preselectedLeader }: GalleryModalProps) => {
    const [selectedLeader, setSelectedLeader] = useState(preselectedLeader || characters[0].name);
    const [activeTab, setActiveTab] = useState("images");
    const [media, setMedia] = useState<any>({ documents: [], images: [], videos: [], audio: [] });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const fetchMedia = async () => {
            setIsLoading(true);
            try {
                const res = await API.get(`/media/${encodeURIComponent(selectedLeader)}`);
                if (res.data.success) {
                    setMedia(res.data.media);
                }
            } catch (err) {
                console.error("Failed to fetch media:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMedia();
    }, [isOpen, selectedLeader]);

    const activeItems = media[activeTab] || [];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
                        onClick={onClose}
                    />
                    
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-5xl h-[85vh] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md shrink-0">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-lg">
                                    <ImageIcon className="w-5 h-5 text-sky-400" />
                                    Media Gallery
                                </h3>
                                <select 
                                    value={selectedLeader}
                                    onChange={(e) => setSelectedLeader(e.target.value)}
                                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-sm outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                                >
                                    {characters.map(c => (
                                        <option key={c.name} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-800 px-2 shrink-0 overflow-x-auto scrollbar-hide bg-slate-900/50">
                            {TABS.map(tab => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                const count = media[tab.id]?.length || 0;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
                                            isActive ? "border-sky-500 text-sky-400 bg-sky-500/5" : "border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                        <span className={cn("px-1.5 py-0.5 rounded-full text-[10px]", isActive ? "bg-sky-500/20" : "bg-slate-800")}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/30 relative">
                            {isLoading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-sky-400">
                                    <TypingLoader />
                                    <span className="mt-4 text-sm font-medium">Loading historical records...</span>
                                </div>
                            ) : activeItems.length === 0 ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                                    <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-700/50">
                                        <ImageIcon className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p>No {activeTab} available for {selectedLeader}.</p>
                                    <p className="text-sm mt-1 opacity-70">Use the Upload Knowledge feature to add some.</p>
                                </div>
                            ) : (
                                <div className={cn(
                                    "grid gap-4",
                                    activeTab === "images" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                )}>
                                    {activeItems.map((url: string, i: number) => {
                                        const filename = url.split('/').pop() || "";
                                        const fullUrl = `http://127.0.0.1:5000${url}`;
                                        
                                        return (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                                key={i}
                                                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg group hover:border-sky-500/30 transition-all"
                                            >
                                                {activeTab === "images" && (
                                                    <div className="aspect-square bg-slate-950 relative">
                                                        <img src={fullUrl} alt={filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        <a href={fullUrl} target="_blank" rel="noreferrer" className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm hover:bg-sky-500/80">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    </div>
                                                )}
                                                
                                                {activeTab === "videos" && (
                                                    <div className="aspect-video bg-black relative">
                                                        <video src={fullUrl} controls className="w-full h-full object-contain" />
                                                    </div>
                                                )}
                                                
                                                {activeTab === "audio" && (
                                                    <div className="p-4 bg-slate-900 flex flex-col items-center justify-center h-32">
                                                        <Mic className="w-8 h-8 text-slate-600 mb-4" />
                                                        <audio src={fullUrl} controls className="w-full h-8" />
                                                    </div>
                                                )}

                                                {activeTab === "documents" && (
                                                    <div className="p-6 bg-slate-900 flex flex-col items-center justify-center h-40 border-b border-slate-800 group-hover:bg-slate-800/50 transition-colors">
                                                        <FileText className="w-12 h-12 text-sky-500/50 mb-3" />
                                                        <a href={fullUrl} target="_blank" rel="noreferrer" className="mt-2 text-sm text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1">
                                                            View Document <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </div>
                                                )}

                                                <div className="p-3 bg-slate-900 border-t border-slate-800">
                                                    <p className="text-xs font-medium text-slate-300 truncate" title={filename}>{filename}</p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
