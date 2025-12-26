import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    ratingAvg: {
        type: Number,
        default: 0
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
  },
  { timestamps: true }
);

// Add indexes after schema
courseSchema.index({ category: 1 });
courseSchema.index({ createdAt: -1 })
// courseSchema.index({ ratingAvg: -1 }) // helpful when sorting or filtering by rating for getCourses

export const Course = mongoose.model("Course", courseSchema);
