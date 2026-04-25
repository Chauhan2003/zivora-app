import { notificationService } from "../services/index.js";
import { responseHandler } from "../utils/index.js";
import { asyncHandler } from "../middlewares/errorHandler.middleware.js";

/**
 * Get all notifications for current user
 * @route GET /api/v1/notifications
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  const notifications = await notificationService.getNotifications(userId);

  return responseHandler.success(res, 200, "Notifications fetched successfully", notifications);
});

/**
 * Mark notification as read
 * @route PUT /api/v1/notifications/:notificationId/read
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user?.userId;

  await notificationService.markAsRead(notificationId, userId);

  return responseHandler.success(res, 200, "Notification marked as read");
});

/**
 * Mark all notifications as read
 * @route PUT /api/v1/notifications/read-all
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  await notificationService.markAllAsRead(userId);

  return responseHandler.success(res, 200, "All notifications marked as read");
});

/**
 * Delete notification
 * @route DELETE /api/v1/notifications/:notificationId
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user?.userId;

  await notificationService.deleteNotification(notificationId, userId);

  return responseHandler.success(res, 200, "Notification deleted successfully");
});
