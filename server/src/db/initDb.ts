import fs from "fs";
import path from "path";
import { pool, query } from "../config/db";

export const initializePostgresDatabase = async (): Promise<boolean> => {
    try {
        console.log("⚡ Connecting to PostgreSQL database...");
        const schemaPath = path.join(__dirname, "schema.sql");
        const sqlSchema = fs.readFileSync(schemaPath, "utf-8");

        // Execute DDL Schema Script
        await query(sqlSchema);
        console.log("✓ PostgreSQL Database Schema & Indexes Verified/Created!");

        // Seed initial admin user if not exists
        const adminCheck = await query("SELECT * FROM users WHERE email = $1", ["admin@inspirebooks.com"]);
        if (adminCheck.rows.length === 0) {
            // Seed Admin User (Password: admin123)
            const bcrypt = require("bcryptjs");
            const hash = await bcrypt.hash("admin123", 10);
            await query(
                `INSERT INTO users (id, name, email, password_hash, avatar, bio, favorite_categories, role)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    "user-admin",
                    "InspireBooks Admin",
                    "admin@inspirebooks.com",
                    hash,
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                    "Official Admin & Curator of InspireBooks Platform.",
                    ["Self Improvement", "Productivity", "Mindset"],
                    "ADMIN"
                ]
            );
            console.log("✓ Seeded Admin User (admin@inspirebooks.com)");
        }

        return true;
    } catch (err: any) {
        console.warn("⚠️ PostgreSQL Connection Warning:", err.message);
        console.warn("Ensure POSTGRES_URL or local PostgreSQL service is running on 5432.");
        return false;
    }
};
