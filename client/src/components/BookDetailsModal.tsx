import React, { useState, useEffect } from "react";
import type { Book } from "../data/books";
import { X, Star, Sparkles, BookOpen, CheckCircle, Upload, BookHeart, Check, FileText, MessageSquare, PenTool } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Post } from "../types";

interface BookDetailsModalProps {
    book: Book | null;
    onClose: () => void;
    isSaved?: boolean;
    onToggleSave?: (book: Book) => void;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ book, onClose, isSaved = false, onToggleSave }) => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const [communityPosts, setCommunityPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (book) {
            axios.get(`/api/posts/book/${book.id}`).then((res) => {
                if (res.data.success) {
                    setCommunityPosts(res.data.posts);
                }
            }).catch((err) => console.error(err));
        }
    }, [book]);

    if (!book) return null;

    const handleChatWithAuthor = () => {
        onClose();
        navigate(`/chat?bookId=${book.id}`);
    };

    const handleWritePost = () => {
        onClose();
        navigate(`/write?bookId=${book.id}`);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadSuccess(null);
        setUploadError(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("character", book.ragKey);

        try {
            const res = await axios.post("/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data.success) {
                setUploadSuccess(`Successfully ingested "${file.name}" into RAG memory for ${book.author}!`);
            } else {
                setUploadError(res.data.message || "Failed to upload document");
            }
        } catch (err: any) {
            setUploadError(err?.response?.data?.message || err.message || "Upload error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in">
            <div 
                className="relative w-full max-w-4xl max-h-[90vh] bg-[#faf7f2] border border-[#e2d9cd] text-stone-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header / Close Button */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#f5f0e8]/90 border-b border-[#e2d9cd] backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            {book.category}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">Published {book.publishedYear}</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
                    {/* Top Hero Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        {/* Book Cover */}
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-stone-300 group">
                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <p className="text-2xl font-bold">${book.price.toFixed(2)}</p>
                                <p className="text-xs opacity-90">Hardcover / Digital Edition</p>
                            </div>
                        </div>

                        {/* Title & Author Info */}
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 leading-tight">
                                    {book.title}
                                </h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <img
                                        src={book.authorPersona.avatar}
                                        alt={book.author}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-amber-700"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-stone-900">{book.author}</p>
                                        <p className="text-xs text-amber-800 font-semibold">{book.authorPersona.role}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ratings & Meta */}
                            <div className="flex flex-wrap items-center gap-4 py-2 border-y border-stone-200 text-xs text-stone-600 font-medium">
                                <div className="flex items-center text-amber-600 gap-1 font-bold">
                                    <Star className="w-4 h-4 fill-amber-500" />
                                    <span>{book.rating}</span>
                                    <span className="text-stone-400 font-normal">({book.reviewsCount} reviews)</span>
                                </div>
                                <span>•</span>
                                <span>{book.pages} pages</span>
                                <span>•</span>
                                <span>Instant AI Author Companion</span>
                            </div>

                            {/* Quote */}
                            <blockquote className="p-4 rounded-xl bg-amber-50 border-l-4 border-amber-700 text-stone-800 text-sm italic">
                                "{book.quote}"
                            </blockquote>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <button
                                    onClick={handleChatWithAuthor}
                                    className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white font-bold shadow-lg shadow-amber-900/15 hover:scale-[1.02] active:scale-98 transition-all"
                                >
                                    <Sparkles className="w-5 h-5 fill-white" />
                                    <span>Converse with AI Author ({book.author})</span>
                                </button>

                                {onToggleSave && (
                                    <button
                                        onClick={() => onToggleSave(book)}
                                        className={`px-4 py-3 rounded-xl border font-semibold text-sm flex items-center gap-2 transition-all ${
                                            isSaved
                                                ? "bg-amber-700 text-white border-amber-800 shadow-md"
                                                : "bg-white text-stone-800 border-stone-300 hover:border-amber-700"
                                        }`}
                                    >
                                        {isSaved ? <Check className="w-4 h-4" /> : <BookHeart className="w-4 h-4" />}
                                        <span>{isSaved ? "Saved" : "Save Book"}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Book Summary & Key Takeaways */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 rounded-2xl bg-white border border-[#e2d9cd] shadow-sm">
                            <h3 className="font-serif text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-amber-700" />
                                Book Overview
                            </h3>
                            <p className="text-sm text-stone-700 leading-relaxed">{book.summary}</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-[#e2d9cd] shadow-sm">
                            <h3 className="font-serif text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-amber-700" />
                                Key Principles & Takeaways
                            </h3>
                            <ul className="space-y-2.5">
                                {book.keyTakeaways.map((takeaway, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <span>{takeaway}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* READERS' THOUGHTS COMMUNITY SECTION */}
                    <div className="p-6 rounded-3xl bg-white border border-[#e2d9cd] shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <div>
                                <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-amber-700" />
                                    Readers' Thoughts & Community Essays
                                </h3>
                                <p className="text-xs text-stone-500">What fellow readers are saying about this book</p>
                            </div>

                            <button
                                onClick={handleWritePost}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold hover:bg-amber-900 transition-colors shadow-sm"
                            >
                                <PenTool className="w-4 h-4" />
                                <span>Share Your Thoughts</span>
                            </button>
                        </div>

                        {communityPosts.length === 0 ? (
                            <div className="text-center py-6 text-stone-500">
                                <p className="text-xs italic">No reader posts yet for this book. Be the first to publish your thoughts!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {communityPosts.slice(0, 3).map((post) => (
                                    <div
                                        key={post.id}
                                        onClick={() => {
                                            onClose();
                                            navigate(`/posts/${post.id}`);
                                        }}
                                        className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-700/50 cursor-pointer transition-all space-y-1"
                                    >
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-stone-900">{post.authorName}</span>
                                            <span className="text-[10px] text-stone-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="font-serif text-sm font-bold text-amber-900">{post.title}</p>
                                        {post.favoriteIdea && (
                                            <p className="text-xs italic text-stone-600 line-clamp-1">"{post.favoriteIdea}"</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Chapters Breakdown */}
                    <div className="p-5 rounded-2xl bg-white border border-[#e2d9cd] shadow-sm">
                        <h3 className="font-serif text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-amber-700" />
                            Featured Chapters & Themes
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {book.chapters.map((ch, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800">
                                    {ch}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Custom RAG Knowledge Base Upload */}
                    <div className="p-5 rounded-2xl bg-stone-100 border border-amber-700/30">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-amber-700" />
                                    Enrich AI Knowledge (Upload Document / PDF)
                                </h3>
                                <p className="text-xs text-stone-600 mt-1">
                                    Upload custom notes, PDF excerpts, or essays related to {book.title}. The AI RAG engine will instantly learn from it!
                                </p>
                            </div>

                            <label className="shrink-0 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-amber-700 text-amber-900 text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 shadow-sm">
                                <Upload className="w-4 h-4" />
                                <span>{uploading ? "Ingesting Document..." : "Select File (PDF/TXT)"}</span>
                                <input
                                    type="file"
                                    accept=".pdf,.txt,.doc,.docx"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {uploadSuccess && (
                            <p className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 font-medium">
                                ✓ {uploadSuccess}
                            </p>
                        )}
                        {uploadError && (
                            <p className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-xs text-rose-800 font-medium">
                                ✕ {uploadError}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
