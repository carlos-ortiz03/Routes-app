import dotenv from "dotenv";
dotenv.config(); // Ensure this is at the very top

import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import mapsRouter from "./routes/maps.route";
import routesRouter from "./routes/routes.route";
import { errorHandlingMiddleware, CustomError } from "./utils/error";

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is not set.");
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
    process.exit(1); // Exit the process with a failure code
  });

const app = express();
const port = process.env.PORT || 5001;

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://routecrafter-ndzysnsdr-carlos-projects-ca3731b5.vercel.app"]
    : ["http://localhost:5173"];

const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    console.log(`Incoming origin: ${origin}`); // Log the incoming origin for debugging
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/maps", mapsRouter);
app.use("/api/routes", routesRouter);

// Error handling middleware
app.use(errorHandlingMiddleware);

// Start the server
app.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    console.log(`Server is running in production on port ${port}`);
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});
