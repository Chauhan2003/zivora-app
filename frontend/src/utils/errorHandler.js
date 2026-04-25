import { ERROR_MESSAGES, API_STATUS } from "../constants";

/**
 * Error Handler Utility
 * Centralized error handling for the application
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
 * Handle API errors and return user-friendly messages
 * @param {Object} error - Error object from API call
 * @returns {Object} Processed error with message and status
 */
export const handleApiError = (error) => {
  if (!error.response) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      statusCode: API_STATUS.INTERNAL_SERVER_ERROR,
    };
  }

  const { status, data } = error.response;

  switch (status) {
    case API_STATUS.BAD_REQUEST:
      return {
        message: data?.message || "Invalid request data",
        statusCode: status,
      };
    case API_STATUS.UNAUTHORIZED:
      return {
        message: ERROR_MESSAGES.UNAUTHORIZED,
        statusCode: status,
      };
    case API_STATUS.FORBIDDEN:
      return {
        message: ERROR_MESSAGES.FORBIDDEN,
        statusCode: status,
      };
    case API_STATUS.NOT_FOUND:
      return {
        message: ERROR_MESSAGES.NOT_FOUND,
        statusCode: status,
      };
    case API_STATUS.CONFLICT:
      return {
        message: data?.message || "Resource already exists",
        statusCode: status,
      };
    case API_STATUS.INTERNAL_SERVER_ERROR:
      return {
        message: ERROR_MESSAGES.SERVER_ERROR,
        statusCode: status,
      };
    default:
      return {
        message: data?.message || ERROR_MESSAGES.DEFAULT,
        statusCode: status,
      };
  }
};

/**
 * Log error for debugging
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 */
export const logError = (error, context = "Unknown") => {
  console.error(`[${context}] Error:`, error);
  
  if (error.response) {
    console.error(`[${context}] Response:`, error.response.data);
  }
};

/**
 * Show toast notification for error
 * @param {Object} error - Error object
 * @param {Function} toast - Toast function
 */
export const showErrorToast = (error, toast) => {
  const { message } = handleApiError(error);
  toast.error(message);
};
