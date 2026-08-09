import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { booksData } from "../data/books";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import {
    Heading1,
    Heading2,
    Bold,
    Italic,
    Quote,
    List,
    Image as ImageIcon,
    Tag,
    Save,
    Send,
    ArrowLeft,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    FileText,
    Trash2,
    Edit3,
    Plus,
    BookOpen
} from "lucide-react";
import axios from "axios";

export const WritePage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { token, user, isAuthenticated } = useAuth();

    const bookIdParam = searchParams.get("bookId");
    const editPostId = searchParams.get("edit");

    const [selectedBookId, setSelectedBookId] = useState<string>(bookIdParam || booksData[0].id);
    const [currentPostId, setCurrentPostId] = useState<string | null>(editPostId);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [favoriteIdea, setFavoriteIdea] = useState("");
    const [tagsInput, setTagsInput] = useState("habits, selfimprovement, productivity");
    const [coverImage, setCoverImage] = useState("");

    const [myPosts, setMyPosts] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Redirect to login if unauthenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login?redirect=/write");
        }
    }, [isAuthenticated, navigate]);

    // Fetch user's own articles and drafts (READ operation)
    const fetchMyPosts = useCallback(async () => {
        if (!user?.id) return;
        setIsLoadingPosts(true);
        try {
            const res = await axios.get(`/api/users/${user.id}/posts`);
            if (res.data.success) {
                setMyPosts(res.data.posts || []);
            }
        } catch (err) {
            console.error("Error fetching user posts:", err);
        } finally {
            setIsLoadingPosts(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchMyPosts();
    }, [fetchMyPosts]);

    // Pre-populate post for editing (UPDATE operation)
    useEffect(() => {
        if (currentPostId) {
            axios.get(`/api/posts/${currentPostId}`).then((res) => {
                if (res.data.success) {
                    const p = res.data.post;
                    setTitle(p.title);
                    setContent(p.content);
                    setFavoriteIdea(p.favoriteIdea || "");
                    setTagsInput((p.tags || []).join(", "));
                    setCoverImage(p.coverImage || "");
                    if (p.bookId) setSelectedBookId(p.bookId);
                }
            }).catch((err) => console.error(err));
        }
    }, [currentPostId]);

    // Reset editor for creating a new post
    const handleNewStory = () => {
        setCurrentPostId(null);
        setTitle("");
        setContent("");
        setFavoriteIdea("");
        setTagsInput("habits, selfimprovement");
        setCoverImage("");
        setSelectedBookId(booksData[0].id);
        setStatusMessage({ type: "success", text: "Editor reset for a new story." });
    };

    // Format helpers
    const handleFormat = (command: string) => {
        if (command === "h2") setContent((prev) => prev + "\n## ");
        if (command === "h3") setContent((prev) => prev + "\n### ");
        if (command === "bold") setContent((prev) => prev + " **bold text** ");
        if (command === "italic") setContent((prev) => prev + " *italic text* ");
        if (command === "quote") setContent((prev) => prev + "\n> ");
        if (command === "list") setContent((prev) => prev + "\n- ");
    };

    // CREATE or UPDATE operation
    const handleSavePost = async (publishStatus: "draft" | "published") => {
        if (!title.trim()) {
            setStatusMessage({ type: "error", text: "Post title is required." });
            return;
        }
        if (!content.trim()) {
            setStatusMessage({ type: "error", text: "Post content cannot be empty." });
            return;
        }
        if (!selectedBookId) {
            setStatusMessage({ type: "error", text: "Please select a book associated with your post." });
            return;
        }

        setIsSaving(true);
        setStatusMessage(null);

        const tags = tagsInput
            .split(",")
            .map((t) => t.trim().replace(/^#/, ""))
            .filter((t) => t.length > 0);

        try {
            const payload = {
                bookId: selectedBookId,
                title: title.trim(),
                content: content.trim(),
                favoriteIdea: favoriteIdea.trim(),
                tags,
                coverImage: coverImage.trim() || undefined,
                status: publishStatus
            };

            let res;
            if (currentPostId) {
                // UPDATE operation
                res = await axios.put(`/api/posts/${currentPostId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // CREATE operation
                res = await axios.post("/api/posts", payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            if (res.data.success) {
                setStatusMessage({
                    type: "success",
                    text: `Successfully ${publishStatus === "published" ? "published" : "saved draft"}!`
                });
                fetchMyPosts();
                if (publishStatus === "published") {
                    setTimeout(() => {
                        navigate(`/posts/${res.data.post.id}`);
                    }, 1000);
                } else {
                    setCurrentPostId(res.data.post.id);
                }
            }
        } catch (err: any) {
            setStatusMessage({
                type: "error",
                text: err?.response?.data?.message || err.message || "Failed to save post."
            });
        } finally {
            setIsSaving(false);
        }
    };

    // DELETE operation
    const handleDeletePost = async (postId: string, postTitle: string) => {
        if (!window.confirm(`Are you sure you want to delete "${postTitle}"?`)) return;

        try {
            const res = await axios.delete(`/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setStatusMessage({ type: "success", text: "Article deleted successfully." });
                if (currentPostId === postId) {
                    handleNewStory();
                }
                fetchMyPosts();
            }
        } catch (err: any) {
            setStatusMessage({ type: "error", text: "Failed to delete article." });
        }
    };

    const selectedBook = booksData.find((b) => b.id === selectedBookId) || booksData[0];

    return (
        <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-900 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* LEFT SIDEBAR: My Stories & Drafts (CRUD Manager) */}
                    <aside className="lg:col-span-1 space-y-4">
                        <div className="bg-white border border-[#e2d9cd] rounded-3xl p-5 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-1.5">
                                    <FileText className="w-4 h-4 text-amber-800" />
                                    My Articles & Drafts
                                </h3>
                                <button
                                    onClick={handleNewStory}
                                    className="p-1.5 rounded-lg bg-amber-100 border border-amber-300 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1 transition-all"
                                    title="Create New Post"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    New
                                </button>
                            </div>

                            {isLoadingPosts ? (
                                <p className="text-xs text-stone-400 font-medium">Loading your stories...</p>
                            ) : myPosts.length === 0 ? (
                                <div className="text-center py-6 border border-dashed border-stone-200 rounded-2xl">
                                    <BookOpen className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                                    <p className="text-xs text-stone-500 font-semibold">No stories written yet</p>
                                    <p className="text-[11px] text-stone-400">Share your first reflection!</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                                    {myPosts.map((post) => (
                                        <div
                                            key={post.id}
                                            className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between gap-2 ${
                                                currentPostId === post.id
                                                    ? "bg-amber-50 border-amber-400 shadow-sm"
                                                    : "bg-stone-50 border-stone-200 hover:bg-stone-100"
                                            }`}
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                            post.status === "published"
                                                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                                                : "bg-amber-100 text-amber-900 border border-amber-300"
                                                        }`}
                                                    >
                                                        {post.status === "published" ? "Published" : "Draft"}
                                                    </span>
                                                    <span className="text-[10px] text-stone-400">
                                                        {new Date(post.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h4 className="font-serif text-xs font-bold text-stone-900 line-clamp-1">
                                                    {post.title}
                                                </h4>
                                                <p className="text-[11px] text-stone-500 line-clamp-1">
                                                    Book: {post.bookTitle || post.bookId}
                                                </p>
                                            </div>

                                            {/* CRUD Action Buttons for each post */}
                                            <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-stone-200/60">
                                                <button
                                                    onClick={() => setCurrentPostId(post.id)}
                                                    className="p-1 rounded-md text-amber-900 hover:bg-amber-200/60 text-[11px] font-bold flex items-center gap-1"
                                                    title="Edit Post"
                                                >
                                                    <Edit3 className="w-3 h-3" />
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDeletePost(post.id, post.title)}
                                                    className="p-1 rounded-md text-rose-700 hover:bg-rose-100 text-[11px] font-bold flex items-center gap-1"
                                                    title="Delete Post"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* MAIN PUBLISHING CANVAS: Editor for CREATE & UPDATE */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Top Action Bar */}
                        <div className="flex items-center justify-between border-b border-[#e2d9cd] pb-4">
                            <button
                                onClick={() => navigate("/community")}
                                className="flex items-center gap-2 text-stone-600 hover:text-amber-900 text-xs font-bold transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Community</span>
                            </button>

                            <div className="flex items-center gap-3">
                                {currentPostId && (
                                    <button
                                        onClick={() => handleDeletePost(currentPostId, title || "this post")}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all shadow-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete</span>
                                    </button>
                                )}

                                <button
                                    onClick={() => handleSavePost("draft")}
                                    disabled={isSaving}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Save Draft</span>
                                </button>

                                <button
                                    onClick={() => handleSavePost("published")}
                                    disabled={isSaving}
                                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white text-xs font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{currentPostId ? "Update & Publish" : "Publish Story"}</span>
                                </button>
                            </div>
                        </div>

                        {/* Status Message Banner */}
                        {statusMessage && (
                            <div
                                className={`p-4 rounded-2xl border text-sm font-semibold flex items-center gap-2 ${
                                    statusMessage.type === "success"
                                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                                        : "bg-rose-50 border-rose-300 text-rose-900"
                                }`}
                            >
                                {statusMessage.type === "success" ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
                                )}
                                <span>{statusMessage.text}</span>
                            </div>
                        )}

                        {/* Substack Publishing Canvas */}
                        <div className="bg-white border border-[#e2d9cd] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
                            {/* Book Selector Header */}
                            <div className="p-4 rounded-2xl bg-[#f5f0e8] border border-[#e2d9cd] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={selectedBook.coverImage}
                                        alt={selectedBook.title}
                                        className="w-10 h-14 object-cover rounded-md border border-stone-300 shrink-0"
                                    />
                                    <div>
                                        <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                                            {currentPostId ? "Editing Article About Book" : "Writing About Book"}
                                        </span>
                                        <p className="font-serif text-sm font-bold text-stone-900">{selectedBook.title}</p>
                                        <p className="text-xs text-stone-500 font-medium">by {selectedBook.author}</p>
                                    </div>
                                </div>

                                <select
                                    value={selectedBookId}
                                    onChange={(e) => setSelectedBookId(e.target.value)}
                                    className="w-full sm:w-auto px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-900 focus:outline-none focus:border-amber-700 cursor-pointer shadow-sm"
                                >
                                    {booksData.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.title} ({b.author})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Title Input */}
                            <input
                                type="text"
                                placeholder="Title of your post (e.g. The One Idea from Atomic Habits That Changed My Routine)..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-2xl sm:text-3xl font-serif font-extrabold text-stone-900 placeholder:text-stone-300 focus:outline-none border-b border-transparent focus:border-stone-300 pb-2 transition-colors"
                            />

                            {/* Favorite Idea Highlight Callout */}
                            <div className="p-4 rounded-2xl bg-amber-50 border-l-4 border-amber-700 space-y-2">
                                <label className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 fill-amber-700 text-amber-800" />
                                    Favorite Core Idea / Quote from the Book
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Small 1% improvements compound over time into monumental growth..."
                                    value={favoriteIdea}
                                    onChange={(e) => setFavoriteIdea(e.target.value)}
                                    className="w-full text-sm font-medium text-stone-800 placeholder:text-amber-900/40 bg-transparent focus:outline-none italic"
                                />
                            </div>

                            {/* Rich Formatting Toolbar */}
                            <div className="flex items-center gap-1 p-2 rounded-xl bg-stone-100 border border-stone-200 overflow-x-auto">
                                <button
                                    type="button"
                                    onClick={() => handleFormat("h2")}
                                    className="p-2 rounded-lg hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1"
                                    title="Heading 2"
                                >
                                    <Heading1 className="w-4 h-4" />
                                    H2
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFormat("h3")}
                                    className="p-2 rounded-lg hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1"
                                    title="Heading 3"
                                >
                                    <Heading2 className="w-4 h-4" />
                                    H3
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFormat("bold")}
                                    className="p-2 rounded-lg hover:bg-stone-200 text-stone-700"
                                    title="Bold"
                                >
                                    <Bold className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFormat("italic")}
                                    className="p-2 rounded-lg hover:bg-stone-200 text-stone-700"
                                    title="Italic"
                                >
                                    <Italic className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFormat("quote")}
                                    className="p-2 rounded-lg hover:bg-stone-200 text-stone-700"
                                    title="Blockquote"
                                >
                                    <Quote className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFormat("list")}
                                    className="p-2 rounded-lg hover:bg-stone-200 text-stone-700"
                                    title="Bullet List"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Content Textarea */}
                            <textarea
                                rows={14}
                                placeholder="Share your personal experience, takeaways, and lessons learned from this book. What changed in your life after reading it?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full text-base text-stone-800 placeholder:text-stone-300 font-normal leading-relaxed focus:outline-none resize-y min-h-[300px]"
                            />

                            {/* Cover Image & Tags Metadata */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-600 flex items-center gap-1">
                                        <ImageIcon className="w-3.5 h-3.5 text-amber-800" />
                                        Cover Image URL (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="https://images.unsplash.com/..."
                                        value={coverImage}
                                        onChange={(e) => setCoverImage(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-600 flex items-center gap-1">
                                        <Tag className="w-3.5 h-3.5 text-amber-800" />
                                        Tags (Comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="habits, productivity, selfimprovement"
                                        value={tagsInput}
                                        onChange={(e) => setTagsInput(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
