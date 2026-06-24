import { useState } from "react";
import { Menu, X, ChevronDown, ChevronRight, UploadCloud, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from "./SearchBar";
import { LeaderCard } from "./LeaderCard";
import type { Character } from "../data/characters";

interface SidebarProps {
    characters: Character[];
    selectedLeader: string;
    onSelectLeader: (name: string) => void;
    onOpenUpload?: () => void;
    onOpenGallery?: () => void;
}

export const Sidebar = ({ characters, selectedLeader, onSelectLeader, onOpenUpload, onOpenGallery }: SidebarProps) => {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    
    // Track collapsed state for categories
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

    const toggleCategory = (category: string) => {
        setCollapsed(prev => ({ ...prev, [category]: !prev[category] }));
    };

    // Filter characters
    const filtered = characters.filter((c) => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.role.toLowerCase().includes(search.toLowerCase()) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(search.toLowerCase())) ||
        c.category.toLowerCase().includes(search.toLowerCase())
    );

    // Group by category
    const categories = ["Leaders", "Scientists", "Innovators"];
    const grouped = categories.map(cat => ({
        name: cat,
        items: filtered.filter(c => c.category === cat)
    })).filter(g => g.items.length > 0);

    const SidebarContent = (
        <div className="flex flex-col h-full w-full bg-slate-950/30 backdrop-blur-xl border-r border-slate-700/30 shadow-2xl md:shadow-none">
            <div className="p-5 border-b border-slate-700/30 flex items-center justify-between">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500 drop-shadow-md">
                    HistoryGPT
                </h1>
                <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            {/* Utilities */}
            <div className="p-4 border-b border-slate-700/30 space-y-1">
                <button 
                    onClick={onOpenUpload}
                    className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-sky-500/10 rounded-lg transition-colors group"
                >
                    <UploadCloud className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors" />
                    <span className="text-sm font-medium">Upload Knowledge</span>
                </button>
                <button 
                    onClick={onOpenGallery}
                    className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-sky-500/10 rounded-lg transition-colors group"
                >
                    <ImageIcon className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors" />
                    <span className="text-sm font-medium">Media Gallery</span>
                </button>
            </div>

            <div className="p-4 border-b border-slate-700/30">
                <SearchBar value={search} onChange={setSearch} />
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 scroll-smooth" style={{ scrollbarWidth: "thin", scrollbarColor: "#334155 transparent" }}>
                {grouped.length === 0 ? (
                    <div className="text-center text-slate-500 text-sm mt-8">No legends found</div>
                ) : (
                    grouped.map(group => (
                        <div key={group.name} className="space-y-1">
                            <button 
                                onClick={() => toggleCategory(group.name)}
                                className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
                            >
                                <span>{group.name} ({group.items.length})</span>
                                {collapsed[group.name] ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            
                            <AnimatePresence initial={false}>
                                {!collapsed[group.name] && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        {group.items.map((char) => (
                                            <LeaderCard
                                                key={char.name}
                                                {...char}
                                                isSelected={selectedLeader === char.name}
                                                onClick={() => {
                                                    onSelectLeader(char.name);
                                                    setIsOpen(false);
                                                }}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    return (
        <>
            <div className="md:hidden fixed top-0 left-0 z-40 p-4 w-full bg-slate-950/50 backdrop-blur-xl border-b border-slate-700/30 flex items-center shadow-lg">
                <button 
                    onClick={() => setIsOpen(true)}
                    className="p-2 rounded-lg bg-slate-800/40 border border-slate-600/50 text-slate-200 hover:bg-slate-700/60 transition-colors shadow-sm"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <span className="ml-4 font-semibold text-slate-200 truncate">
                    {selectedLeader}
                </span>
            </div>

            <div className="hidden md:block w-80 h-[100dvh] shrink-0 relative z-30">
                {SidebarContent}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 md:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="fixed inset-y-0 left-0 w-[300px] z-50 md:hidden"
                        >
                            {SidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
