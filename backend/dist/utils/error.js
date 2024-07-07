"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlingMiddleware = exports.errorHandler = void 0;
const errorHandler = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};
exports.errorHandler = errorHandler;
// Error-handling middleware
const errorHandlingMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
};
exports.errorHandlingMiddleware = errorHandlingMiddleware;
