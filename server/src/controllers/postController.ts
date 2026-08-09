import { Response } from "express";
import { query } from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware";

// Helper to format post with user & book metadata
const formatPostRow = (row: any) => ({
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
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
    isLiked: row.is_liked === true || row.is_liked === "true",
    isSaved: row.is_saved === true || row.is_saved === "true"
});

// Base SELECT query joining users and books
const buildBasePostQuery = (currentUserId?: string) => `
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
`;

// GET /api/posts - Public published posts with search & pagination
export const getPosts = async (req: AuthRequest, res: Response) => {
    try {
        const page = parseInt((req.query.page as string) || "1", 10);
        const limit = parseInt((req.query.limit as string) || "10", 10);
        const offset = (page - 1) * limit;
        const search = (req.query.search as string) || "";
        const tag = (req.query.tag as string) || "";
        const currentUserId = req.user?.id;

        let whereClause = "WHERE p.status = 'published'";
        const queryParams: any[] = [];

        if (search) {
            queryParams.push(`%${search}%`);
            whereClause += ` AND (p.title ILIKE $${queryParams.length} OR p.content ILIKE $${queryParams.length} OR b.title ILIKE $${queryParams.length})`;
        }

        if (tag) {
            queryParams.push(tag);
            whereClause += ` AND $${queryParams.length} = ANY(p.tags)`;
        }

        const sql = `
            ${buildBasePostQuery(currentUserId)}
            ${whereClause}
            ORDER BY p.created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

        const result = await query(sql, queryParams);
        const posts = result.rows.map(formatPostRow);

        res.json({ success: true, posts, page, limit });
    } catch (error: any) {
        console.error("getPosts Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch posts" });
    }
};

// GET /api/posts/:id - Single post details
export const getPostById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user?.id;

        const sql = `
            ${buildBasePostQuery(currentUserId)}
            WHERE p.id = $1
        `;

        const result = await query(sql, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const post = formatPostRow(result.rows[0]);

        // If post is draft, ensure request is from post owner
        if (post.status === "draft" && post.userId !== currentUserId) {
            return res.status(403).json({ success: false, message: "Access denied to draft post" });
        }

        res.json({ success: true, post });
    } catch (error: any) {
        console.error("getPostById Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch post details" });
    }
};

// GET /api/posts/feed/for-you
export const getForYouFeed = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.id;
        const sql = `
            ${buildBasePostQuery(currentUserId)}
            WHERE p.status = 'published'
            ORDER BY (p.likes_count + p.comments_count + p.saves_count) DESC, p.created_at DESC
            LIMIT 20
        `;
        const result = await query(sql);
        res.json({ success: true, posts: result.rows.map(formatPostRow) });
    } catch (error: any) {
        console.error("getForYouFeed Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch For You feed" });
    }
};

// GET /api/posts/feed/following
export const getFollowingFeed = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.id;
        if (!currentUserId) {
            return res.status(401).json({ success: false, message: "Authentication required to view Following feed" });
        }

        const sql = `
            ${buildBasePostQuery(currentUserId)}
            WHERE p.status = 'published'
              AND p.user_id IN (SELECT following_id FROM follows WHERE follower_id = $1)
            ORDER BY p.created_at DESC
            LIMIT 20
        `;

        const result = await query(sql, [currentUserId]);
        res.json({ success: true, posts: result.rows.map(formatPostRow) });
    } catch (error: any) {
        console.error("getFollowingFeed Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch Following feed" });
    }
};

// GET /api/posts/feed/trending - Engagement score sorting
export const getTrendingFeed = async (req: AuthRequest, res: Response) => {
    try {
        const currentUserId = req.user?.id;
        const sql = `
            ${buildBasePostQuery(currentUserId)}
            WHERE p.status = 'published'
            ORDER BY (p.likes_count * 2 + p.comments_count * 3 + p.saves_count * 2) DESC, p.created_at DESC
            LIMIT 20
        `;
        const result = await query(sql);
        res.json({ success: true, posts: result.rows.map(formatPostRow) });
    } catch (error: any) {
        console.error("getTrendingFeed Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch Trending feed" });
    }
};

// POST /api/posts - Create post (Draft or Published)
export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const { bookId, title, content, favoriteIdea, tags = [], coverImage, status = "published" } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, message: "Post title is required" });
        }

        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, message: "Post content is required" });
        }

        if (!bookId) {
            return res.status(400).json({ success: false, message: "Associated book selection is required" });
        }

        const postId = `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const sanitizedTags = Array.isArray(tags) ? tags : [];

        await query(
            `INSERT INTO posts (id, user_id, book_id, title, content, favorite_idea, tags, cover_image, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [postId, userId, bookId, title.trim(), content.trim(), favoriteIdea || null, sanitizedTags, coverImage || null, status]
        );

        // Fetch newly created post
        const result = await query(`${buildBasePostQuery(userId)} WHERE p.id = $1`, [postId]);
        const post = formatPostRow(result.rows[0]);

        res.status(201).json({ success: true, message: `Post ${status === "draft" ? "draft saved" : "published"} successfully`, post });
    } catch (error: any) {
        console.error("createPost Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to create post" });
    }
};

// PUT /api/posts/:id - Update post (Author only)
export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        const checkResult = await query("SELECT user_id FROM posts WHERE id = $1", [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (checkResult.rows[0].user_id !== userId && req.user?.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Forbidden: You cannot edit another user's post" });
        }

        const { title, content, favoriteIdea, tags, coverImage, status } = req.body;

        await query(
            `UPDATE posts
             SET title = COALESCE($1, title),
                 content = COALESCE($2, content),
                 favorite_idea = COALESCE($3, favorite_idea),
                 tags = COALESCE($4, tags),
                 cover_image = COALESCE($5, cover_image),
                 status = COALESCE($6, status),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $7`,
            [title, content, favoriteIdea, tags, coverImage, status, id]
        );

        const result = await query(`${buildBasePostQuery(userId)} WHERE p.id = $1`, [id]);
        const post = formatPostRow(result.rows[0]);

        res.json({ success: true, message: "Post updated successfully", post });
    } catch (error: any) {
        console.error("updatePost Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to update post" });
    }
};

// DELETE /api/posts/:id - Delete post (Author or Admin only)
export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        const checkResult = await query("SELECT user_id FROM posts WHERE id = $1", [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (checkResult.rows[0].user_id !== userId && req.user?.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Forbidden: You cannot delete another user's post" });
        }

        await query("DELETE FROM posts WHERE id = $1", [id]);
        res.json({ success: true, message: "Post deleted successfully" });
    } catch (error: any) {
        console.error("deletePost Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to delete post" });
    }
};

// POST /api/posts/:id/publish - Publish a draft
export const publishPost = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        const checkResult = await query("SELECT user_id FROM posts WHERE id = $1", [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (checkResult.rows[0].user_id !== userId) {
            return res.status(403).json({ success: false, message: "Forbidden: You can only publish your own post" });
        }

        await query(
            `UPDATE posts SET status = 'published', published_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [id]
        );

        const result = await query(`${buildBasePostQuery(userId)} WHERE p.id = $1`, [id]);
        res.json({ success: true, message: "Post published successfully", post: formatPostRow(result.rows[0]) });
    } catch (error: any) {
        console.error("publishPost Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to publish post" });
    }
};

