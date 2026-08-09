import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types";
import axios from "axios";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("inspirebooks_token"));
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem("inspirebooks_user");
        return saved ? JSON.parse(saved) : null;
    });
    const [isLoading, setIsLoading] = useState(true);

    const initGuestSession = async () => {
        try {
            const res = await axios.post("/api/auth/guest");
            if (res.data.success) {
                setToken(res.data.token);
                setUser(res.data.user);
                localStorage.setItem("inspirebooks_token", res.data.token);
                localStorage.setItem("inspirebooks_user", JSON.stringify(res.data.user));
                setIsLoading(false);
                return;
            }
        } catch (err) {
            console.log("Backend offline, initializing client guest session");
        }

        // Local fallback guest user for standalone Vercel deployment
        const localGuest: User = {
            id: "usr-guest-local",
            name: "Guest Reader",
            email: "guest@inspirebooks.com",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
            bio: "Reader on InspireBooks.",
            role: "USER"
        };
        setToken("local-guest-token");
        setUser(localGuest);
        localStorage.setItem("inspirebooks_token", "local-guest-token");
        localStorage.setItem("inspirebooks_user", JSON.stringify(localGuest));
        setIsLoading(false);
    };

    useEffect(() => {
        if (token && token !== "local-guest-token") {
            axios.get("/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` }
            }).then((res) => {
                if (res.data.success) {
                    setUser(res.data.user);
                    localStorage.setItem("inspirebooks_user", JSON.stringify(res.data.user));
                }
            }).catch(() => {
                // Token invalid: auto initialize guest session
                initGuestSession();
            }).finally(() => {
                setIsLoading(false);
            });
        } else {
            // Auto initialize seamless guest session so writing/publishing requires NO login
            initGuestSession();
        }
    }, [token]);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem("inspirebooks_token", newToken);
        localStorage.setItem("inspirebooks_user", JSON.stringify(newUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("inspirebooks_token");
        localStorage.removeItem("inspirebooks_user");
        initGuestSession();
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem("inspirebooks_user", JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: true, // Always true so user can write & publish freely
                isLoading,
                login,
                logout,
                updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
