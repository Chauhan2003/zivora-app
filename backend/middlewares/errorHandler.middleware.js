import { STATUS, HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";

/**
 * Custom Error Class
 */
export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handler Middleware
 * Catches and processes all errors in the application
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  // Log error for debugging
  console.error(`[${req.method}] ${req.path} - Error:`, err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    error.message = message;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error.statusCode = HTTP_STATUS.CONFLICT;
    error.message = message;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message).join(", ");
    error.statusCode = HTTP_STATUS.BAD_REQUEST;
    error.message = message;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
    error.message = message;
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
    error.message = message;
  }

  res.status(error.statusCode).json({
    status: STATUS.FAILURE,
    message: error.message || ERROR_MESSAGES.INTERNAL_ERROR,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors automatically
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Not Found Handler
 * Handles 404 errors for undefined routes
 */
export const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    status: STATUS.FAILURE,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