// POST /api/posts/:id/like - Toggle like on post
export const toggleLikePost = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const { id: postId } = req.params;

        const postCheck = await query("SELECT id FROM posts WHERE id = $1", [postId]);
        if (postCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const likeCheck = await query("SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2", [postId, userId]);

        if (likeCheck.rows.length > 0) {
            // Unlike
            await query("DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2", [postId, userId]);
            await query("UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = $1", [postId]);
            return res.json({ success: true, isLiked: false, message: "Post unliked" });
        } else {
            // Like
            const likeId = `like-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
            await query("INSERT INTO post_likes (id, post_id, user_id) VALUES ($1, $2, $3)", [likeId, postId, userId]);
            await query("UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1", [postId]);
            return res.json({ success: true, isLiked: true, message: "Post liked" });
        }
    } catch (error: any) {
        console.error("toggleLikePost Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to toggle like" });
    }
};

// POST /api/posts/:id/save - Toggle save post
export const toggleSavePost = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const { id: postId } = req.params;

        const postCheck = await query("SELECT id FROM posts WHERE id = $1", [postId]);
        if (postCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const saveCheck = await query("SELECT id FROM saved_posts WHERE post_id = $1 AND user_id = $2", [postId, userId]);

        if (saveCheck.rows.length > 0) {
            // Unsave
            await query("DELETE FROM saved_posts WHERE post_id = $1 AND user_id = $2", [postId, userId]);
            await query("UPDATE posts SET saves_count = GREATEST(0, saves_count - 1) WHERE id = $1", [postId]);
            return res.json({ success: true, isSaved: false, message: "Post unsaved" });
        } else {
            // Save
            const saveId = `save-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
            await query("INSERT INTO saved_posts (id, post_id, user_id) VALUES ($1, $2, $3)", [saveId, postId, userId]);
            await query("UPDATE posts SET saves_count = saves_count + 1 WHERE id = $1", [postId]);
            return res.json({ success: true, isSaved: true, message: "Post saved to reading list" });
        }
    } catch (error: any) {
        console.error("toggleSavePost Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to toggle save post" });
    }
};

