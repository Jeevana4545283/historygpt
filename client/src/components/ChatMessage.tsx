import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { User, Book, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ChatMessageProps {
    role: "user" | "assistant";
    text: string;
    sources?: any[];
    leaderImage?: string;
    leaderName?: string;
}

export const ChatMessage = ({ role, text, sources, leaderImage, leaderName }: ChatMessageProps) => {
    const isUser = role === "user";
    const [expandedSourceIndex, setExpandedSourceIndex] = useState<number | null>(null);

    const toggleSource = (index: number) => {
        setExpandedSourceIndex(expandedSourceIndex === index ? null : index);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className={cn(
                "flex w-full gap-4 p-4",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            <div className={cn(
                "shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border mt-1 shadow-md",
                isUser ? "bg-slate-700 border-slate-600" : "bg-slate-800 border-sky-500/50 shadow-[0_0_12px_rgba(14,165,233,0.3)]"
            )}>
                {isUser ? (
                    <User className="w-5 h-5 text-slate-300" />
                ) : (
                    <img src={leaderImage} alt={leaderName} className="w-full h-full object-cover object-top aspect-square" />
                )}
            </div>

            <div className={cn(
                "max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3 text-[15px] leading-relaxed shadow-lg",
                isUser
                    ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-tr-sm"
                    : "bg-slate-800/90 border border-slate-700/50 text-slate-200 rounded-tl-sm backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
            )}>
                <div className="whitespace-pre-wrap break-words">{text}</div>

                {/* Sources UI */}
                {!isUser && sources && sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-700/50">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                            <Book className="w-3.5 h-3.5" />
                            <span>Sources</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {sources.map((source, idx) => (
                                <div key={idx} className="bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden">
                                    <button 
                                        onClick={() => toggleSource(idx)}
                                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <span className="font-medium truncate text-sky-400">{source.source}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                                            <span>View Source</span>
                                            {expandedSourceIndex === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </div>
                                    </button>
                                    
                                    <AnimatePresence>
                                        {expandedSourceIndex === idx && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-3 pb-3 pt-1 border-t border-slate-800/50"
                                            >
                                                <div className="text-[13px] text-slate-400 font-mono bg-slate-950/50 p-2.5 rounded border border-slate-800/50 whitespace-pre-wrap break-words">
                                                    {source.document}
                                                </div>
                                                <div className="mt-1.5 text-[10px] text-slate-500 text-right uppercase tracking-wider">
                                                    Chunk ID: {source.chunkId}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
