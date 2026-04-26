import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Profile from "../models/profile.model.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../constants/index.js";

export const chatService = {
  /**
   * Get or create a conversation between two users
   */
  async getOrCreateConversation(userId, receiverId) {
    if (userId.toString() === receiverId.toString()) {
      throw new Error("Cannot message yourself", {
        cause: HTTP_STATUS.BAD_REQUEST,
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId], $size: 2 },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, receiverId],
      });
    }

    return conversation;
  },

  /**
   * Get all conversations for a user with last message and participant info
   */
  async getConversations(userId) {
    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({ lastMessageAt: -1 })
      .lean();

    const results = [];

    for (const conv of conversations) {
      const otherUserId = conv.participants.find(
        (p) => p.toString() !== userId.toString(),
      );

      const profile = await Profile.findOne({ userId: otherUserId })
        .select("fullName avatar")
        .lean();

      const { default: User } = await import("../models/user.model.js");
      const user = await User.findById(otherUserId)
        .select("username")
        .lean();

      let lastMessage = null;
      if (conv.lastMessage) {
        lastMessage = await Message.findById(conv.lastMessage)
          .select("text senderId seen createdAt")
          .lean();
      }

      const unreadCount = await Message.countDocuments({
        conversationId: conv._id,
        senderId: { $ne: userId },
        seen: false,
      });

      results.push({
        _id: conv._id,
        user: {
          _id: otherUserId,
          username: user?.username || null,
          fullName: profile?.fullName || null,
          avatar: profile?.avatar || null,
        },
        lastMessage: lastMessage
          ? {
              text: lastMessage.text,
              senderId: lastMessage.senderId,
              seen: lastMessage.seen,
              createdAt: lastMessage.createdAt,
            }
          : null,
        unreadCount,
        lastMessageAt: conv.lastMessageAt,
      });
    }

    return results;
  },

  /**
   * Get messages for a conversation with pagination
   */
  async getMessages(conversationId, userId, page = 1, limit = 30) {
    const conversation = await Conversation.findById(conversationId).lean();

    if (!conversation) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND, {
        cause: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (!conversation.participants.some((p) => p.toString() === userId.toString())) {
      throw new Error(ERROR_MESSAGES.FORBIDDEN, {
        cause: HTTP_STATUS.FORBIDDEN,
      });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return messages.reverse();
  },

  /**
   * Send a message
   */
  async sendMessage(conversationId, senderId, text, mediaUrl = null) {
    const conversation = await Conversation.findById(conversationId).lean();

    if (!conversation) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND, {
        cause: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (!conversation.participants.some((p) => p.toString() === senderId.toString())) {
      throw new Error(ERROR_MESSAGES.FORBIDDEN, {
        cause: HTTP_STATUS.FORBIDDEN,
      });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      text: text || "",
      mediaUrl,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: message.createdAt,
    });

    return message.toObject();
  },

  /**
   * Mark messages as seen
   */
  async markAsSeen(conversationId, userId) {
    await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: userId },
        seen: false,
      },
      { seen: true },
    );
  },
};
