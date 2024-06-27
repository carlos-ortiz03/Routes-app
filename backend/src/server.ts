import dotenv from "dotenv";
dotenv.config(); // Call dotenv.config() at the top

import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth.route";
import mapsRouter from "./routes/maps.route";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandlingMiddleware, CustomError } from "./utils/error";

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

const app = express();

// Set up CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/maps", mapsRouter);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(5001, () => {
  console.log("Server is running on http://localhost:5001");
});