// GET /api/posts/:id/comments - Get comments for a post
export const getComments = async (req: AuthRequest, res: Response) => {
    try {
        const { id: postId } = req.params;
        const sql = `
            SELECT c.*, u.name as author_name, u.avatar as author_avatar
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = $1
            ORDER BY c.created_at ASC
        `;
        const result = await query(sql, [postId]);

        const comments = result.rows.map((row) => ({
            id: row.id,
            postId: row.post_id,
            userId: row.user_id,
            authorName: row.author_name,
            authorAvatar: row.author_avatar,
            text: row.text,
            createdAt: row.created_at
        }));

        res.json({ success: true, comments });
    } catch (error: any) {
        console.error("getComments Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch comments" });
    }
};

// POST /api/posts/:id/comments - Add comment
export const addComment = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }

        const { id: postId } = req.params;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, message: "Comment text cannot be empty" });
        }

        const commentId = `cmt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        await query(
            "INSERT INTO comments (id, post_id, user_id, text) VALUES ($1, $2, $3, $4)",
            [commentId, postId, userId, text.trim()]
        );
        await query("UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1", [postId]);

        // Return comment with user info
        const result = await query(
            `SELECT c.*, u.name as author_name, u.avatar as author_avatar
             FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = $1`,
            [commentId]
        );

        const comment = {
            id: result.rows[0].id,
            postId: result.rows[0].post_id,
            userId: result.rows[0].user_id,
            authorName: result.rows[0].author_name,
            authorAvatar: result.rows[0].author_avatar,
            text: result.rows[0].text,
            createdAt: result.rows[0].created_at
        };

        res.status(201).json({ success: true, message: "Comment added", comment });
    } catch (error: any) {
        console.error("addComment Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to add comment" });
    }
};

// DELETE /api/comments/:id - Delete comment (Comment author or Admin only)
export const deleteComment = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { id: commentId } = req.params;

        const check = await query("SELECT post_id, user_id FROM comments WHERE id = $1", [commentId]);
        if (check.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        const { post_id: postId, user_id: commentUserId } = check.rows[0];

        if (commentUserId !== userId && req.user?.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Forbidden: Cannot delete another user's comment" });
        }

        await query("DELETE FROM comments WHERE id = $1", [commentId]);
        await query("UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = $1", [postId]);

        res.json({ success: true, message: "Comment deleted" });
    } catch (error: any) {
        console.error("deleteComment Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to delete comment" });
    }
};

// GET /api/books/:bookId/posts - Published posts for a specific book ("Readers' Thoughts")
export const getPostsByBookId = async (req: AuthRequest, res: Response) => {
    try {
        const { bookId } = req.params;
        const currentUserId = req.user?.id;

        const sql = `
            ${buildBasePostQuery(currentUserId)}
            WHERE p.book_id = $1 AND p.status = 'published'
            ORDER BY p.created_at DESC
        `;

        const result = await query(sql, [bookId]);
        res.json({ success: true, posts: result.rows.map(formatPostRow) });
    } catch (error: any) {
        console.error("getPostsByBookId Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch book posts" });
    }
};
