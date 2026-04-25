import "dotenv/config";
import http from "http";
import app from "./app.js";
import connectDatabase from "./configs/database.config.js";
import { connectCloudinary } from "./configs/cloudinary.config.js";
import { initSocket } from "./configs/socket.config.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  connectCloudinary();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      const { default: mongoose } = await import("mongoose");
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
