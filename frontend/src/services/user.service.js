import apiClient from "../utils/apiClient";
import { userRoute } from "../utils/routes";

/**
 * User Service
 * Handles all user-related API calls
 */

export const userService = {
  /**
   * Get current user profile
   * @returns {Promise} API response
   */
  getCurrentUser: async () => {
    return apiClient.get(`${userRoute}/me`);
  },

  /**
   * Get user profile by username
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  getUserProfile: async (username) => {
    return apiClient.get(`${userRoute}/${username}`);
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise} API response
   */
  updateProfile: async (profileData) => {
    return apiClient.put(`${userRoute}/profile`, profileData);
  },

  /**
   * Update user profile image
   * @param {FormData} formData - Form data with image
   * @returns {Promise} API response
   */
  updateProfileImage: async (formData) => {
    return apiClient.put(`${userRoute}/profile/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /**
   * Get suggested users
   * @returns {Promise} API response
   */
  getSuggestedUsers: async () => {
    return apiClient.post(`${userRoute}/suggested-users`);
  },

  /**
   * Search users
   * @param {string} query - Search query
   * @returns {Promise} API response
   */
  searchUsers: async (query) => {
    return apiClient.get(`${userRoute}/search?q=${query}`);
  },

  /**
   * Follow a user
   * @param {string} userId - User ID to follow
   * @returns {Promise} API response
   */
  followUser: async (userId) => {
    return apiClient.post(`${userRoute}/${userId}/follow`);
  },

  /**
   * Unfollow a user
   * @param {string} userId - User ID to unfollow
   * @returns {Promise} API response
   */
  unfollowUser: async (userId) => {
    return apiClient.delete(`${userRoute}/${userId}/follow`);
  },
};
