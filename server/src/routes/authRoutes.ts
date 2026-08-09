import { Router } from "express";
import { register, login, guestLogin, getMe } from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/guest", guestLogin);
router.get("/me", authenticateToken, getMe);

export default router;
