import React, { useState } from "react";
import { getTodayQuote, dailyQuotesList } from "../data/dailyQuotes";
import type { DailyQuote } from "../data/dailyQuotes";
import { Sparkles, RefreshCw, Quote, Calendar, Lightbulb, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuoteOfTheDay: React.FC = () => {
    const navigate = useNavigate();
    
    // Default to today's auto-selected quote
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(() => {
        const today = getTodayQuote();
        const foundIdx = dailyQuotesList.findIndex(q => q.id === today.id);
        return foundIdx >= 0 ? foundIdx : 0;
    });

    const activeQuote: DailyQuote = dailyQuotesList[currentQuoteIndex];

    // Format today's date nicely (e.g., "Sunday, Aug 9, 2026")
    const formattedDate = new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    const handleNextQuote = () => {
        setCurrentQuoteIndex((prev) => (prev + 1) % dailyQuotesList.length);
    };

    return (
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-950 via-stone-900 to-stone-950 border border-amber-800/40 p-6 md:p-8 shadow-xl overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700 pointer-events-none" />

            <div className="relative z-10 space-y-5">
                {/* Header Badge & Date */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-800/30 pb-4">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-extrabold uppercase tracking-wider">
                            <Quote className="w-3.5 h-3.5 fill-amber-300" />
                            Daily Motivation Quote
                        </span>
                        
                        <span className="flex items-center gap-1 text-xs text-amber-200/80 font-semibold bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            {formattedDate}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-amber-300/70 hidden sm:inline font-medium">Auto-Updates Every 24h</span>
                        <button
                            onClick={handleNextQuote}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 hover:text-white text-xs font-semibold transition-colors"
                            title="Shuffle to another inspirational quote"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Shuffle</span>
                        </button>
                    </div>
                </div>

                {/* Quote Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-2 space-y-3">
                        <blockquote className="font-serif text-lg md:text-2xl font-bold text-amber-100 italic leading-relaxed">
                            "{activeQuote.quote}"
                        </blockquote>

                        <div className="flex items-center gap-3 pt-2">
                            <img
                                src={activeQuote.avatar}
                                alt={activeQuote.author}
                                className="w-10 h-10 rounded-full object-cover border-2 border-amber-400/60 shadow-md"
                            />
                            <div>
                                <p className="text-sm font-extrabold text-white">{activeQuote.author}</p>
                                <p className="text-xs text-amber-300 font-semibold">
                                    from <span className="underline decoration-amber-500">{activeQuote.bookTitle}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* AI Reflection / Action Card */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/20 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                            <Lightbulb className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                            <span>Daily Reflection</span>
                        </div>
                        <p className="text-xs text-stone-200 leading-relaxed italic">
                            "{activeQuote.dailyReflection}"
                        </p>
                        
                        <button
                            onClick={() => navigate(`/chat?bookId=${activeQuote.bookId}&prompt=Can you elaborate on your daily quote: "${encodeURIComponent(activeQuote.quote)}"? How can I apply this today?`)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-98 transition-all"
                        >
                            <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
                            <span>Discuss with {activeQuote.author}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
