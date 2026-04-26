import express from "express";
import {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  markAsSeen,
} from "../controllers/chat.controller.js";
import protect from "../middlewares/protect.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /chats/conversations:
 *   get:
 *     tags: [Chats]
 *     summary: Get all conversations for current user
 *     responses:
 *       200:
 *         description: Conversations fetched
 */
router.get("/conversations", protect, getConversations);

/**
 * @swagger
 * /chats/create:
 *   post:
 *     tags: [Chats]
 *     summary: Get or create a conversation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *             properties:
 *               receiverId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Conversation ready
 */
router.post("/create", protect, getOrCreateConversation);

/**
 * @swagger
 * /chats/{conversationId}/messages:
 *   get:
 *     tags: [Chats]
 *     summary: Get messages for a conversation
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages fetched
 */
router.get("/:conversationId/messages", protect, getMessages);

/**
 * @swagger
 * /chats/{conversationId}/messages:
 *   post:
 *     tags: [Chats]
 *     summary: Send a message
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post("/:conversationId/messages", protect, sendMessage);

/**
 * @swagger
 * /chats/{conversationId}/seen:
 *   put:
 *     tags: [Chats]
 *     summary: Mark messages as seen
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages marked as seen
 */
router.put("/:conversationId/seen", protect, markAsSeen);

export default router;
