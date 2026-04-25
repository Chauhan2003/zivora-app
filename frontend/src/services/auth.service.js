import apiClient from "../utils/apiClient";
import { authRoute } from "../utils/routes";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.fullName - User's full name
   * @param {string} userData.username - User's username
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @returns {Promise} API response
   */
  register: async (userData) => {
    const { confirmPassword, ...registerData } = userData;
    return apiClient.post(`${authRoute}/register`, registerData);
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.usernameOrEmail - Username or email
   * @param {string} credentials.password - Password
   * @param {Object} credentials.location - User's location data
   * @returns {Promise} API response
   */
  login: async (credentials) => {
    return apiClient.post(`${authRoute}/login`, credentials);
  },

  /**
   * Check username availability
   * @param {string} username - Username to check
   * @returns {Promise} API response
   */
  checkUsername: async (username) => {
    return apiClient.get(`${authRoute}/check-username/${username}`);
  },

  /**
   * Request password reset link
   * @param {string} usernameOrEmail - Username or email
   * @returns {Promise} API response
   */
  forgotPassword: async (usernameOrEmail) => {
    return apiClient.get(`${authRoute}/forget-password/${usernameOrEmail}`);
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} password - New password
   * @returns {Promise} API response
   */
  resetPassword: async (token, password) => {
    return apiClient.post(`${authRoute}/reset-password/${token}`, { password });
  },

  /**
   * Verify email with token
   * @param {string} token - Verification token
   * @returns {Promise} API response
   */
  verifyEmail: async (token) => {
    return apiClient.get(`${authRoute}/verify-email/${token}`);
  },
};
