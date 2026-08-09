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
                "shrink-0 w-9 h-9 rounded-full flex items-center justify-center overflow-hidden border mt-1 shadow-sm",
                isUser ? "bg-stone-800 text-white border-stone-700" : "bg-white border-amber-700 shadow-md"
            )}>
                {isUser ? (
                    <User className="w-5 h-5 text-stone-200" />
                ) : (
                    <img src={leaderImage} alt={leaderName} className="w-full h-full object-cover object-top aspect-square" />
                )}
            </div>

            <div className={cn(
                "max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm",
                isUser
                    ? "bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white rounded-tr-sm font-medium"
                    : "bg-white border border-[#e2d9cd] text-stone-900 rounded-tl-sm shadow-md font-medium"
            )}>
                <div className="whitespace-pre-wrap break-words">{text}</div>

                {/* Sources UI */}
                {!isUser && sources && sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-stone-200">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2 uppercase tracking-wider">
                            <Book className="w-3.5 h-3.5" />
                            <span>Source Documents</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {sources.map((source, idx) => (
                                <div key={idx} className="bg-stone-50 border border-stone-200 rounded-lg overflow-hidden">
                                    <button 
                                        onClick={() => toggleSource(idx)}
                                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <span className="font-bold truncate text-amber-800">{source.source}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-stone-500 text-xs">
                                            <span>View Excerpt</span>
                                            {expandedSourceIndex === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </div>
                                    </button>
                                    
                                    <AnimatePresence>
                                        {expandedSourceIndex === idx && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-3 pb-3 pt-1 border-t border-stone-200"
                                            >
                                                <div className="text-[13px] text-stone-700 bg-white p-2.5 rounded border border-stone-200 whitespace-pre-wrap break-words">
                                                    {source.document}
                                                </div>
                                                <div className="mt-1.5 text-[10px] text-stone-400 text-right uppercase tracking-wider font-semibold">
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
