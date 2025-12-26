import express from "express";
import {
  createCourse,
  enrollInCourse,
  getCourses,
  getReviews,
  reviewCourse,
} from "../controllers/courseController";
import { authMiddleware } from "../middlewares/auth";
import { requireRole } from "../middlewares/requireRole";
const router = express.Router();

router.post("/", authMiddleware, requireRole("instructor"), createCourse);

router.get("/", getCourses);

router.post(
  "/:courseId/enroll",
  authMiddleware,
  requireRole("student"),
  enrollInCourse
);

router.post(
  "/:courseId/review",
  authMiddleware,
  requireRole("student"),
  reviewCourse
);

router.get("/:courseId/review", getReviews)

export default router;
