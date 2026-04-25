/**
 * Logger Utility
 * Provides structured logging for the application
 */

export const logger = {
  /**
   * Log info message
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  info(message, meta = {}) {
    console.log(`[INFO] ${message}`, meta);
  },

  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  warn(message, meta = {}) {
    console.warn(`[WARN] ${message}`, meta);
  },

  /**
   * Log error message
   * @param {string} message - Log message
   * @param {Error} error - Error object
   * @param {Object} meta - Additional metadata
   */
  error(message, error = null, meta = {}) {
    console.error(`[ERROR] ${message}`, error || "", meta);
  },

  /**
   * Log debug message
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  debug(message, meta = {}) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEBUG] ${message}`, meta);
    }
  },
};
