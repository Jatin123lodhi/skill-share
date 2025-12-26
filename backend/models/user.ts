import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    name: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "instructor"],
      default: "student"
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
