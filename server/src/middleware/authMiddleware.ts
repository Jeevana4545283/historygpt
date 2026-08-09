import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        name: string;
        email: string;
        role: "USER" | "ADMIN";
    };
}

const JWT_SECRET = process.env.JWT_SECRET || "inspirebooks-super-secret-jwt-key-2026";

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. Authentication token required." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid or expired authentication token." });
    }
};

export const optionalAuthenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            req.user = decoded;
        } catch (err) {
            // Ignore invalid token for optional auth
        }
    }
    next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({ success: false, message: "Forbidden: Admin privileges required." });
    }
    next();
};
