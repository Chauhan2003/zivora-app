import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";

/**
 * Notification Service
 * Handles all notification-related business logic
 */

export const notificationService = {
  /**
   * Get all notifications for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Notifications with populated user data
   */
  async getNotifications(userId) {
    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .lean();

    // Populate notifications with actor user data
    const notificationsWithUserData = await Promise.all(
      notifications.map(async (notification) => {
        const actor = await User.findById(notification.actorId).select("username").lean();
        const actorProfile = await Profile.findOne({ userId: notification.actorId })
          .select("avatar fullName")
          .lean();

        const notificationData = {
          _id: notification._id,
          type: notification.type,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
          updatedAt: notification.updatedAt,
          from: {
            _id: actor?._id,
            username: actor?.username,
            fullName: actorProfile?.fullName || null,
            avatar: actorProfile?.avatar || null,
          },
        };

        // Add post data for LIKE_POST and COMMENT notifications
        if (notification.entityType === "POST" && notification.entityId) {
          const Post = (await import("../models/post.model.js")).default;
          const post = await Post.findById(notification.entityId).select("mediaUrls caption").lean();
          if (post) {
            notificationData.post = {
              _id: post._id,
              mediaUrls: post.mediaUrls,
            };
          }
        }

        // Add comment text for COMMENT notifications
        if (notification.type === "COMMENT" && notification.metadata?.commentText) {
          notificationData.comment = {
            text: notification.metadata.commentText,
          };
        }

        return notificationData;
      })
    );

    return notificationsWithUserData;
  },

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @param {string} userId - User ID (for authorization)
   * @returns {Promise<Object>} Result
   */
  async markAsRead(notificationId, userId) {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND, {
        cause: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (notification.recipientId.toString() !== userId.toString()) {
      throw new Error(ERROR_MESSAGES.FORBIDDEN, {
        cause: HTTP_STATUS.FORBIDDEN,
      });
    }

    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    return { success: true };
  },

  /**
   * Mark all notifications as read for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Result
   */
  async markAllAsRead(userId) {
    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { isRead: true }
    );
    return { success: true };
  },

  /**
   * Delete notification
   * @param {string} notificationId - Notification ID
   * @param {string} userId - User ID (for authorization)
   * @returns {Promise<Object>} Result
   */
  async deleteNotification(notificationId, userId) {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND, {
        cause: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (notification.recipientId.toString() !== userId.toString()) {
      throw new Error(ERROR_MESSAGES.FORBIDDEN, {
        cause: HTTP_STATUS.FORBIDDEN,
      });
    }

    await Notification.findByIdAndDelete(notificationId);
    return { success: true };
  },

  /**
   * Create a notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} Created notification
   */
  async createNotification(notificationData) {
    const notification = await Notification.create(notificationData);
    return notification;
  },
};
