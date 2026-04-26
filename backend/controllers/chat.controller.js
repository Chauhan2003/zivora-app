import { chatService } from "../services/chat.service.js";
import { responseHandler } from "../utils/index.js";
import { asyncHandler } from "../middlewares/errorHandler.middleware.js";
import { getSocketInstance, connectedUsers } from "../configs/socket.config.js";

export const getOrCreateConversation = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { receiverId } = req.body;

  const conversation = await chatService.getOrCreateConversation(userId, receiverId);

  return responseHandler.success(res, 200, "Conversation ready", conversation);
});

export const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  const conversations = await chatService.getConversations(userId);

  return responseHandler.success(res, 200, "Conversations fetched", conversations);
});

export const getMessages = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { conversationId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;

  const messages = await chatService.getMessages(conversationId, userId, page, limit);

  return responseHandler.success(res, 200, "Messages fetched", messages);
});

export const sendMessage = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { conversationId } = req.params;
  const { text } = req.body;

  const message = await chatService.sendMessage(conversationId, userId, text);

  // Emit real-time event to the other participant
  try {
    const io = getSocketInstance();
    const conversation = await import("../models/conversation.model.js").then(
      (m) => m.default.findById(conversationId).lean(),
    );

    if (conversation) {
      const receiverId = conversation.participants.find(
        (p) => p.toString() !== userId.toString(),
      );
      const receiverSocketId = connectedUsers.get(receiverId?.toString());

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", {
          ...message,
          conversationId,
        });
      }
    }
  } catch (err) {
    console.error("Socket emit error:", err.message);
  }

  return responseHandler.success(res, 201, "Message sent", message);
});

export const markAsSeen = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { conversationId } = req.params;

  await chatService.markAsSeen(conversationId, userId);

  return responseHandler.success(res, 200, "Messages marked as seen");
});
