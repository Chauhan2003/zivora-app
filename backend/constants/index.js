/**
 * Application Constants
 * Centralized constants for the application
 */

export const STATUS = {
  SUCCESS: "Success",
  FAILURE: "Failure",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  VALIDATION_ERROR: "Validation error",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access forbidden",
  NOT_FOUND: "Resource not found",
  CONFLICT: "Resource already exists",
  INTERNAL_ERROR: "Internal server error",
  NETWORK_ERROR: "Network error",
  DATABASE_ERROR: "Database error",
  INVALID_CREDENTIALS: "Invalid credentials",
  ACCOUNT_DEACTIVATED: "Account has been deactivated",
  ACCOUNT_NOT_VERIFIED: "Account not verified",
};

export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-z0-9._]+$/,
  },
  FULL_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 64,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};

export const JWT = {
  SECRET: process.env.JWT_SECRET || "your_jwt_secret_here",
  EXPIRES_IN: "1d",
};

export const BCRYPT = {
  SALT_ROUNDS: 10,
};

export const MONGODB = {
  URI: process.env.MONGODB_URI || "mongodb://localhost:27017/zivora",
};

export const CLOUDINARY = {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export const EMAIL = {
  SERVICE: process.env.EMAIL_SERVICE || "gmail",
  HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
  PORT: process.env.EMAIL_PORT || 587,
  SECURE: process.env.EMAIL_SECURE === "true",
  USERNAME: process.env.EMAIL_USERNAME,
  PASSWORD: process.env.EMAIL_PASSWORD,
};

export const GROQ = {
  API_KEY: process.env.GROQ_API_KEY,
};

export const APP = {
  NAME: "Zivora",
  VERSION: "1.0.0",
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 8080,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};
