import apiClient from "../utils/apiClient";
import { notificationRoute } from "../utils/routes";

/**
 * Notification Service
 * Handles all notification-related API calls
 */

export const notificationService = {
  /**
   * Get user notifications
   * @returns {Promise} API response
   */
  getNotifications: async () => {
    return apiClient.get(`${notificationRoute}`);
  },

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} API response
   */
  markAsRead: async (notificationId) => {
    return apiClient.put(`${notificationRoute}/read/${notificationId}`);
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} API response
   */
  markAllAsRead: async () => {
    return apiClient.put(`${notificationRoute}/read-all`);
  },

  /**
   * Delete notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise} API response
   */
  deleteNotification: async (notificationId) => {
    return apiClient.delete(`${notificationRoute}/${notificationId}`);
  },
};
