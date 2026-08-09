import { Response } from "express";
import { query } from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware";

// GET /api/users/:id/profile - User Profile
export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user?.id;

        const userResult = await query(
            `SELECT id, name, email, avatar, bio, favorite_categories, role, created_at FROM users WHERE id = $1`,
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User profile not found" });
        }

        const userRow = userResult.rows[0];

        // Followers count
        const followersRes = await query("SELECT COUNT(*) FROM follows WHERE following_id = $1", [id]);
        const followersCount = parseInt(followersRes.rows[0].count, 10);

        // Following count
        const followingRes = await query("SELECT COUNT(*) FROM follows WHERE follower_id = $1", [id]);
        const followingCount = parseInt(followingRes.rows[0].count, 10);

        // Published posts count
        const postsRes = await query("SELECT COUNT(*) FROM posts WHERE user_id = $1 AND status = 'published'", [id]);
        const publishedPostsCount = parseInt(postsRes.rows[0].count, 10);

        // Is current user following this profile?
        let isFollowing = false;
        if (currentUserId && currentUserId !== id) {
            const followCheck = await query("SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2", [
                currentUserId,
                id
            ]);
            isFollowing = followCheck.rows.length > 0;
        }

        res.json({
            success: true,
            user: {
                id: userRow.id,
                name: userRow.name,
                email: userRow.email,
                avatar: userRow.avatar,
                bio: userRow.bio,
                favoriteCategories: userRow.favorite_categories || [],
                role: userRow.role,
                createdAt: userRow.created_at,
                followersCount,
                followingCount,
                publishedPostsCount,
                isFollowing
            }
        });
    } catch (error: any) {
        console.error("getUserProfile Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch user profile" });
    }
};

// POST /api/users/:id/follow - Toggle follow user
export const toggleFollowUser = async (req: AuthRequest, res: Response) => {
    try {
        const followerId = req.user?.id;
        if (!followerId) {
            return res.status(401).json({ success: false, message: "Authentication required to follow users" });
        }

        const { id: followingId } = req.params;

        if (followerId === followingId) {
            return res.status(400).json({ success: false, message: "You cannot follow yourself" });
        }

        const targetUserCheck = await query("SELECT id FROM users WHERE id = $1", [followingId]);
        if (targetUserCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User to follow not found" });
        }

        const check = await query("SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2", [
            followerId,
            followingId
        ]);

        if (check.rows.length > 0) {
            // Unfollow
            await query("DELETE FROM follows WHERE follower_id = $1 AND following_id = $2", [followerId, followingId]);
            return res.json({ success: true, isFollowing: false, message: "Unfollowed user" });
        } else {
            // Follow
            const followId = `follow-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
            await query("INSERT INTO follows (id, follower_id, following_id) VALUES ($1, $2, $3)", [
                followId,
                followerId,
                followingId
            ]);
            return res.json({ success: true, isFollowing: true, message: "Followed user" });
        }
    } catch (error: any) {
        console.error("toggleFollowUser Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to toggle follow status" });
    }
};

// GET /api/users/:id/posts - User's created posts
export const getUserPosts = async (req: AuthRequest, res: Response) => {
    try {
        const { id: targetUserId } = req.params;
        const currentUserId = req.user?.id;

        // Show drafts ONLY if current user is viewing their own profile
        const statusFilter = currentUserId === targetUserId ? "" : "AND p.status = 'published'";

        const sql = `
            SELECT 
                p.*,
                u.name as author_name,
                u.avatar as author_avatar,
                b.title as book_title,
                b.cover_image as book_cover,
                b.author as book_author
                ${
                    currentUserId
                        ? `, 
                    EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = '${currentUserId}') as is_liked,
                    EXISTS(SELECT 1 FROM saved_posts sp WHERE sp.post_id = p.id AND sp.user_id = '${currentUserId}') as is_saved`
                        : `, false as is_liked, false as is_saved`
                }
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN books b ON p.book_id = b.id
            WHERE p.user_id = $1 ${statusFilter}
            ORDER BY p.created_at DESC
        `;

        const result = await query(sql, [targetUserId]);

        const posts = result.rows.map((row) => ({
            id: row.id,
            userId: row.user_id,
            authorName: row.author_name,
            authorAvatar: row.author_avatar,
            bookId: row.book_id,
            bookTitle: row.book_title,
            bookCover: row.book_cover,
            bookAuthor: row.book_author,
            title: row.title,
            content: row.content,
            favoriteIdea: row.favorite_idea,
            tags: row.tags || [],
            coverImage: row.cover_image,
            status: row.status,
            likesCount: parseInt(row.likes_count || "0", 10),
            commentsCount: parseInt(row.comments_count || "0", 10),
            savesCount: parseInt(row.saves_count || "0", 10),
            createdAt: row.created_at,
            isLiked: row.is_liked === true || row.is_liked === "true",
            isSaved: row.is_saved === true || row.is_saved === "true"
        }));

        res.json({ success: true, posts });
    } catch (error: any) {
        console.error("getUserPosts Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch user posts" });
    }
};

// GET /api/users/:id/saved-posts - User's saved posts (Owner only)
export const getUserSavedPosts = async (req: AuthRequest, res: Response) => {
    try {
        const { id: targetUserId } = req.params;
        const currentUserId = req.user?.id;

        if (currentUserId !== targetUserId && req.user?.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Forbidden: Cannot view saved posts of another user" });
        }

        const sql = `
            SELECT 
                p.*,
                u.name as author_name,
                u.avatar as author_avatar,
                b.title as book_title,
                b.cover_image as book_cover,
                b.author as book_author,
                true as is_saved,
                EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = $1) as is_liked
            FROM saved_posts sp
            JOIN posts p ON sp.post_id = p.id
            JOIN users u ON p.user_id = u.id
            LEFT JOIN books b ON p.book_id = b.id
            WHERE sp.user_id = $1 AND p.status = 'published'
            ORDER BY sp.created_at DESC
        `;

        const result = await query(sql, [targetUserId]);

        const posts = result.rows.map((row) => ({
            id: row.id,
            userId: row.user_id,
            authorName: row.author_name,
            authorAvatar: row.author_avatar,
            bookId: row.book_id,
            bookTitle: row.book_title,
            bookCover: row.book_cover,
            bookAuthor: row.book_author,
            title: row.title,
            content: row.content,
            favoriteIdea: row.favorite_idea,
            tags: row.tags || [],
            coverImage: row.cover_image,
            status: row.status,
            likesCount: parseInt(row.likes_count || "0", 10),
            commentsCount: parseInt(row.comments_count || "0", 10),
            savesCount: parseInt(row.saves_count || "0", 10),
            createdAt: row.created_at,
            isLiked: row.is_liked === true || row.is_liked === "true",
            isSaved: true
        }));

        res.json({ success: true, posts });
    } catch (error: any) {
        console.error("getUserSavedPosts Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch saved posts" });
    }
};

// PUT /api/users/profile - Update own profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const { name, avatar, bio, favoriteCategories } = req.body;

        await query(
            `UPDATE users
             SET name = COALESCE($1, name),
                 avatar = COALESCE($2, avatar),
                 bio = COALESCE($3, bio),
                 favorite_categories = COALESCE($4, favorite_categories)
             WHERE id = $5`,
            [name, avatar, bio, favoriteCategories, userId]
        );

        const updatedResult = await query(
            "SELECT id, name, email, avatar, bio, favorite_categories, role FROM users WHERE id = $1",
            [userId]
        );

        const userRow = updatedResult.rows[0];
        res.json({
            success: true,
            message: "Profile updated successfully",
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
        console.error("updateProfile Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
};
