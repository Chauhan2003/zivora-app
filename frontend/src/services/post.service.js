import apiClient from "../utils/apiClient";
import { postRoute } from "../utils/routes";

/**
 * Post Service
 * Handles all post-related API calls
 */

export const postService = {
  /**
   * Create a new post
   * @param {Object} postData - Post data
   * @param {string} postData.content - Post content
   * @param {Array} postData.images - Array of image URLs
   * @returns {Promise} API response
   */
  createPost: async (postData) => {
    return apiClient.post(`${postRoute}/create`, postData);
  },

  /**
   * Get feed posts
   * @param {number} page - Page number
   * @param {number} limit - Number of posts per page
   * @returns {Promise} API response
   */
  getFeedPosts: async (page = 1, limit = 10) => {
    const response = await apiClient.get(`${postRoute}/feed?page=${page}&limit=${limit}`);
    return response?.data?.data || [];
  },

  /**
   * Get post by ID
   * @param {string} postId - Post ID
   * @returns {Promise} API response
   */
  getPostById: async (postId) => {
    return apiClient.get(`${postRoute}/${postId}`);
  },

  /**
   * Like a post
   * @param {string} postId - Post ID
   * @returns {Promise} API response
   */
  likePost: async (postId) => {
    return apiClient.post(`${postRoute}/like/${postId}`);
  },

  /**
   * Unlike a post
   * @param {string} postId - Post ID
   * @returns {Promise} API response
   */
  unlikePost: async (postId) => {
    return apiClient.post(`${postRoute}/unlike/${postId}`);
  },

  /**
   * Save a post
   * @param {string} postId - Post ID
   * @returns {Promise} API response
   */
  savePost: async (postId) => {
    return apiClient.post(`${postRoute}/save/${postId}`);
  },

  /**
   * Unsave a post
   * @param {string} postId - Post ID
   * @returns {Promise} API response
   */
  unsavePost: async (postId) => {
    return apiClient.post(`${postRoute}/unsave/${postId}`);
  },

  /**
   * Add comment to post
   * @param {string} postId - Post ID
   * @param {Object} commentData - Comment data
   * @returns {Promise} API response
   */
  addComment: async (postId, commentData) => {
    return apiClient.post(`${postRoute}/comment/${postId}`, commentData);
  },

  /**
   * Get post comments
   * @param {string} postId - Post ID
   * @returns {Promise} API response
   */
  getComments: async (postId) => {
    return apiClient.get(`${postRoute}/comments/${postId}`);
  },

  /**
   * Delete a post
   * @param {string} postId - Post ID
   * @returns {Promise} API response
   */
  deletePost: async (postId) => {
    return apiClient.delete(`${postRoute}/${postId}`);
  },

  /**
   * Get user's posts
   * @param {string} username - Username
   * @returns {Promise} API response
   */
  getUserPosts: async (username) => {
    return apiClient.get(`${postRoute}/user/${username}`);
  },
};
