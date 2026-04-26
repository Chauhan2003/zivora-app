import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./configs/swagger.config.js";
import { APP } from "./constants/index.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import userRoutes from "./routes/user.route.js";
import notificationRoutes from "./routes/notification.route.js";
import chatRoutes from "./routes/chat.route.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(
  cors({
    origin: APP.CLIENT_URL?.replace(/\/$/, ""),
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use("/uploads", express.static("public/images"));

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok", app: APP.NAME, version: APP.VERSION });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/chats", chatRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
