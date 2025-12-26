import { Enrollment } from "../models/enrollment";
import type { Request, Response } from "express";

export const getEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user?.userId })
      .populate("courseId", "title description")
      .populate("userId", "name email");

    return res.status(200).json({
      enrollments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
