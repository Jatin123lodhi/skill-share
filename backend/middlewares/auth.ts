import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
    });
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    console.log(process.env.JWT_SECRET, '------process.env.JWT_SECRET')
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT secret not configured",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: string,
        email: string,
        role: string
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
