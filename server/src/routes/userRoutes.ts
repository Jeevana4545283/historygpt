import { Router } from "express";
import {
    getUserProfile,
    toggleFollowUser,
    getUserPosts,
    getUserSavedPosts,
    updateProfile
} from "../controllers/userController";
import { authenticateToken, optionalAuthenticateToken } from "../middleware/authMiddleware";
import { deleteComment } from "../controllers/postController";

const router = Router();

// Profile routes
router.get("/:id/profile", optionalAuthenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateProfile);
router.get("/:id/posts", optionalAuthenticateToken, getUserPosts);
router.get("/:id/saved-posts", authenticateToken, getUserSavedPosts);

// Follow / Unfollow
router.post("/:id/follow", authenticateToken, toggleFollowUser);
router.delete("/:id/follow", authenticateToken, toggleFollowUser);

// Comment deletion helper route under /api/comments/:id
router.delete("/comments/:id", authenticateToken, deleteComment);

export default router;
