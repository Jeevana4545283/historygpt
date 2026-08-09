import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware";

const JWT_SECRET = process.env.JWT_SECRET || "inspirebooks-super-secret-jwt-key-2026";

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, avatar, bio, favoriteCategories = [] } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email, and password are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }

        // Check if user already exists
        const existingUser = await query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const role = email.toLowerCase().includes("admin") ? "ADMIN" : "USER";

        await query(
            `INSERT INTO users (id, name, email, password_hash, avatar, bio, favorite_categories, role)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                userId,
                name.trim(),
                email.toLowerCase().trim(),
                passwordHash,
                avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                bio || "Passionate reader & lifelong learner.",
                favoriteCategories,
                role
            ]
        );

        const token = jwt.sign({ id: userId, name, email: email.toLowerCase(), role }, JWT_SECRET, { expiresIn: "30d" });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: { id: userId, name, email: email.toLowerCase(), avatar, bio, role, favoriteCategories }
        });
    } catch (error: any) {
        console.error("register Error:", error.message);
        res.status(500).json({ success: false, message: "Registration failed" });
    }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const result = await query("SELECT * FROM users WHERE email = $1", [email.toLowerCase().trim()]);
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const userRow = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, userRow.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: userRow.id, name: userRow.name, email: userRow.email, role: userRow.role },
            JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: userRow.id,
                name: userRow.name,
                email: userRow.email,
                avatar: userRow.avatar,
                bio: userRow.bio,
                favoriteCategories: userRow.favorite_categories || [],
                role: userRow.role
            }
        });
    } catch (error: any) {
        console.error("login Error:", error.message);
        res.status(500).json({ success: false, message: "Login failed" });
    }
};

// POST /api/auth/guest
export const guestLogin = async (req: Request, res: Response) => {
    try {
        const email = "reader.guest@inspirebooks.com";
        const result = await query("SELECT * FROM users WHERE email = $1", [email]);

        let userRow;
        if (result.rows.length === 0) {
            const userId = `usr-guest-${Date.now()}`;
            const passwordHash = await bcrypt.hash("guest123", 10);
            await query(
                `INSERT INTO users (id, name, email, password_hash, avatar, bio, favorite_categories, role)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    userId,
                    "Guest Reader",
                    email,
                    passwordHash,
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
                    "Guest Reader on InspireBooks.",
                    ["Inspirational", "Self Improvement"],
                    "USER"
                ]
            );
            userRow = {
                id: userId,
                name: "Guest Reader",
                email,
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
                bio: "Guest Reader on InspireBooks.",
                favorite_categories: ["Inspirational"],
                role: "USER"
            };
        } else {
            userRow = result.rows[0];
        }

        const token = jwt.sign(
            { id: userRow.id, name: userRow.name, email: userRow.email, role: userRow.role },
            JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.json({
            success: true,
            message: "Guest session initialized",
            token,
            user: {
                id: userRow.id,
                name: userRow.name,
                email: userRow.email,
                avatar: userRow.avatar,
                bio: userRow.bio,
                favoriteCategories: userRow.favorite_categories || [],
                role: userRow.role
            }
        });
    } catch (error: any) {
        console.error("guestLogin Error:", error.message);
        res.status(500).json({ success: false, message: "Guest login failed" });
    }
};

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthenticated" });
        }

        const result = await query("SELECT id, name, email, avatar, bio, favorite_categories, role FROM users WHERE id = $1", [
            req.user.id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userRow = result.rows[0];

        res.json({
            success: true,
            user: {
                id: userRow.id,
                name: userRow.name,
                email: userRow.email,
                avatar: userRow.avatar,
                bio: userRow.bio,
                favoriteCategories: userRow.favorite_categories || [],
                role: userRow.role
            }
        });
    } catch (error: any) {
        console.error("getMe Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch user session" });
    }
};
