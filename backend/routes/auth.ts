import express from "express";
const router = express.Router();
import { authMiddleware } from "../middlewares/auth";
import { getCurrentUser, login, register } from "../controllers/authController";
import {
  authRateLimiter,
  strictAuthRateLimiter,
} from "../middlewares/rateLimiter";

router.post("/register", strictAuthRateLimiter, register);

// router.post("/login", strictAuthRateLimiter, login);
router.post("/login", login); // TODO: removed for testing

router.get("/me", authRateLimiter, authMiddleware, getCurrentUser);

export default router;
