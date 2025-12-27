import { isValidEmail } from "../utils/helper";
import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import { generateToken } from "../utils/jwt";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name, role } = req.body; // TODO: need to remove role

    // input validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // email format validation
    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // password strength valiation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be atleast 6 characters long",
      });
    }

    // consistency check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a user
    const user = await User.create({
      name: name || undefined,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "Registration successful!",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Missing email or password",
      });
    }

    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // check for password using bcrypt
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // generate jwt token
    const token = generateToken(
      existingUser._id.toString(),
      existingUser.email,
      existingUser.role
    );

    // login successful
    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ _id: req.user?.userId });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    next(error);
  }
};
