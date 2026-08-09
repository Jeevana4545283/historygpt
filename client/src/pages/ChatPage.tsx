import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../services/api";

import { ChatWindow } from "../components/ChatWindow";
import { UploadModal } from "../components/UploadModal";
import { GalleryModal } from "../components/GalleryModal";
import { booksData } from "../data/books";
import type { Book } from "../data/books";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    text: string;
    sources?: any[];
}

const ChatPage = () => {
    const [searchParams] = useSearchParams();

    const bookIdParam = searchParams.get("bookId");
    const initialPromptParam = searchParams.get("prompt");

    // Match selected book from bookId or default to first book
    const [selectedBook, setSelectedBook] = useState<Book>(() => {
        if (bookIdParam) {
            const found = booksData.find((b) => b.id === bookIdParam);
            if (found) return found;
        }
        return booksData[0];
    });

    // Store conversation history individually for each book/author
    const [conversations, setConversations] = useState<Record<string, Message[]>>(() => {
        try {
            const cached = localStorage.getItem("wisdomvault_chats");
            return cached ? JSON.parse(cached) : {};
        } catch (e) {
            console.error("Error loading chat history:", e);
            return {};
        }
    });

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    // If query param prompt exists, populate input
    useEffect(() => {
        if (initialPromptParam) {
            setInput(initialPromptParam);
        }
    }, [initialPromptParam]);

    // Update state if bookIdParam changes
    useEffect(() => {
        if (bookIdParam) {
            const found = booksData.find((b) => b.id === bookIdParam);
            if (found) setSelectedBook(found);
        }
    }, [bookIdParam]);

    // Save conversations
    useEffect(() => {
        localStorage.setItem("wisdomvault_chats", JSON.stringify(conversations));
    }, [conversations]);

    const messages = conversations[selectedBook.id] || [];

    // Map selected book to leader format for existing ChatWindow & Sidebar compatibility
    const mappedLeader = {
        name: selectedBook.author,
        role: `${selectedBook.authorPersona.role} (Author of "${selectedBook.title}")`,
        image: selectedBook.authorPersona.avatar
    };

    const sendMessage = async (overridePrompt?: string) => {
        const textToSend = overridePrompt || input;
        if (!textToSend.trim() || isLoading) return;

        const userMsg = textToSend.trim();

        // Optimistically update UI
        setConversations((prev) => ({
            ...prev,
            [selectedBook.id]: [...(prev[selectedBook.id] || []), { role: "user", text: userMsg }]
        }));

        setInput("");
        setIsLoading(true);

        try {
            const history = messages.map((msg) => ({
                role: msg.role,
                content: msg.text
            }));

            const res = await API.post("/chat", {
                prompt: userMsg,
                character: selectedBook.ragKey,
                history: history
            });

            if (res.data.success) {
                setConversations((prev) => ({
                    ...prev,
                    [selectedBook.id]: [
                        ...(prev[selectedBook.id] || []),
                        { role: "assistant", text: res.data.reply, sources: res.data.sources }
                    ]
                }));
            } else {
                throw new Error(res.data.message || "Failed to fetch response");
            }
        } catch (error: any) {
            console.error(error);
            const errorText =
                error.response?.data?.message || "Sorry, the network is temporarily unreachable. Please try again later.";
            setConversations((prev) => ({
                ...prev,
                [selectedBook.id]: [...(prev[selectedBook.id] || []), { role: "assistant", text: errorText }]
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-[100dvh] w-full overflow-hidden bg-[#faf7f2] font-sans text-stone-900 selection:bg-amber-200 selection:text-amber-900">
            {/* Sidebar with Book Selector */}
            <aside className="w-80 hidden lg:flex flex-col bg-[#f5f0e8] border-r border-[#e2d9cd] p-4 space-y-4 shrink-0">
                {/* Back to Bookstore */}
                <Link
                    to="/"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:text-amber-900 hover:border-amber-700 text-xs font-bold transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Bookstore</span>
                </Link>

                <div className="flex items-center gap-2 px-2 py-1">
                    <BookOpen className="w-4 h-4 text-amber-800" />
                    <span className="font-serif font-bold text-sm text-stone-900">Select Book & AI Author</span>
                </div>

                {/* Book List in Sidebar */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {booksData.map((book) => {
                        const isSelected = book.id === selectedBook.id;
                        return (
                            <button
                                key={book.id}
                                onClick={() => setSelectedBook(book)}
                                className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                                    isSelected
                                        ? "bg-white border-amber-700 shadow-md text-amber-900 font-bold"
                                        : "bg-white/60 border-stone-200 text-stone-600 hover:bg-white hover:text-stone-900"
                                }`}
                            >
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-10 h-14 object-cover rounded-md shrink-0 border border-stone-200 shadow-sm"
                                />
                                <div className="overflow-hidden">
                                    <p className="text-xs font-bold text-stone-900 truncate">{book.title}</p>
                                    <p className="text-[11px] text-amber-800 font-semibold truncate">{book.author}</p>
                                    <span className="text-[10px] text-stone-500 block truncate">{book.category}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Selected Book Sample Prompts */}
                <div className="p-3 rounded-2xl bg-white border border-stone-200 space-y-2 shadow-sm">
                    <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 fill-amber-700 text-amber-800" />
                        Sample Prompts for {selectedBook.author}
                    </p>
                    <div className="space-y-1.5">
                        {selectedBook.authorPersona.samplePrompts.map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => sendMessage(prompt)}
                                className="w-full text-left p-2 rounded-lg bg-stone-50 hover:bg-amber-50 text-[11px] text-stone-700 hover:text-amber-900 font-medium transition-colors border border-stone-200"
                            >
                                "{prompt}"
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Chat Window */}
            <main className="flex-1 relative min-w-0 bg-[#faf7f2]">
                <ChatWindow
                    leader={mappedLeader}
                    messages={messages}
                    isLoading={isLoading}
                    input={input}
                    setInput={setInput}
                    onSend={() => sendMessage()}
                />
            </main>

            <UploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                preselectedLeader={selectedBook.ragKey}
            />

            <GalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                preselectedLeader={selectedBook.ragKey}
            />
        </div>
    );
};

export default ChatPage;