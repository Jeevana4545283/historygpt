import React, { useState, useMemo } from "react";
import { booksData, BOOK_CATEGORIES } from "../data/books";
import type { Book } from "../data/books";
import { BookCard } from "../components/BookCard";
import { BookDetailsModal } from "../components/BookDetailsModal";
import { QuoteOfTheDay } from "../components/QuoteOfTheDay";
import { Navbar } from "../components/Navbar";
import { ReadingListDrawer } from "../components/ReadingListDrawer";
import { Search, Sparkles, BookOpen, Filter, ArrowUpDown, Award, Users, BookMarked, ShieldCheck } from "lucide-react";

export const HomePage: React.FC = () => {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [sortBy, setSortBy] = useState<"rating" | "price-asc" | "price-desc" | "published">("rating");
    const [savedBookIds, setSavedBookIds] = useState<string[]>(() => {
        const local = localStorage.getItem("wisdomvault_saved_books");
        return local ? JSON.parse(local) : ["atomic-habits", "pride-and-prejudice"];
    });
    const [isReadingListOpen, setIsReadingListOpen] = useState(false);

    // Save handler
    const toggleSaveBook = (book: Book) => {
        setSavedBookIds((prev) => {
            const updated = prev.includes(book.id) ? prev.filter((id) => id !== book.id) : [...prev, book.id];
            localStorage.setItem("wisdomvault_saved_books", JSON.stringify(updated));
            return updated;
        });
    };

    const savedBooks = useMemo(() => {
        return booksData.filter((b) => savedBookIds.includes(b.id));
    }, [savedBookIds]);

    const categories = ["All", ...BOOK_CATEGORIES];

    // Filter and Sort
    const filteredBooks = useMemo(() => {
        return booksData
            .filter((book) => {
                const matchesSearch =
                    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.category.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                if (sortBy === "rating") return b.rating - a.rating;
                if (sortBy === "price-asc") return a.price - b.price;
                if (sortBy === "price-desc") return b.price - a.price;
                if (sortBy === "published") return b.publishedYear - a.publishedYear;
                return 0;
            });
    }, [searchQuery, selectedCategory, sortBy]);

    return (
        <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-900 flex flex-col">
            {/* Top Navigation */}
            <Navbar
                readingListCount={savedBooks.length}
                onOpenReadingList={() => setIsReadingListOpen(true)}
            />

            {/* Main Content Container */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-10">
                {/* Hero Section */}
                <section className="relative rounded-3xl bg-[#f5f0e8] border border-[#e2d9cd] p-8 md:p-12 overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 fill-amber-700" />
                            Discover Books. Share Ideas. Inspire Others.
                        </div>

                        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
                            Explore Great Books & <br />
                            <span className="bg-gradient-to-r from-amber-800 via-amber-700 to-stone-900 bg-clip-text text-transparent">
                                Join the Readers' Community
                            </span>
                        </h1>

                        <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-medium">
                            Read meaningful books across Romance, Fiction, Classics, Fantasy, Mystery, and Inspirational self-growth. Share your favorite ideas, publish Substack-style articles, and discover what other readers are learning.
                        </p>

                        {/* Quick Stats Bar */}
                        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#e2d9cd]">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-white text-amber-800 border border-stone-200 shadow-sm">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-stone-900">{booksData.length} Books</p>
                                    <p className="text-[11px] text-stone-500 font-medium">19 Diverse Categories</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-white text-amber-800 border border-stone-200 shadow-sm">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-stone-900">Community</p>
                                    <p className="text-[11px] text-stone-500 font-medium">Share & Discuss</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-white text-amber-800 border border-stone-200 shadow-sm">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-stone-900">4.9 ★ Rating</p>
                                    <p className="text-[11px] text-stone-500 font-medium">Reader Reviews</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-white text-amber-800 border border-stone-200 shadow-sm">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-stone-900">AI Companion</p>
                                    <p className="text-[11px] text-stone-500 font-medium">Gemini & RAG</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quote of the day banner */}
                <QuoteOfTheDay />

                {/* Search & Filter Toolbar */}
                <section className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Search books by title, author, category, or keyword (e.g. Romance, Harry Potter, Atomic Habits)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-amber-700 shadow-sm transition-colors placeholder:text-stone-400 font-medium"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2 self-end md:self-auto">
                            <div className="flex items-center gap-2 px-3 py-3 rounded-2xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold shadow-sm">
                                <ArrowUpDown className="w-3.5 h-3.5 text-amber-800" />
                                <span>Sort By:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="bg-transparent text-amber-900 font-bold focus:outline-none cursor-pointer"
                                >
                                    <option value="rating" className="bg-white text-stone-900">Highest Rated</option>
                                    <option value="price-asc" className="bg-white text-stone-900">Price: Low to High</option>
                                    <option value="price-desc" className="bg-white text-stone-900">Price: High to Low</option>
                                    <option value="published" className="bg-white text-stone-900">Publication Year</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        <span className="text-xs font-bold text-stone-500 mr-1 flex items-center gap-1 shrink-0">
                            <Filter className="w-3.5 h-3.5 text-amber-800" />
                            Categories:
                        </span>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                    selectedCategory === cat
                                        ? "bg-amber-800 text-white shadow-md shadow-amber-900/10 scale-105 font-bold"
                                        : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-300"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Books Grid */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                            <BookMarked className="w-5 h-5 text-amber-800" />
                            {selectedCategory === "All" ? "Explore Featured Books" : `${selectedCategory} Books`}
                        </h2>
                        <span className="text-xs font-medium text-stone-500">Showing {filteredBooks.length} books</span>
                    </div>

                    {filteredBooks.length === 0 ? (
                        <div className="py-16 text-center rounded-3xl bg-white border border-stone-200 shadow-sm">
                            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                            <p className="font-serif text-lg font-bold text-stone-700">No books found</p>
                            <p className="text-xs text-stone-500 mt-1">Try adjusting your search query or category filter.</p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("All");
                                }}
                                className="mt-4 px-4 py-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBooks.map((book) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    onSelectBook={(b) => setSelectedBook(b)}
                                    isSaved={savedBookIds.includes(book.id)}
                                    onToggleSave={toggleSaveBook}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Book Details Modal */}
            <BookDetailsModal
                book={selectedBook}
                onClose={() => setSelectedBook(null)}
                isSaved={selectedBook ? savedBookIds.includes(selectedBook.id) : false}
                onToggleSave={toggleSaveBook}
            />

            {/* Reading List Slide-Over Drawer */}
            <ReadingListDrawer
                isOpen={isReadingListOpen}
                onClose={() => setIsReadingListOpen(false)}
                savedBooks={savedBooks}
                onRemoveBook={(id) => {
                    const updated = savedBookIds.filter((bId) => bId !== id);
                    setSavedBookIds(updated);
                    localStorage.setItem("wisdomvault_saved_books", JSON.stringify(updated));
                }}
                onClearAll={() => {
                    setSavedBookIds([]);
                    localStorage.setItem("wisdomvault_saved_books", JSON.stringify([]));
                }}
            />

            {/* Footer */}
            <footer className="mt-16 border-t border-[#e2d9cd] bg-[#f5f0e8] py-8 px-4 text-center text-xs text-stone-600">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
                    <p>© 2026 InspireBooks — Read. Reflect. Share. Discover.</p>
                    <p className="text-amber-900 font-bold">Powered by OpenRouter LLM & RAG Engine</p>
                </div>
            </footer>
        </div>
    );
};
