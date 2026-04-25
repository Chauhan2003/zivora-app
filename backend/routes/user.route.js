import express from "express";
import {
  getCurrentUser,
  getUserByUsername,
  getSuggestedUsers,
  updateProfile,
  updatePrivacy,
  searchUsers,
  followUser,
  unfollowUser,
  updateFollowRequest,
  getSavedPosts,
  sendFollowRequest,
} from "../controllers/user.controller.js";
import protect from "../middlewares/protect.middleware.js";
import upload from "../middlewares/cloudinaryUpload.middleware.js";

// Optional upload middleware - only processes file if present
const optionalUpload = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    // Ignore "LIMIT_UNEXPECTED_FILE" error (no file uploaded)
    if (err && err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next();
    }
    next(err);
  });
};

const router = express.Router();

/**
 * @swagger
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user
 *     responses:
 *       200:
 *         description: Current user fetched successfully
 */
router.get("/me", protect, getCurrentUser);

/**
 * @swagger
 * /users/suggested-users:
 *   post:
 *     tags: [Users]
 *     summary: Get suggested users
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limit:
 *                 type: integer
 *                 default: 10
 *     responses:
 *       200:
 *         description: Suggested users fetched successfully
 */
router.post("/suggested-users", protect, getSuggestedUsers);

/**
 * @swagger
 * /users/search:
 *   get:
 *     tags: [Users]
 *     summary: Search users
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Users found successfully
 */
router.get("/search", protect, searchUsers);

/**
 * @swagger
 * /users/profile/:username:
 *   get:
 *     tags: [Users]
 *     summary: Get user profile by username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 */
router.get("/profile/:username", protect, getUserByUsername);

/**
 * @swagger
 * /users/:username:
 *   get:
 *     tags: [Users]
 *     summary: Get user by username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User fetched successfully
 */
router.get("/:username", protect, getUserByUsername);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *               fullName:
 *                 type: string
 *               bio:
 *                 type: string
 *               website:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put("/profile", protect, optionalUpload("profileImage"), updateProfile);

/**
 * @swagger
 * /users/privacy:
 *   put:
 *     tags: [Users]
 *     summary: Update account privacy
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - visibility
 *             properties:
 *               visibility:
 *                 type: string
 *                 enum: [PUBLIC, PRIVATE]
 *     responses:
 *       200:
 *         description: Privacy updated successfully
 */
router.put("/privacy", protect, updatePrivacy);

/**
 * @swagger
 * /users/:userId/follow:
 *   post:
 *     tags: [Users]
 *     summary: Follow a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User followed successfully
 */
router.post("/:userId/follow", protect, followUser);

/**
 * @swagger
 * /users/follow-request:
 *   post:
 *     tags: [Users]
 *     summary: Send follow request
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
 *         description: Follow request sent successfully
 */
router.post("/follow-request", protect, sendFollowRequest);

/**
 * @swagger
 * /users/unfollow/:userId:
 *   delete:
 *     tags: [Users]
 *     summary: Unfollow a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 */
router.delete("/unfollow/:userId", protect, unfollowUser);

/**
 * @swagger
 * /users/:userId/follow:
 *   delete:
 *     tags: [Users]
 *     summary: Unfollow a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 */
router.delete("/:userId/follow", protect, unfollowUser);

/**
 * @swagger
 * /users/update/follow-request/:notificationId/:action:
 *   put:
 *     tags: [Users]
 *     summary: Update follow request status
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Follow request updated successfully
 */
router.put(
  "/update/follow-request/:notificationId/:action",
  protect,
  updateFollowRequest,
);

/**
 * @swagger
 * /users/:userId/saved/post/list/all:
 *   get:
 *     tags: [Users]
 *     summary: Get all saved posts for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Saved posts fetched successfully
 */
router.get("/:userId/saved/post/list/all", protect, getSavedPosts);

export default router;
