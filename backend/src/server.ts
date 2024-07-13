import dotenv from "dotenv";
dotenv.config(); // Ensure this is at the very top

import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth.route";
import mapsRouter from "./routes/maps.route";
import routesRouter from "./routes/routes.route";
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
    origin: process.env.FRONTEND_URL, // Use environment variable for Frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/maps", mapsRouter);
app.use("/api/routes", routesRouter);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const port = parseInt(process.env.PORT as string, 10) || 5001;
app.listen(port, "0.0.0.0", () => {
  if (process.env.NODE_ENV === "production") {
    console.log(`Server is running in production on port ${port}`);
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});
