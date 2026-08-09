import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Sparkles, Compass, PenTool, Users, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
    readingListCount?: number;
    onOpenReadingList?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();

    return (
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#faf7f2]/90 border-b border-[#e7dfd5] px-4 lg:px-8 py-3.5 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Brand / Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 via-orange-800 to-stone-900 flex items-center justify-center shadow-md shadow-amber-900/10 group-hover:scale-105 transition-transform">
                        <BookOpen className="w-5 h-5 text-amber-100 stroke-[2.5]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-serif text-xl font-bold text-stone-900 tracking-wide">
                                InspireBooks
                            </span>
                            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                Social Reading
                            </span>
                        </div>
                        <p className="text-[11px] text-stone-500 -mt-0.5 tracking-tight">Read. Reflect. Share. Discover.</p>
                    </div>
                </Link>

                {/* Nav Links */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        to="/"
                        className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                            location.pathname === "/" ? "text-amber-900 font-bold underline underline-offset-8 decoration-amber-600 decoration-2" : "text-stone-600 hover:text-stone-900"
                        }`}
                    >
                        <Compass className="w-4 h-4 text-amber-700" />
                        Explore Books
                    </Link>

                    <Link
                        to="/community"
                        className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                            location.pathname === "/community" ? "text-amber-900 font-bold underline underline-offset-8 decoration-amber-600 decoration-2" : "text-stone-600 hover:text-stone-900"
                        }`}
                    >
                        <Users className="w-4 h-4 text-amber-700" />
                        Community
                    </Link>

                    <Link
                        to="/write"
                        className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                            location.pathname === "/write" ? "text-amber-900 font-bold underline underline-offset-8 decoration-amber-600 decoration-2" : "text-stone-600 hover:text-stone-900"
                        }`}
                    >
                        <PenTool className="w-4 h-4 text-amber-700" />
                        Write
                    </Link>

                    <Link
                        to="/chat"
                        className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                            location.pathname === "/chat" ? "text-amber-900 font-bold underline underline-offset-8 decoration-amber-600 decoration-2" : "text-stone-600 hover:text-stone-900"
                        }`}
                    >
                        <Sparkles className="w-4 h-4 text-amber-700" />
                        AI Companion
                    </Link>
                </nav>

                {/* Right User Actions */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/write"
                        className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 text-xs font-bold transition-all"
                    >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>Publish Article</span>
                    </Link>

                    {isAuthenticated && user ? (
                        <Link
                            to={`/profile/${user.id}`}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#e2d9cd] hover:border-amber-700 text-stone-800 text-xs font-bold transition-all shadow-sm"
                        >
                            <img
                                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                                alt={user.name}
                                className="w-6 h-6 rounded-full object-cover border border-amber-700"
                            />
                            <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white text-xs font-bold shadow-md hover:scale-105 transition-all"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Sign In</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};
