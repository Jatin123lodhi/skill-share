import type { NextFunction, Request, Response } from "express";

interface ErrorWithCode extends Error {
  code?: number;
  statusCode?: number;
}

const isProduction = process.env.NODE_ENV === "production";

export const errorHandler = (
  error: ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // log error with request context
  console.error(`${req.method} ${req.originalUrl || req.url} - Error:`, error);

  // Handle MongoDB duplicate key error (code 11000)
  if (error.code === 11000) {
    return res.status(409).json({
      message: "Duplicate entry - resource already exists",
    });
  }

  // Handle validation errors (Mongoose)
  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      // only show validation message in development
      ...(!isProduction && { error: `Validation error: ${error.message}` }),
    });
  }

  // handle cast errros (invalid ObjectId)
  if (error.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }

  // Handle custom status code errors
  const statusCode = error.statusCode || 500;

  if (statusCode === 500 && isProduction) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  const message = error.message || "Internal Server Error";
  return res.status(statusCode).json({
    message,
    // only include stack trace in development
    ...(!isProduction && { stack: error.stack }),
  });
};
