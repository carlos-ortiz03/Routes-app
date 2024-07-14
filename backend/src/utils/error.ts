import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (statusCode: number, message: string) => {
  const error = new Error(message);
  (error as CustomError).statusCode = statusCode;
  return error;
};

// Error-handling middleware
export const errorHandlingMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = (err as CustomError).statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the error for debugging
  console.error(`[${new Date().toISOString()}] ${statusCode} - ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};
