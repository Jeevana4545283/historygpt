import { Router } from "express";
import {
    getPosts,
    getPostById,
    getForYouFeed,
    getFollowingFeed,
    getTrendingFeed,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    toggleLikePost,
    toggleSavePost,
    getComments,
    addComment,
    deleteComment,
    getPostsByBookId
} from "../controllers/postController";
import { authenticateToken, optionalAuthenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Feed endpoints
router.get("/feed/for-you", optionalAuthenticateToken, getForYouFeed);
router.get("/feed/following", authenticateToken, getFollowingFeed);
router.get("/feed/trending", optionalAuthenticateToken, getTrendingFeed);

// General posts
router.get("/", optionalAuthenticateToken, getPosts);
router.get("/:id", optionalAuthenticateToken, getPostById);
router.post("/", authenticateToken, createPost);
router.put("/:id", authenticateToken, updatePost);
router.delete("/:id", authenticateToken, deletePost);
router.post("/:id/publish", authenticateToken, publishPost);

// Likes and Saves
router.post("/:id/like", authenticateToken, toggleLikePost);
router.delete("/:id/like", authenticateToken, toggleLikePost);
router.post("/:id/save", authenticateToken, toggleSavePost);
router.delete("/:id/save", authenticateToken, toggleSavePost);

// Comments
router.get("/:id/comments", getComments);
router.post("/:id/comments", authenticateToken, addComment);

// Book Connection: Readers' Thoughts
router.get("/book/:bookId", optionalAuthenticateToken, getPostsByBookId);

export default router;
