import React from "react";
import type { Book } from "../data/books";
import { X, Trash2, Sparkles, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ReadingListDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    savedBooks: Book[];
    onRemoveBook: (bookId: string) => void;
    onClearAll: () => void;
}

export const ReadingListDrawer: React.FC<ReadingListDrawerProps> = ({
    isOpen,
    onClose,
    savedBooks,
    onRemoveBook,
    onClearAll
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const totalPrice = savedBooks.reduce((sum, b) => sum + b.price, 0);

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-[#faf7f2] border-l border-[#e2d9cd] shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-5 bg-[#f5f0e8] border-b border-[#e2d9cd] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-amber-800" />
                            <h2 className="font-serif text-lg font-bold text-stone-900">Saved Reading List</h2>
                            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-900">
                                {savedBooks.length}
                            </span>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Book items list */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                        {savedBooks.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                                <BookOpen className="w-12 h-12 text-stone-300 mb-3" />
                                <p className="font-serif text-base font-bold text-stone-700">Your Reading List is Empty</p>
                                <p className="text-xs text-stone-500 mt-1">
                                    Click the heart icon on any book card to save it to your personal library.
                                </p>
                            </div>
                        ) : (
                            savedBooks.map((book) => (
                                <div
                                    key={book.id}
                                    className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-amber-600/40 flex items-center gap-3 group transition-all shadow-sm"
                                >
                                    <img
                                        src={book.coverImage}
                                        alt={book.title}
                                        className="w-14 h-18 object-cover rounded-lg border border-stone-200 shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-amber-800 font-bold truncate">{book.category}</p>
                                        <h4 className="font-serif text-sm font-bold text-stone-900 truncate">{book.title}</h4>
                                        <p className="text-xs text-stone-500 truncate">by {book.author}</p>
                                        <p className="text-xs font-extrabold text-amber-800 mt-1">${book.price.toFixed(2)}</p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => {
                                                onClose();
                                                navigate(`/chat?bookId=${book.id}`);
                                            }}
                                            className="p-2 rounded-lg bg-amber-100 hover:bg-amber-700 text-amber-900 hover:text-white transition-colors"
                                            title="Chat with Author AI"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onRemoveBook(book.id)}
                                            className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                            title="Remove from Reading List"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer summary */}
                    {savedBooks.length > 0 && (
                        <div className="p-6 bg-[#f5f0e8] border-t border-[#e2d9cd] space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-stone-600 font-medium">Total Value:</span>
                                <span className="font-serif text-lg font-bold text-amber-900">${totalPrice.toFixed(2)}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onClearAll}
                                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:text-rose-600 text-xs font-bold transition-colors"
                                >
                                    Clear List
                                </button>
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate("/chat");
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white text-xs font-bold shadow-md shadow-amber-900/15 hover:scale-[1.02] transition-transform"
                                >
                                    <span>Converse with AI Authors</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
