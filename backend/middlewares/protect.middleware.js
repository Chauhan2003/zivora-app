import jwt from "jsonwebtoken";
import { FAILURE } from "../constants/constant.js";
import User from "../models/user.model.js";

const protect = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        status: FAILURE,
        message: "JWT secret is not configured",
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: FAILURE,
        message: "Authorization token missing or malformed",
      });
    }

    const token = authHeader.slice("Bearer ".length).trim();

    if (!token) {
      return res.status(401).json({
        status: FAILURE,
        message: "Authorization token missing or malformed",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return res.status(401).json({
        status: FAILURE,
        message: "Invalid token payload",
      });
    }

    const user = await User.findById(decoded.userId)
      .select("-passwordHash")
      .lean();

    if (!user) {
      return res.status(401).json({
        status: FAILURE,
        message: "User not found",
      });
    }

    if (user.isDeleted) {
      return res.status(403).json({
        status: FAILURE,
        message: "Account has been deactivated. Please contact support.",
      });
    }

    req.user = {
      userId: user._id,
      username: user.username,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    
    let message = "Invalid token";
    if (error.name === "TokenExpiredError") {
      message = "Token expired";
    }

    return res.status(401).json({
      status: FAILURE,
      message,
    });
  }
};

export default protect;
