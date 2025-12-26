import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://admin:password@localhost:27017/skillshare?authSource=admin";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1);
  }
};


// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected")
})

mongoose.connection.on("error", (err) => {
  console.log("MongoDB error: ", err);
})