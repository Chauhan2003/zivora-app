import express from "express";
import { getFeedPosts, createPost, getPostById, deletePost, toggleLike, generateCaption, getPostsByUsername } from "../controllers/post.controller.js";
import protect from "../middlewares/protect.middleware.js";
import upload from "../middlewares/cloudinaryUpload.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /posts/feed:
 *   get:
 *     tags: [Posts]
 *     summary: Get feed posts
 *     description: Get posts from followed users and public posts
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: Feed posts fetched successfully
 */
router.get("/feed", protect, getFeedPosts);

/**
 * @swagger
 * /posts/create:
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - caption
 *             properties:
 *               caption:
 *                 type: string
 *               mediaUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *               visibility:
 *                 type: string
 *                 enum: [PUBLIC, PRIVATE]
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post("/create", protect, createPost);

/**
 * @swagger
 * /posts:
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post with image upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               postImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 format: binary
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post("/", protect, upload.array("postImages", 10), createPost);

/**
 * @swagger
 * /posts/generate/caption:
 *   post:
 *     tags: [Posts]
 *     summary: Generate caption using AI
 *     description: Generate a caption for a post using AI
 *     responses:
 *       200:
 *         description: Caption generated successfully
 */
router.post("/generate/caption", protect, generateCaption);

/**
 * @swagger
 * /posts/:postId:
 *   get:
 *     tags: [Posts]
 *     summary: Get post by ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post fetched successfully
 */
router.get("/:postId", protect, getPostById);

/**
 * @swagger
 * /posts/:postId:
 *   delete:
 *     tags: [Posts]
 *     summary: Delete a post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router.delete("/:postId", protect, deletePost);

/**
 * @swagger
 * /posts/:postId/like:
 *   put:
 *     tags: [Posts]
 *     summary: Toggle like/unlike on a post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like toggled successfully
 */
router.put("/:postId/like", protect, toggleLike);

/**
 * @swagger
 * /posts/profile/:username:
 *   get:
 *     tags: [Posts]
 *     summary: Get posts by username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 */
router.get("/profile/:username", protect, getPostsByUsername);

export default router;
