import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import type { User, Post } from "../types";
import {
    User as UserIcon,
    BookOpen,
    Bookmark,
    Edit3,
    Heart,
    MessageSquare,
    X,
    FileText
} from "lucide-react";
import axios from "axios";

export const ProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user: currentUser, token, logout } = useAuth();

    const targetUserId = id || currentUser?.id;
    const isOwnProfile = currentUser?.id === targetUserId;

    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    const [activeTab, setActiveTab] = useState<"posts" | "saved" | "about">("posts");

    const [isLoading, setIsLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    // Edit Profile Modal state
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editBio, setEditBio] = useState("");
    const [editAvatar, setEditAvatar] = useState("");

    const fetchProfileData = async () => {
        if (!targetUserId) return;
        setIsLoading(true);
        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;

            // Fetch User Profile
            const userRes = await axios.get(`/api/users/${targetUserId}/profile`, config);
            if (userRes.data.success) {
                setProfileUser(userRes.data.user);
                setIsFollowing(userRes.data.user.isFollowing || false);
                setEditName(userRes.data.user.name);
                setEditBio(userRes.data.user.bio || "");
                setEditAvatar(userRes.data.user.avatar || "");
            }

            // Fetch User Created Posts
            const postsRes = await axios.get(`/api/users/${targetUserId}/posts`, config);
            if (postsRes.data.success) {
                setPosts(postsRes.data.posts);
            }

            // Fetch Saved Posts (If owner)
            if (isOwnProfile && token) {
                const savedRes = await axios.get(`/api/users/${targetUserId}/saved-posts`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (savedRes.data.success) {
                    setSavedPosts(savedRes.data.posts);
                }
            }
        } catch (err) {
            console.error("fetchProfileData Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [targetUserId, token]);

    const handleFollowToggle = async () => {
        if (!token || !targetUserId) return;
        try {
            const res = await axios.post(
                `/api/users/${targetUserId}/follow`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setIsFollowing(res.data.isFollowing);
                setProfileUser((prev) =>
                    prev
                        ? {
                              ...prev,
                              followersCount: res.data.isFollowing
                                  ? (prev.followersCount || 0) + 1
                                  : Math.max(0, (prev.followersCount || 0) - 1)
                          }
                        : null
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        try {
            const res = await axios.put(
                "/api/users/profile",
                { name: editName, bio: editBio, avatar: editAvatar },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setIsEditOpen(false);
                fetchProfileData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading || !profileUser) {
        return (
            <div className="min-h-screen bg-[#faf7f2] flex flex-col">
                <Navbar />
                <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 text-center text-stone-500">
                    <div className="animate-pulse space-y-4">
                        <div className="w-24 h-24 bg-stone-200 rounded-full mx-auto" />
                        <div className="h-6 bg-stone-200 rounded-xl w-1/3 mx-auto" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-900 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
                {/* Profile Header Hero */}
                <section className="bg-white border border-[#e7dfd5] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <img
                                src={
                                    profileUser.avatar ||
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                                }
                                alt={profileUser.name}
                                className="w-20 h-20 rounded-full object-cover border-2 border-amber-700 shadow-md shrink-0"
                            />
                            <div>
                                <h1 className="font-serif text-2xl font-bold text-stone-900">{profileUser.name}</h1>
                                <p className="text-xs text-stone-500 font-medium">{profileUser.email}</p>
                                <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] uppercase font-bold rounded bg-amber-100 text-amber-900 border border-amber-300">
                                    {profileUser.role} READER
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            {isOwnProfile ? (
                                <>
                                    <button
                                        onClick={() => setIsEditOpen(true)}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 shadow-sm"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Edit Profile</span>
                                    </button>
                                    <button
                                        onClick={logout}
                                        className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100"
                                    >
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleFollowToggle}
                                    className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                                        isFollowing
                                            ? "bg-stone-200 text-stone-800 border border-stone-300"
                                            : "bg-amber-800 text-white hover:scale-105"
                                    }`}
                                >
                                    {isFollowing ? "Following ✓" : "+ Follow Reader"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    {profileUser.bio && (
                        <p className="text-sm text-stone-700 leading-relaxed font-medium pt-2 border-t border-stone-100">
                            {profileUser.bio}
                        </p>
                    )}

                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-200 text-center">
                        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                            <p className="text-lg font-extrabold text-amber-900">{profileUser.publishedPostsCount || posts.length}</p>
                            <p className="text-[11px] font-bold text-stone-500">Published Posts</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                            <p className="text-lg font-extrabold text-amber-900">{profileUser.followersCount || 0}</p>
                            <p className="text-[11px] font-bold text-stone-500">Followers</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                            <p className="text-lg font-extrabold text-amber-900">{profileUser.followingCount || 0}</p>
                            <p className="text-[11px] font-bold text-stone-500">Following</p>
                        </div>
                    </div>
                </section>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-[#e2d9cd] pb-3">
                    <button
                        onClick={() => setActiveTab("posts")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeTab === "posts"
                                ? "bg-amber-800 text-white shadow-sm"
                                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                        }`}
                    >
                        <FileText className="w-4 h-4" />
                        <span>Posts ({posts.length})</span>
                    </button>

                    {isOwnProfile && (
                        <button
                            onClick={() => setActiveTab("saved")}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                activeTab === "saved"
                                    ? "bg-amber-800 text-white shadow-sm"
                                    : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                            }`}
                        >
                            <Bookmark className="w-4 h-4" />
                            <span>Saved Reading List ({savedPosts.length})</span>
                        </button>
                    )}

                    <button
                        onClick={() => setActiveTab("about")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeTab === "about"
                                ? "bg-amber-800 text-white shadow-sm"
                                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                        }`}
                    >
                        <UserIcon className="w-4 h-4" />
                        <span>About</span>
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "posts" && (
                    <div className="space-y-4">
                        {posts.length === 0 ? (
                            <div className="py-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500">
                                <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                                <p className="font-serif font-bold text-stone-700">No posts published yet</p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="p-5 rounded-2xl bg-white border border-[#e7dfd5] hover:border-amber-600/40 transition-all shadow-sm space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                                            {post.bookTitle ? `On "${post.bookTitle}"` : "General Essay"}
                                        </span>
                                        {post.status === "draft" && (
                                            <span className="text-[10px] font-bold uppercase bg-stone-200 text-stone-700 px-2 py-0.5 rounded">
                                                Draft
                                            </span>
                                        )}
                                    </div>

                                    <Link to={`/posts/${post.id}`}>
                                        <h3 className="font-serif text-lg font-bold text-stone-900 hover:text-amber-800 transition-colors">
                                            {post.title}
                                        </h3>
                                    </Link>

                                    <p className="text-xs text-stone-600 line-clamp-2">{post.content.replace(/[#*`>]/g, "")}</p>

                                    <div className="flex items-center gap-4 text-xs text-stone-400 font-semibold pt-2 border-t border-stone-100">
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-3.5 h-3.5 text-rose-600" />
                                            {post.likesCount}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageSquare className="w-3.5 h-3.5 text-amber-800" />
                                            {post.commentsCount}
                                        </span>
                                        <span className="ml-auto text-[10px]">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "saved" && isOwnProfile && (
                    <div className="space-y-4">
                        {savedPosts.length === 0 ? (
                            <div className="py-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500">
                                <Bookmark className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                                <p className="font-serif font-bold text-stone-700">No saved posts</p>
                            </div>
                        ) : (
                            savedPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="p-5 rounded-2xl bg-white border border-[#e7dfd5] shadow-sm space-y-2"
                                >
                                    <p className="text-xs text-stone-500 font-semibold">Saved Article by {post.authorName}</p>
                                    <Link to={`/posts/${post.id}`}>
                                        <h3 className="font-serif text-base font-bold text-stone-900 hover:text-amber-800">
                                            {post.title}
                                        </h3>
                                    </Link>
                                </article>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "about" && (
                    <div className="p-6 rounded-3xl bg-white border border-[#e7dfd5] space-y-4 text-xs text-stone-700">
                        <h3 className="font-serif text-base font-bold text-stone-900">Favorite Topics</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {(profileUser.favoriteCategories || ["Self Improvement", "Productivity", "Mindset"]).map((c) => (
                                <span key={c} className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-bold">
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Edit Profile Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
                    <form
                        onSubmit={handleUpdateProfile}
                        className="w-full max-w-md bg-white border border-[#e2d9cd] rounded-3xl p-6 shadow-2xl space-y-4"
                    >
                        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                            <h3 className="font-serif text-lg font-bold text-stone-900">Edit Profile</h3>
                            <button type="button" onClick={() => setIsEditOpen(false)} className="text-stone-400 hover:text-stone-900">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700">Display Name</label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700">Bio</label>
                            <textarea
                                rows={3}
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700">Avatar Image URL</label>
                            <input
                                type="text"
                                value={editAvatar}
                                onChange={(e) => setEditAvatar(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsEditOpen(false)}
                                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-600"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold">
                                Save Profile
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
