import { Server } from "socket.io";

let io;
export const connectedUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL?.replace(/\/$/, ""),
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on("register", (userId) => {
      if (!userId) return;

      connectedUsers.set(userId, socket.id);
      console.log(`✅ User ${userId} is online with socket ID: ${socket.id}`);

      // Broadcast to all clients that this user is online
      io.emit("userOnline", { userId });

      // Send the full list of online users to the newly connected client
      socket.emit("onlineUsers", Array.from(connectedUsers.keys()));
    });

    socket.on("typing", ({ conversationId, receiverId }) => {
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { conversationId });
      }
    });

    socket.on("stopTyping", ({ conversationId, receiverId }) => {
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", { conversationId });
      }
    });

    socket.on("messageSeen", ({ conversationId, receiverId }) => {
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageSeen", { conversationId });
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          io.emit("userOffline", { userId });
          console.log(`❌ User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

export const getSocketInstance = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};
