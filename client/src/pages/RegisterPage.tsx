import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { BookOpen, UserPlus, AlertCircle, ArrowRight } from "lucide-react";
import axios from "axios";

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    const redirectUrl = searchParams.get("redirect") || "/community";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError("Name, email, and password are required.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await axios.post("/api/auth/register", {
                name,
                email,
                password,
                bio,
                favoriteCategories: ["Self Improvement", "Productivity"]
            });

            if (res.data.success) {
                login(res.data.token, res.data.user);
                navigate(redirectUrl);
            } else {
                setError(res.data.message || "Registration failed");
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || "Connection error. Please try again.");
        } finally {
            setIsLoading(false);
        }
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
                        <h1 className="font-serif text-2xl font-extrabold text-stone-900">Join InspireBooks</h1>
                        <p className="text-xs text-stone-500 font-medium">
                            Create your reader account to publish stories, reflect on books, and connect with thinkers.
                        </p>
                    </div>

                    {/* Error Box */}
                    {error && (
                        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700">Full Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Jeevana Reader"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700">Password</label>
                            <input
                                type="password"
                                placeholder="At least 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700">Short Bio (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Reader, thinker, enthusiast of philosophy & habits..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white font-extrabold text-xs shadow-md hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>{isLoading ? "Creating Account..." : "Create Reader Account"}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Link to Login */}
                    <div className="text-center pt-2 border-t border-stone-200">
                        <p className="text-xs text-stone-500 font-medium">
                            Already have an account?{" "}
                            <Link to={`/login?redirect=${encodeURIComponent(redirectUrl)}`} className="text-amber-900 font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};
