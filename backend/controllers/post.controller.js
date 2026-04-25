import { postService } from "../services/index.js";
import { responseHandler } from "../utils/index.js";
import { asyncHandler } from "../middlewares/errorHandler.middleware.js";
import { uploadMultipleToCloudinary } from "../utils/cloudinaryUpload.util.js";

/**
 * Get feed posts
 * @route GET /api/v1/posts/feed
 */
export const getFeedPosts = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await postService.getFeedPosts(userId, page, limit);

  return responseHandler.success(res, 200, "Feed posts fetched successfully", result.posts, {
    pagination: result.pagination,
  });
});

/**
 * Create a new post
 * @route POST /api/v1/posts/create
 */
export const createPost = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  let mediaUrls = [];

  // Upload images to Cloudinary if files are provided
  if (req.files && req.files.length > 0) {
    try {
      mediaUrls = await uploadMultipleToCloudinary(req.files);
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return responseHandler.error(res, 500, "Failed to upload images");
    }
  } else if (req.body.mediaUrls) {
    // Use provided media URLs (for testing or external URLs)
    mediaUrls = Array.isArray(req.body.mediaUrls) ? req.body.mediaUrls : [req.body.mediaUrls];
  }

  // Map frontend field names to backend model
  const postData = {
    userId,
    caption: req.body.caption,
    mediaUrls,
    visibility: req.body.visibility || "PUBLIC",
  };

  const post = await postService.createPost(postData);

  return responseHandler.created(res, "Post created successfully", post);
});

/**
 * Get post by ID
 * @route GET /api/v1/posts/:postId
 */
export const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?.userId;

  const post = await postService.getPostById(postId, userId);

  return responseHandler.success(res, 200, "Post fetched successfully", post);
});

/**
 * Delete a post
 * @route DELETE /api/v1/posts/:postId
 */
export const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?.userId;

  await postService.deletePost(postId, userId);

  return responseHandler.success(res, 200, "Post deleted successfully");
});

/**
 * Toggle like/unlike on a post
 * @route PUT /api/v1/posts/:postId/like
 */
export const toggleLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?.userId;

  const result = await postService.toggleLike(postId, userId);

  return responseHandler.success(res, 200, "Like toggled successfully", result);
});

/**
 * Generate caption using AI
 * @route POST /api/v1/posts/generate/caption
 */
export const generateCaption = asyncHandler(async (req, res) => {
  // This is a placeholder for AI caption generation
  // In a real implementation, you would integrate with an AI service like OpenAI
  const captions = [
    "Just captured this beautiful moment! ✨",
    "Living my best life 🌟",
    "New memories made today 📸",
    "Feeling grateful for this moment ❤️",
    "Simple pleasures of life 🌸",
    "Making every moment count ⏰",
    "Cherishing these little things 💫",
    "Life is beautiful when you appreciate it 🌈",
  ];

  const randomCaption = captions[Math.floor(Math.random() * captions.length)];

  return responseHandler.success(res, 200, "Caption generated successfully", randomCaption);
});

/**
 * Get posts by username
 * @route GET /api/v1/posts/profile/:username
 */
export const getPostsByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const userId = req.user?.userId;

  const posts = await postService.getPostsByUsername(username, userId);

  return responseHandler.success(res, 200, "Posts fetched successfully", posts);
});
