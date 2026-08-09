import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import type { Post } from "../types";
import {
    Sparkles,
    Heart,
    MessageSquare,
    Bookmark,
    Share2,
    BookOpen,
    PenTool,
    Search,
    TrendingUp,
    Users,
    Compass,
    Check,
    X
} from "lucide-react";
import axios from "axios";

export const CommunityPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, token, isAuthenticated } = useAuth();

    const [activeTab, setActiveTab] = useState<"for-you" | "following" | "trending">("for-you");
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Comment Modal state
    const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [commentText, setCommentText] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // Toast & Share feedback
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const fetchFeed = async () => {
        setIsLoading(true);
        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
            let endpoint = "/api/posts/feed/for-you";
            if (activeTab === "following") endpoint = "/api/posts/feed/following";
            if (activeTab === "trending") endpoint = "/api/posts/feed/trending";

            const res = await axios.get(endpoint, config);
            if (res.data.success) {
                setPosts(res.data.posts);
            }
        } catch (err: any) {
            console.error("fetchFeed Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, [activeTab, token]);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const requireAuthAction = (action: () => void) => {
        if (!isAuthenticated) {
            navigate("/login?redirect=/community");
            return;
        }
        action();
    };

    // Toggle Like
    const handleLike = (postId: string) => {
        requireAuthAction(async () => {
            try {
                const res = await axios.post(`/api/posts/${postId}/like`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setPosts((prev) =>
                        prev.map((p) => {
                            if (p.id === postId) {
                                return {
                                    ...p,
                                    isLiked: res.data.isLiked,
                                    likesCount: res.data.isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
                                };
                            }
                            return p;
                        })
                    );
                }
            } catch (err: any) {
                console.error(err);
            }
        });
    };

    // Toggle Save
    const handleSave = (postId: string) => {
        requireAuthAction(async () => {
            try {
                const res = await axios.post(`/api/posts/${postId}/save`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setPosts((prev) =>
                        prev.map((p) => {
                            if (p.id === postId) {
                                return {
                                    ...p,
                                    isSaved: res.data.isSaved,
                                    savesCount: res.data.isSaved ? p.savesCount + 1 : Math.max(0, p.savesCount - 1)
                                };
                            }
                            return p;
                        })
                    );
                    showToast(res.data.isSaved ? "Saved post to reading list" : "Removed post from saved");
                }
            } catch (err: any) {
                console.error(err);
            }
        });
    };

    // Toggle Follow Author
    const handleFollow = (authorId: string) => {
        requireAuthAction(async () => {
            try {
                const res = await axios.post(`/api/users/${authorId}/follow`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    showToast(res.data.isFollowing ? "Followed author!" : "Unfollowed author");
                    fetchFeed();
                }
            } catch (err: any) {
                showToast(err?.response?.data?.message || "Follow failed");
            }
        });
    };

    // Open Comment Modal
    const handleOpenComments = async (postId: string) => {
        setActiveCommentPostId(postId);
        setComments([]);
        try {
            const res = await axios.get(`/api/posts/${postId}/comments`);
            if (res.data.success) {
                setComments(res.data.comments);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Submit Comment
    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeCommentPostId || !commentText.trim()) return;

        requireAuthAction(async () => {
            setIsSubmittingComment(true);
            try {
                const res = await axios.post(
                    `/api/posts/${activeCommentPostId}/comments`,
                    { text: commentText },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data.success) {
                    setComments((prev) => [...prev, res.data.comment]);
                    setCommentText("");
                    setPosts((prev) =>
                        prev.map((p) => (p.id === activeCommentPostId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
                    );
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsSubmittingComment(false);
            }
        });
    };

    // Share link
    const handleShare = (postId: string) => {
        const url = `${window.location.origin}/posts/${postId}`;
        navigator.clipboard.writeText(url);
        showToast("Post link copied to clipboard!");
    };

    const filteredPosts = posts.filter(
        (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.bookTitle && p.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-900 flex flex-col">
            <Navbar />

            {/* Toast Notification */}
            {toastMsg && (
                <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-stone-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-fade-in">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{toastMsg}</span>
                </div>
            )}

            <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Feed Section (2 Cols) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#f5f0e8] border border-[#e2d9cd] shadow-sm">
                        <div>
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                                <Sparkles className="w-3.5 h-3.5 fill-amber-700 text-amber-800" />
                                Readers' Substack & Community
                            </span>
                            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                                Read Ideas. Share Lessons.
                            </h1>
                            <p className="text-xs text-stone-600 font-medium mt-1">
                                Discover personal growth insights, book reviews, and life lessons shared by fellow readers.
                            </p>
                        </div>

                        <Link
                            to="/write"
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white text-xs font-extrabold shadow-md hover:scale-105 transition-all shrink-0"
                        >
                            <PenTool className="w-4 h-4" />
                            <span>Share Your Thoughts</span>
                        </Link>
                    </div>

                    {/* Feed Tabs & Search Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2d9cd] pb-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab("for-you")}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    activeTab === "for-you"
                                        ? "bg-amber-800 text-white shadow-sm"
                                        : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                                }`}
                            >
                                <Compass className="w-3.5 h-3.5" />
                                For You
                            </button>

                            <button
                                onClick={() => setActiveTab("following")}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    activeTab === "following"
                                        ? "bg-amber-800 text-white shadow-sm"
                                        : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                                }`}
                            >
                                <Users className="w-3.5 h-3.5" />
                                Following
                            </button>

                            <button
                                onClick={() => setActiveTab("trending")}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    activeTab === "trending"
                                        ? "bg-amber-800 text-white shadow-sm"
                                        : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                                }`}
                            >
                                <TrendingUp className="w-3.5 h-3.5" />
                                Trending
                            </button>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Search community posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-60 pl-9 pr-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-700 shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Posts List Feed */}
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-6 rounded-3xl bg-white border border-stone-200 animate-pulse h-48" />
                            ))}
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="py-16 text-center rounded-3xl bg-white border border-stone-200">
                            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                            <p className="font-serif text-lg font-bold text-stone-700">No community posts found</p>
                            <p className="text-xs text-stone-500 mt-1">
                                {activeTab === "following"
                                    ? "You aren't following anyone yet or they haven't posted."
                                    : "Be the first to publish a post about your favorite book!"}
                            </p>
                            <Link
                                to="/write"
                                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold shadow-md"
                            >
                                Write Post
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="p-6 rounded-3xl bg-white border border-[#e7dfd5] hover:border-amber-600/40 transition-all shadow-sm space-y-4 group"
                                >
                                    {/* Author & Book Connection Header */}
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <Link to={`/profile/${post.userId}`}>
                                                <img
                                                    src={
                                                        post.authorAvatar ||
                                                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                                                    }
                                                    alt={post.authorName}
                                                    className="w-10 h-10 rounded-full object-cover border border-amber-700/50 hover:scale-105 transition-transform"
                                                />
                                            </Link>
                                            <div>
                                                <Link
                                                    to={`/profile/${post.userId}`}
                                                    className="text-sm font-bold text-stone-900 hover:text-amber-800 transition-colors block leading-tight"
                                                >
                                                    {post.authorName}
                                                </Link>
                                                <span className="text-[11px] text-stone-400 font-medium">
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Author Follow Button (If not self) */}
                                        {user?.id !== post.userId && (
                                            <button
                                                onClick={() => handleFollow(post.userId)}
                                                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 text-xs font-bold transition-all"
                                            >
                                                + Follow
                                            </button>
                                        )}
                                    </div>

                                    {/* Book Badge Connection */}
                                    {post.bookTitle && (
                                        <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-[#f5f0e8] border border-[#e2d9cd] text-xs font-semibold text-stone-800">
                                            {post.bookCover && (
                                                <img
                                                    src={post.bookCover}
                                                    alt={post.bookTitle}
                                                    className="w-6 h-8 object-cover rounded border border-stone-300"
                                                />
                                            )}
                                            <span>
                                                Reflection on <span className="font-bold text-amber-900">"{post.bookTitle}"</span>
                                            </span>
                                        </div>
                                    )}

                                    {/* Post Title & Content Preview */}
                                    <div className="space-y-2">
                                        <Link to={`/posts/${post.id}`}>
                                            <h2 className="font-serif text-xl font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                                                {post.title}
                                            </h2>
                                        </Link>

                                        <p className="text-sm text-stone-700 leading-relaxed line-clamp-3">
                                            {post.content.replace(/[#*`>]/g, "")}
                                        </p>
                                    </div>

                                    {/* Favorite Idea Highlight */}
                                    {post.favoriteIdea && (
                                        <div className="p-3.5 rounded-2xl bg-amber-50 border-l-4 border-amber-700 text-stone-800 text-xs italic font-medium">
                                            <span className="font-bold text-amber-900 not-italic block mb-0.5 uppercase tracking-wider text-[10px]">
                                                Key Takeaway Idea:
                                            </span>
                                            "{post.favoriteIdea}"
                                        </div>
                                    )}

                                    {/* Tags */}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                            {post.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-stone-100 text-stone-600 border border-stone-200"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Footer Action Controls */}
                                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-semibold">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleLike(post.id)}
                                                className={`flex items-center gap-1.5 transition-colors ${
                                                    post.isLiked ? "text-rose-600 font-bold" : "hover:text-rose-600"
                                                }`}
                                            >
                                                <Heart className={`w-4 h-4 ${post.isLiked ? "fill-rose-600" : ""}`} />
                                                <span>{post.likesCount}</span>
                                            </button>

                                            <button
                                                onClick={() => handleOpenComments(post.id)}
                                                className="flex items-center gap-1.5 hover:text-amber-800 transition-colors"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                <span>{post.commentsCount}</span>
                                            </button>

                                            <button
                                                onClick={() => handleSave(post.id)}
                                                className={`flex items-center gap-1.5 transition-colors ${
                                                    post.isSaved ? "text-amber-800 font-bold" : "hover:text-amber-800"
                                                }`}
                                            >
                                                <Bookmark className={`w-4 h-4 ${post.isSaved ? "fill-amber-800" : ""}`} />
                                                <span>{post.savesCount}</span>
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleShare(post.id)}
                                            className="flex items-center gap-1.5 hover:text-stone-900 transition-colors"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Sidebar Widgets */}
                <aside className="space-y-6">
                    {/* Community Overview Box */}
                    <div className="p-6 rounded-3xl bg-white border border-[#e7dfd5] shadow-sm space-y-3">
                        <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                            <BookOpen className="w-4.5 h-4.5 text-amber-800" />
                            About InspireBooks Community
                        </h3>
                        <p className="text-xs text-stone-600 leading-relaxed font-medium">
                            A social publishing space for thinkers, readers, and builders. Share deep ideas from non-fiction books and learn from each other's reflections.
                        </p>
                        <Link
                            to="/write"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-200 transition-colors"
                        >
                            <PenTool className="w-4 h-4" />
                            Publish an Article
                        </Link>
                    </div>

                    {/* Popular Tags */}
                    <div className="p-6 rounded-3xl bg-white border border-[#e7dfd5] shadow-sm space-y-3">
                        <h3 className="font-serif text-base font-bold text-stone-900">Popular Topics</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {["habits", "productivity", "selfimprovement", "stoicism", "leadership", "mindset", "finance", "psychology"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setSearchQuery(t)}
                                    className="px-3 py-1 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 text-xs font-bold border border-stone-200 transition-colors"
                                >
                                    #{t}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>
            </main>

            {/* Comment Drawer / Modal */}
            {activeCommentPostId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-lg bg-white border border-[#e2d9cd] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="px-6 py-4 bg-[#f5f0e8] border-b border-[#e2d9cd] flex items-center justify-between">
                            <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-amber-800" />
                                Reader Comments
                            </h3>
                            <button
                                onClick={() => setActiveCommentPostId(null)}
                                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Comment List */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                            {comments.length === 0 ? (
                                <p className="text-xs text-stone-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
                            ) : (
                                comments.map((cmt) => (
                                    <div key={cmt.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-stone-900">{cmt.authorName}</span>
                                            <span className="text-[10px] text-stone-400">{new Date(cmt.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-stone-700 leading-relaxed">{cmt.text}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add Comment Input */}
                        <form onSubmit={handleAddComment} className="p-4 bg-[#f5f0e8] border-t border-[#e2d9cd] flex gap-2">
                            <input
                                type="text"
                                placeholder={isAuthenticated ? "Write a thoughtful comment..." : "Log in to join discussion..."}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                disabled={!isAuthenticated}
                                className="flex-1 px-4 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                            />
                            <button
                                type="submit"
                                disabled={!isAuthenticated || isSubmittingComment || !commentText.trim()}
                                className="px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold disabled:opacity-50"
                            >
                                Post
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
