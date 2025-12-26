import express from "express";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import courseRoutes from "./routes/course";
import userRoutes from "./routes/user";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

// Connect to database
await connectDB();

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Health endpoint! - OK",
    status: 200,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users/", userRoutes)



// 404 handler (must be before error handler)
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  })
})

// Error handler (must be last)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log("Server is running at port ",PORT);
});
