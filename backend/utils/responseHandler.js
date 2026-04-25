import { STATUS, HTTP_STATUS } from "../constants/index.js";

/**
 * Response Handler Utility
 * Provides consistent response formatting
 */

export const responseHandler = {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {Object} data - Response data
   * @param {Object} additionalData - Additional data to include
   */
  success(res, statusCode = HTTP_STATUS.OK, message = "Success", data = null, additionalData = {}) {
    const response = {
      status: STATUS.SUCCESS,
      message,
    };

    if (data !== null) {
      response.data = data;
    }

    return res.status(statusCode).json({ ...response, ...additionalData });
  },

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Object} errors - Validation errors
   */
  error(res, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message = "Error", errors = null) {
    const response = {
      status: STATUS.FAILURE,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  },

  /**
   * Created response (201)
   * @param {Object} res - Express response object
   * @param {string} message - Success message
   * @param {Object} data - Response data
   */
  created(res, message = "Resource created successfully", data = null) {
    return this.success(res, HTTP_STATUS.CREATED, message, data);
  },

  /**
   * Bad request response (400)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {Object} errors - Validation errors
   */
  badRequest(res, message = "Bad request", errors = null) {
    return this.error(res, HTTP_STATUS.BAD_REQUEST, message, errors);
  },

  /**
   * Unauthorized response (401)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  unauthorized(res, message = "Unauthorized") {
    return this.error(res, HTTP_STATUS.UNAUTHORIZED, message);
  },

  /**
   * Forbidden response (403)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  forbidden(res, message = "Forbidden") {
    return this.error(res, HTTP_STATUS.FORBIDDEN, message);
  },

  /**
   * Not found response (404)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  notFound(res, message = "Resource not found") {
    return this.error(res, HTTP_STATUS.NOT_FOUND, message);
  },

  /**
   * Conflict response (409)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  conflict(res, message = "Resource already exists") {
    return this.error(res, HTTP_STATUS.CONFLICT, message);
  },

  /**
   * Internal server error response (500)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  serverError(res, message = "Internal server error") {
    return this.error(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
  },
};
