import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import LoginActivity from "../models/loginActivity.model.js";
import { JWT, BCRYPT, STATUS, HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";

/**
 * Authentication Service
 * Handles all authentication-related business logic
 */

export const authService = {
  /**
   * Check if username is available
   * @param {string} username - Username to check
   * @returns {Promise<Object>} Availability result
   */
  async checkUsernameAvailability(username) {
    const normalizedUsername = username?.trim().toLowerCase();
    const exists = await User.exists({ username: normalizedUsername });

    return {
      available: !exists,
      message: exists ? "Username already taken" : "Username is available",
    };
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user data
   */
  async registerUser(userData) {
    const { fullName, username, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      throw new Error(`${field} already exists`, { cause: HTTP_STATUS.CONFLICT });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT.SALT_ROUNDS);

    // Create user
    const user = await User.create({ username, email, passwordHash: hashedPassword });

    // Create profile
    await Profile.create({ userId: user._id, fullName });

    return user;
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.usernameOrEmail - Username or email
   * @param {string} credentials.password - Password
   * @param {Object} credentials.location - User location
   * @param {string} ipAddress - User IP address
   * @param {string} userAgent - User agent string
   * @returns {Promise<Object>} Login result with token and user data
   */
  async loginUser(credentials, ipAddress, userAgent) {
    const { usernameOrEmail, password, location } = credentials;

    // Find user
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS, {
        cause: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    // Check if account is deactivated
    if (user.isDeleted) {
      throw new Error(ERROR_MESSAGES.ACCOUNT_DEACTIVATED, {
        cause: HTTP_STATUS.FORBIDDEN,
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS, {
        cause: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    // Check if account is verified
    if (!user.isVerified) {
      throw new Error(ERROR_MESSAGES.ACCOUNT_NOT_VERIFIED, {
        cause: HTTP_STATUS.FORBIDDEN,
      });
    }

    // Get user profile
    const profile = await Profile.findOne({ userId: user._id })
      .select("fullName avatar")
      .lean();

    // Log login activity
    await LoginActivity.create({
      userId: user._id,
      ipAddress,
      userAgent,
      location: location
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
            city: location.city,
            state: location.state,
            country: location.country,
          }
        : undefined,
    });

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
      JWT.SECRET,
      { expiresIn: JWT.EXPIRES_IN },
    );

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: profile?.fullName || null,
        avatar: profile?.avatar || null,
      },
      accessToken,
    };
  },

  /**
   * Generate JWT token
   * @param {Object} payload - Token payload
   * @returns {string} JWT token
   */
  generateToken(payload) {
    return jwt.sign(payload, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN });
  },

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    return jwt.verify(token, JWT.SECRET);
  },

  /**
   * Hash password
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  async hashPassword(password) {
    return bcrypt.hash(password, BCRYPT.SALT_ROUNDS);
  },

  /**
   * Compare password
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @returns {Promise<boolean>} Password match result
   */
  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  },
};
