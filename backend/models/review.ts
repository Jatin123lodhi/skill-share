import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    comment: {
      type: String,
      required: true,
      maxLength: 500,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

// unique coumpound index
reviewSchema.index({ userId: 1, courseId: 1 }, { unique: true });
// For getReviews query (read optimization)
reviewSchema.index({ courseId: 1, createdAt: -1 });

export const Review = mongoose.model("Review", reviewSchema);
