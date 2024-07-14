import dotenv from "dotenv";
dotenv.config(); // Ensure this is at the very top

import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // Add this import
import authRouter from "./routes/auth.route";
import mapsRouter from "./routes/maps.route";
import routesRouter from "./routes/routes.route";
import cookieParser from "cookie-parser";
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

app.use(
  cors({
    origin: "http://localhost:5173", // Ensure this matches your frontend origin
    credentials: true,
  })
); // Add this line to enable CORS with credentials
app.use(express.json());
app.use(cookieParser());

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
