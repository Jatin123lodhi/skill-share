import express from "express"
import { authMiddleware } from "../middlewares/auth";
import { getEnrollments } from "../controllers/userControlller";
const router = express.Router();


router.get("/course/enrollments", authMiddleware, getEnrollments)

export default router;