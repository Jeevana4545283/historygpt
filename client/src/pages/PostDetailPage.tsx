import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import type { Post, Comment } from "../types";
import {
    ArrowLeft,
    Heart,
    Bookmark,
    Share2,
    MessageSquare,
    BookOpen,
    Trash2,
    Edit3,
    Sparkles,
    Check,
    Send
} from "lucide-react";
import axios from "axios";

export const PostDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, token, isAuthenticated } = useAuth();

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 3000);
    };

    const fetchPostAndComments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
            const res = await axios.get(`/api/posts/${id}`, config);
            if (res.data.success) {
                setPost(res.data.post);
            }

            const cmtRes = await axios.get(`/api/posts/${id}/comments`);
            if (cmtRes.data.success) {
                setComments(cmtRes.data.comments);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to load post.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPostAndComments();
    }, [id, token]);

    const requireAuth = (action: () => void) => {
        if (!isAuthenticated) {
            navigate(`/login?redirect=/posts/${id}`);
            return;
        }
        action();
    };

    const handleLike = () => {
        requireAuth(async () => {
            if (!post) return;
            try {
                const res = await axios.post(`/api/posts/${post.id}/like`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setPost((prev) =>
                        prev
                            ? {
                                  ...prev,
                                  isLiked: res.data.isLiked,
                                  likesCount: res.data.isLiked ? prev.likesCount + 1 : Math.max(0, prev.likesCount - 1)
                              }
                            : null
                    );
                }
            } catch (err) {
                console.error(err);
            }
        });
    };

    const handleSave = () => {
        requireAuth(async () => {
            if (!post) return;
            try {
                const res = await axios.post(`/api/posts/${post.id}/save`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setPost((prev) =>
                        prev
                            ? {
                                  ...prev,
                                  isSaved: res.data.isSaved,
                                  savesCount: res.data.isSaved ? prev.savesCount + 1 : Math.max(0, prev.savesCount - 1)
                              }
                            : null
                    );
                    showToast(res.data.isSaved ? "Saved post to your reading list" : "Removed from saved posts");
                }
            } catch (err) {
                console.error(err);
            }
        });
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        requireAuth(async () => {
            try {
                const res = await axios.post(
                    `/api/posts/${id}/comments`,
                    { text: commentText },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data.success) {
                    setComments((prev) => [...prev, res.data.comment]);
                    setCommentText("");
                    if (post) setPost({ ...post, commentsCount: post.commentsCount + 1 });
                }
            } catch (err) {
                console.error(err);
            }
        });
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            const res = await axios.delete(`/api/users/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setComments((prev) => prev.filter((c) => c.id !== commentId));
                if (post) setPost({ ...post, commentsCount: Math.max(0, post.commentsCount - 1) });
                showToast("Comment deleted");
            }
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Failed to delete comment");
        }
    };

    const handleDeletePost = async () => {
        if (!post || !window.confirm("Are you sure you want to delete this post?")) return;
        try {
            const res = await axios.delete(`/api/posts/${post.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                navigate("/community");
            }
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Delete failed");
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        showToast("Article link copied to clipboard!");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#faf7f2] flex flex-col">
                <Navbar />
                <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-16 text-center text-stone-500">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-stone-200 rounded-xl w-3/4 mx-auto" />
                        <div className="h-64 bg-stone-200 rounded-3xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-[#faf7f2] flex flex-col">
                <Navbar />
                <div className="flex-1 max-w-md w-full mx-auto px-4 py-16 text-center space-y-4">
                    <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
                    <h2 className="font-serif text-xl font-bold text-stone-800">Article Not Found</h2>
                    <p className="text-xs text-stone-500">{error || "The post you are looking for does not exist."}</p>
                    <Link to="/community" className="inline-block px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold">
                        Back to Community
                    </Link>
                </div>
            </div>
        );
    }

    const isAuthor = user?.id === post.userId || user?.role === "ADMIN";

    return (
        <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-900 flex flex-col">
            <Navbar />

            {toastMsg && (
                <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-stone-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-fade-in">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{toastMsg}</span>
                </div>
            )}

            <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-8">
                {/* Back Button & Author Actions */}
                <div className="flex items-center justify-between border-b border-[#e2d9cd] pb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-stone-600 hover:text-amber-900 text-xs font-bold transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>

                    {isAuthor && (
                        <div className="flex items-center gap-2">
                            <Link
                                to={`/write?edit=${post.id}`}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                Edit
                            </Link>

                            <button
                                onClick={handleDeletePost}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* Article Header */}
                <article className="bg-white border border-[#e7dfd5] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
                    {/* Author Meta */}
                    <div className="flex items-center justify-between gap-4 border-b border-stone-100 pb-4">
                        <div className="flex items-center gap-3">
                            <Link to={`/profile/${post.userId}`}>
                                <img
                                    src={
                                        post.authorAvatar ||
                                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                                    }
                                    alt={post.authorName}
                                    className="w-11 h-11 rounded-full object-cover border border-amber-700/50"
                                />
                            </Link>
                            <div>
                                <Link to={`/profile/${post.userId}`} className="font-bold text-stone-900 hover:text-amber-800 text-sm block">
                                    {post.authorName}
                                </Link>
                                <p className="text-xs text-stone-400">
                                    Published on {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Book Connection Badge */}
                    {post.bookTitle && (
                        <div className="p-3.5 rounded-2xl bg-[#f5f0e8] border border-[#e2d9cd] flex items-center gap-3">
                            {post.bookCover && (
                                <img src={post.bookCover} alt={post.bookTitle} className="w-8 h-11 object-cover rounded border border-stone-300" />
                            )}
                            <div>
                                <span className="text-[10px] uppercase font-bold text-amber-900 block">Book Essay & Review</span>
                                <p className="font-serif text-xs font-bold text-stone-900">"{post.bookTitle}" by {post.bookAuthor}</p>
                            </div>
                        </div>
                    )}

                    {/* Optional Cover Image */}
                    {post.coverImage && (
                        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-inner border border-stone-200">
                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Post Title */}
                    <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-stone-900 leading-tight">
                        {post.title}
                    </h1>

                    {/* Favorite Idea Highlight */}
                    {post.favoriteIdea && (
                        <div className="p-5 rounded-2xl bg-amber-50 border-l-4 border-amber-700 space-y-1">
                            <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 fill-amber-700 text-amber-800" />
                                Favorite Core Idea
                            </span>
                            <blockquote className="text-sm font-serif italic text-stone-800 leading-relaxed">
                                "{post.favoriteIdea}"
                            </blockquote>
                        </div>
                    )}

                    {/* Main Content Body */}
                    <div className="text-base text-stone-800 leading-relaxed space-y-4 font-normal whitespace-pre-wrap pt-2">
                        {post.content}
                    </div>

                    {/* Article Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-stone-100">
                            {post.tags.map((t) => (
                                <span key={t} className="px-3 py-1 text-xs font-semibold rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                                    #{t}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Action Toolbar */}
                    <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                                    post.isLiked ? "text-rose-600" : "text-stone-600 hover:text-rose-600"
                                }`}
                            >
                                <Heart className={`w-5 h-5 ${post.isLiked ? "fill-rose-600" : ""}`} />
                                <span>{post.likesCount} Likes</span>
                            </button>

                            <button
                                onClick={handleSave}
                                className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                                    post.isSaved ? "text-amber-800" : "text-stone-600 hover:text-amber-800"
                                }`}
                            >
                                <Bookmark className={`w-5 h-5 ${post.isSaved ? "fill-amber-800" : ""}`} />
                                <span>{post.savesCount} Saves</span>
                            </button>
                        </div>

                        <button onClick={handleShare} className="flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-stone-900">
                            <Share2 className="w-5 h-5" />
                            <span>Share</span>
                        </button>
                    </div>
                </article>

                {/* Comment Section */}
                <section className="bg-white border border-[#e7dfd5] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-amber-800" />
                        Reader Discussion ({comments.length})
                    </h3>

                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} className="space-y-3">
                        <textarea
                            rows={3}
                            placeholder={isAuthenticated ? "Write a respectful, insightful comment..." : "Log in to join the conversation..."}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={!isAuthenticated}
                            className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-700"
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={!isAuthenticated || !commentText.trim()}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold disabled:opacity-50 shadow-sm"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>Post Comment</span>
                            </button>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4 pt-2">
                        {comments.length === 0 ? (
                            <p className="text-xs text-stone-400 text-center py-4">No comments yet. Start the conversation!</p>
                        ) : (
                            comments.map((c) => (
                                <div key={c.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-stone-900">{c.authorName}</span>
                                            <span className="text-[10px] text-stone-400">• {new Date(c.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        {(user?.id === c.userId || user?.role === "ADMIN") && (
                                            <button
                                                onClick={() => handleDeleteComment(c.id)}
                                                className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                                                title="Delete Comment"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-stone-700 leading-relaxed font-medium">{c.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};
