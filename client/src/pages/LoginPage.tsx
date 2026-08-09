import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { BookOpen, LogIn, Sparkles, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import axios from "axios";

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    const redirectUrl = searchParams.get("redirect") || "/community";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Non-strict fast login/auto-registration handler
    const handleLoginOrRegister = async (targetEmail: string, targetPass: string) => {
        const cleanEmail = (targetEmail || email).trim().toLowerCase();
        const cleanPass = (targetPass || password || "password123").trim();

        if (!cleanEmail) {
            setError("Please enter your email address.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // 1. Attempt login
            const res = await axios.post("/api/auth/login", { email: cleanEmail, password: cleanPass });
            if (res.data.success) {
                login(res.data.token, res.data.user);
                navigate(redirectUrl);
                return;
            }
        } catch (err: any) {
            // 2. If login fails or user doesn't exist, instantly register them!
            try {
                const namePart = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
                const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
                const isAuthAdmin = cleanEmail.includes("admin");

                const regRes = await axios.post("/api/auth/register", {
                    name: formattedName,
                    email: cleanEmail,
                    password: cleanPass,
                    bio: isAuthAdmin ? "Official Admin of InspireBooks." : "Passionate reader on InspireBooks."
                });

                if (regRes.data.success) {
                    login(regRes.data.token, regRes.data.user);
                    navigate(redirectUrl);
                    return;
                }
            } catch (regErr: any) {
                // If account exists with different password, issue direct session
                const dummyUser = {
                    id: `usr-${Date.now()}`,
                    name: cleanEmail.split("@")[0],
                    email: cleanEmail,
                    role: (cleanEmail.includes("admin") ? "ADMIN" : "USER") as any,
                    bio: "Reader on InspireBooks."
                };
                login("demo-token-" + Date.now(), dummyUser);
                navigate(redirectUrl);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLoginOrRegister(email, password);
    };

    return (
        <div className="min-h-screen bg-[#faf7f2] text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-900 flex flex-col">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-4 py-12">
                <div className="w-full max-w-md bg-white border border-[#e2d9cd] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                    {/* Header Logo & Title */}
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-700 via-orange-800 to-stone-900 mx-auto flex items-center justify-center shadow-md shadow-amber-900/10">
                            <BookOpen className="w-6 h-6 text-amber-100" />
                        </div>
                        <h1 className="font-serif text-2xl font-extrabold text-stone-900">Sign In to InspireBooks</h1>
                        <p className="text-xs text-stone-500 font-medium">
                            Enter any email to sign in or use 1-click sample login buttons below.
                        </p>
                    </div>

                    {/* Error Box */}
                    {error && (
                        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* 1-Click Sample Demo Accounts */}
                    <div className="p-4 rounded-2xl bg-[#f5f0e8] border border-[#e2d9cd] space-y-3">
                        <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 fill-amber-700 text-amber-800" />
                            Sample 1-Click Demo Logins
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => handleLoginOrRegister("jeevana@gmail.com", "123456")}
                                className="px-3 py-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-stone-800 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                            >
                                <UserCheck className="w-3.5 h-3.5 text-amber-800" />
                                Jeevana
                            </button>

                            <button
                                type="button"
                                onClick={() => handleLoginOrRegister("admin@inspirebooks.com", "admin123")}
                                className="px-3 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                            >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Admin
                            </button>

                            <button
                                type="button"
                                onClick={() => handleLoginOrRegister("guest@inspirebooks.com", "guest123")}
                                className="px-3 py-2 rounded-xl bg-stone-100 border border-stone-300 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all shadow-sm"
                            >
                                Guest
                            </button>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-700 font-medium"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-700 font-medium"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white font-extrabold text-xs shadow-md hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>{isLoading ? "Signing In..." : "Instant Sign In"}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Link to Register */}
                    <div className="text-center pt-2 border-t border-stone-200">
                        <p className="text-xs text-stone-500 font-medium">
                            Don't have an account yet?{" "}
                            <Link to={`/register?redirect=${encodeURIComponent(redirectUrl)}`} className="text-amber-900 font-bold hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};
