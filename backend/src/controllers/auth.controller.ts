import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const TOKEN_EXPIRATION_TIME = "6h"; // Set to 6 hours

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, username: newUser.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "6h" }
    );

    console.log("Setting cookie with token after signup");

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure to true for production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set SameSite to None for cross-site cookies in production
      maxAge: 6 * 60 * 60 * 1000, // 6 hours
    });

    res.status(201).json({
      user: { username: newUser.username, email: newUser.email },
      message: "Signed up successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "6h" }
    );

    console.log("Setting cookie with token");

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure to true for production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set SameSite to None for cross-site cookies in production
      maxAge: 6 * 60 * 60 * 1000, // 6 hours
    });

    res.status(200).json({
      user: { username: user.username, email: user.email },
      message: "Logged in successfully",
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
