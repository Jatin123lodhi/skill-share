import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});

enrollmentSchema.index({ userId: 1, courseId: 1 }, {unique: true});

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
