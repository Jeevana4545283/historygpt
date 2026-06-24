import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import API from "../services/api";
import { TypingLoader } from "./TypingLoader";

interface TimelinePanelProps {
    leaderName: string;
    isOpen: boolean;
    onClose: () => void;
}

export const TimelinePanel = ({ leaderName, isOpen, onClose }: TimelinePanelProps) => {
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        
        const fetchTimeline = async () => {
            setIsLoading(true);
            try {
                const res = await API.get(`/timeline/${encodeURIComponent(leaderName)}`);
                if (res.data.success) {
                    setEvents(res.data.events);
                }
            } catch (err) {
                console.error("Failed to fetch timeline:", err);
                setEvents([{ year: "Error", title: "Connection Failed", description: "Could not fetch timeline data." }]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTimeline();
    }, [leaderName, isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="absolute right-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-2xl border-l border-slate-800 z-30 shadow-2xl flex flex-col"
                >
                    <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-slate-200">Timeline</h3>
                        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        <div className="relative border-l-2 border-slate-700 ml-3 space-y-8 pb-8">
                            {isLoading ? (
                                <div className="pl-6 pt-4 text-sky-400">
                                    <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                                        Generating timeline
                                        <TypingLoader />
                                    </div>
                                    <div className="text-xs text-slate-500">This may take a moment on first load...</div>
                                </div>
                            ) : events.length === 0 ? (
                                <div className="pl-6 pt-4 text-slate-500 text-sm">No timeline events found.</div>
                            ) : (
                                events.map((ev, i) => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={i} 
                                        className="relative pl-6"
                                    >
                                        <div className="absolute w-3 h-3 bg-sky-500 rounded-full -left-[7.5px] top-1.5 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                                        <div className="font-bold text-sky-400 text-sm mb-1">{ev.year} - {ev.title}</div>
                                        <div className="text-slate-300 text-sm leading-relaxed">{ev.description}</div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
