import React from "react";
import type { Book } from "../data/books";
import { Star, BookOpen, BookHeart, Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookCardProps {
    book: Book;
    onSelectBook: (book: Book) => void;
    isSaved?: boolean;
    onToggleSave?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onSelectBook, isSaved = false, onToggleSave }) => {
    const navigate = useNavigate();

    const handleChatWithAuthor = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/chat?bookId=${book.id}`);
    };

    return (
        <div 
            onClick={() => onSelectBook(book)}
            className="group relative rounded-2xl bg-white border border-[#e7dfd5] hover:border-amber-600/50 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/5 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
        >
            {/* Top Category & Cover */}
            <div>
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-4 bg-stone-100 shadow-inner group border border-stone-200">
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-white/95 backdrop-blur-md text-stone-900 border border-stone-200 shadow-sm">
                            {book.category}
                        </span>

                        {onToggleSave && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleSave(book);
                                }}
                                className={`pointer-events-auto p-2 rounded-full backdrop-blur-md border transition-all ${
                                    isSaved
                                        ? "bg-amber-700 text-white border-amber-800 shadow-md scale-105"
                                        : "bg-white/90 text-stone-700 border-stone-300 hover:text-amber-800 hover:border-amber-600"
                                }`}
                                title={isSaved ? "Saved in Reading List" : "Add to Saved Books"}
                            >
                                {isSaved ? <Check className="w-4 h-4 stroke-[3]" /> : <BookHeart className="w-4 h-4" />}
                            </button>
                        )}
                    </div>

                    {/* Author Badge over cover bottom */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 bg-white/95 backdrop-blur-md p-2 rounded-lg border border-stone-200 shadow-sm">
                        <img
                            src={book.authorPersona.avatar}
                            alt={book.author}
                            className="w-7 h-7 rounded-full object-cover border border-amber-600/50"
                        />
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-stone-900 truncate">{book.author}</p>
                            <p className="text-[10px] text-amber-800 font-semibold truncate">Author & Persona AI</p>
                        </div>
                    </div>
                </div>

                {/* Rating & Details */}
                <div className="flex items-center gap-2 mb-1.5 text-xs text-stone-500 font-medium">
                    <div className="flex items-center text-amber-600 gap-1 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{book.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{book.pages} pages</span>
                    <span>•</span>
                    <span>{book.publishedYear}</span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1 mb-2">
                    {book.title}
                </h3>

                {/* Quote preview */}
                <blockquote className="text-xs text-stone-600 italic line-clamp-2 mb-4 border-l-2 border-amber-600/40 pl-2.5">
                    "{book.quote}"
                </blockquote>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                <div>
                    <span className="text-[11px] text-stone-400 font-medium block -mb-0.5">Price</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-amber-800">${book.price.toFixed(2)}</span>
                        {book.originalPrice && (
                            <span className="text-xs text-stone-400 line-through">${book.originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectBook(book);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 hover:text-stone-900 transition-colors"
                        title="View Book Details & Chapters"
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                    </button>

                    <button
                        onClick={handleChatWithAuthor}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white text-xs font-bold shadow-md shadow-amber-900/10 hover:shadow-amber-900/25 transition-all hover:scale-105 active:scale-95"
                        title={`Converse with ${book.author}`}
                    >
                        <Sparkles className="w-3.5 h-3.5 fill-white" />
                        <span>AI Chat</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
