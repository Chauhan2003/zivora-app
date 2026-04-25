import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import protect from "../middlewares/protect.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get all notifications for current user
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 */
router.get("/", protect, getNotifications);

/**
 * @swagger
 * /notifications/:notificationId/read:
 *   put:
 *     tags: [Notifications]
 *     summary: Mark notification as read
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.put("/:notificationId/read", protect, markAsRead);

/**
 * @swagger
 * /notifications/read-all:
 *   put:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put("/read-all", protect, markAllAsRead);

/**
 * @swagger
 * /notifications/:notificationId:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete notification
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 */
router.delete("/:notificationId", protect, deleteNotification);

export default router;
