import type { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { Course } from "../models/course";
import { Enrollment } from "../models/enrollment";
import { Review } from "../models/review";
import mongoose from "mongoose";
export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, price, category } = req.body;
  if (!title || !description || !price || !category) {
    return res.status(400).json({
      message: "title, description, price, category are required",
    });
  }

  try {
    const user = await User.findOne({ _id: req.user?.userId });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // check title is unique
    const courseExists = await Course.findOne({ title });
    if (courseExists) {
      return res.status(409).json({
        message: "Title already exists",
      });
    }

    // create course logic
    const course = await Course.create({
      title,
      description,
      price,
      category,
      instructorId: req.user?.userId,
    });

    return res.status(201).json({
      message: "Course created successfully!",
      course: {
        id: course._id,
        title,
        description,
        price,
        category,
        instructorId: course.instructorId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // build filter object
    const filter: any = {};

    // add categroy filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // add minRating filter
    if (req.query.minRating) {
      const minRating = parseFloat(req.query.minRating as string);
      filter.ratingAvg = { $gte: minRating };
    }

    const sortOrder = req.query.sort === "oldest" ? 1 : -1; // default latest

    const total = await Course.countDocuments(filter);

    const courses = await Course.find(filter)
      .populate("instructorId", "name email")
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    // calculate hasNext
    const hasNext = skip + limit < total;

    return res.status(200).json({
      meta: {
        page,
        limit,
        hasNext,
      },
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const enrollInCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { courseId } = req.params;
  const userId = req.user?.userId;
  try {
    if (!courseId) {
      return res.status(400).json({
        message: "CourseId is required",
      });
    }

    // check course exists
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // check if already enrolled
    const exisitingEnrollment = await Enrollment.findOne({
      courseId,
      userId,
    });

    if (exisitingEnrollment) {
      return res.status(409).json({
        message: "Already enrolled in the course",
      });
    }

    // now enroll
    const enrollment = await Enrollment.create({
      courseId,
      userId,
    });

    return res.status(201).json({
      message: "Enrollment successfully",
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

export const reviewCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { comment, rating } = req.body;
  const courseId = req.params.courseId; // as /:courseId so use params not query
  const userId = req.user?.userId;

  if (!courseId || !comment || !rating) {
    return res.status(400).json({
      message: "CourseId, comment and rating are required",
    });
  }

  try {
    const courseExists = await Course.findOne({ _id: courseId });
    if (!courseExists) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // check user is enrolled
    const enrollment = await Enrollment.findOne({
      userId,
      courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You must be enrolled to review the course",
      });
    }

    // validate the rating
    const ratingNum = Number(rating);
    if (
      isNaN(ratingNum) ||
      ratingNum < 1 ||
      ratingNum > 5 ||
      !Number.isInteger(ratingNum)
    ) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5",
      });
    }

    // create the review
    const review = await Review.create({
      courseId,
      userId,
      comment,
      rating,
    });

    // calculate the avg rating for this course
    const result = await Review.aggregate([
      {
        $match: { courseId: new mongoose.Types.ObjectId(courseId) },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    const avgRating = Math.round((result[0]?.avgRating || 0) * 10) / 10;

    // update course avgRating
    await Course.findByIdAndUpdate(courseId, { ratingAvg: avgRating });

    return res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    next(error)
  }
};

export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { courseId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  try {
    if (!courseId) {
      return res.status(400).json({
        message: "CourseId is required",
      });
    }

    // get total count for pagination metadata
    const total = await Review.countDocuments({
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    const reviews = await Review.find({
      courseId: new mongoose.Types.ObjectId(courseId),
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const hasNext = skip + limit < total;

    return res.status(200).json({
      data: reviews,
      meta: {
        page,
        limit,
        hasNext,
      },
    });
  } catch (error) {
    next(error)
  }
};
