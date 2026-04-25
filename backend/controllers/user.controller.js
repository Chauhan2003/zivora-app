import { userService } from "../services/index.js";
import { responseHandler } from "../utils/index.js";
import { asyncHandler } from "../middlewares/errorHandler.middleware.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.util.js";

/**
 * Get current user
 * @route GET /api/v1/users/me
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  const user = await userService.getCurrentUser(userId);

  return responseHandler.success(res, 200, "User fetched successfully", user);
});

/**
 * Get user by username
 * @route GET /api/v1/users/:username
 */
export const getUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const userId = req.user?.userId;

  const user = await userService.getUserByUsername(username, userId);

  return responseHandler.success(res, 200, "User fetched successfully", user);
});

/**
 * Get suggested users
 * @route POST /api/v1/users/suggested-users
 */
export const getSuggestedUsers = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const limit = req.body?.limit || 10;

  const users = await userService.getSuggestedUsers(userId, limit);

  return responseHandler.success(res, 200, "Suggested users fetched successfully", users);
});

/**
 * Update user profile
 * @route PUT /api/v1/users/profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const updateData = req.body;

  // If image file is uploaded and has content, upload to Cloudinary first
  if (req.file && req.file.buffer && req.file.buffer.length > 0) {
    const avatarUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    updateData.avatar = avatarUrl;
  }

  // Remove visibility from profile update - use separate privacy endpoint
  delete updateData.visibility;

  const profile = await userService.updateProfile(userId, updateData);

  return responseHandler.success(res, 200, "Profile updated successfully", {
    fullName: profile.fullName || null,
    avatar: profile.avatar || null,
    bio: profile.bio || null,
    website: profile.website || null,
    gender: profile.gender || "",
  });
});

/**
 * Update account privacy
 * @route PUT /api/v1/users/privacy
 */
export const updatePrivacy = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { visibility } = req.body;

  if (!["PUBLIC", "PRIVATE"].includes(visibility)) {
    throw new Error("Invalid visibility value", {
      cause: HTTP_STATUS.BAD_REQUEST,
    });
  }

  const profile = await userService.updateProfile(userId, { visibility });

  return responseHandler.success(res, 200, "Privacy updated successfully", {
    visibility: profile.visibility,
  });
});

/**
 * Search users
 * @route GET /api/v1/users/search
 */
export const searchUsers = asyncHandler(async (req, res) => {
  const query = req.query.q;
  const limit = parseInt(req.query.limit) || 20;
  const userId = req.user?.userId;

  if (!query) {
    return responseHandler.success(res, 200, "No query provided", []);
  }

  const users = await userService.searchUsers(query, userId, limit);

  return responseHandler.success(res, 200, "Users found successfully", users);
});

/**
 * Follow a user
 * @route POST /api/v1/users/:userId/follow
 */
export const followUser = asyncHandler(async (req, res) => {
  const followerId = req.user?.userId;
  const { userId: followingId } = req.params;

  const follow = await userService.followUser(followerId, followingId);

  return responseHandler.success(res, 200, "User followed successfully", follow);
});

/**
 * Send follow request
 * @route POST /api/v1/users/follow-request
 */
export const sendFollowRequest = asyncHandler(async (req, res) => {
  const followerId = req.user?.userId;
  const { receiverId } = req.body;

  const follow = await userService.sendFollowRequest(followerId, receiverId);

  return responseHandler.success(res, 200, "Follow request sent successfully", follow);
});

/**
 * Unfollow a user
 * @route DELETE /api/v1/users/:userId/follow
 */
export const unfollowUser = asyncHandler(async (req, res) => {
  const followerId = req.user?.userId;
  const { userId: followingId } = req.params;

  const result = await userService.unfollowUser(followerId, followingId);

  return responseHandler.success(res, 200, "User unfollowed successfully", result);
});

/**
 * Update follow request status
 * @route PUT /api/v1/users/update/follow-request/:notificationId/:action
 */
export const updateFollowRequest = asyncHandler(async (req, res) => {
  const { notificationId, action } = req.params;
  const userId = req.user?.userId;

  const Notification = (await import("../models/notification.model.js")).default;
  const Follow = (await import("../models/follow.model.js")).default;

  // Find notification to get the requester's ID
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new Error(ERROR_MESSAGES.NOT_FOUND, {
      cause: HTTP_STATUS.NOT_FOUND,
    });
  }

  // Verify the notification belongs to the current user
  if (notification.recipientId.toString() !== userId.toString()) {
    throw new Error(ERROR_MESSAGES.FORBIDDEN, {
      cause: HTTP_STATUS.FORBIDDEN,
    });
  }

  const followerId = notification.actorId;
  const followingId = notification.recipientId;

  if (action === "accepted") {
    // Update follow status to ACCEPTED
    await Follow.findOneAndUpdate(
      { followerId, followingId },
      { status: "ACCEPTED" }
    );
    
    // Increment follower count for the user being followed
    await Profile.findOneAndUpdate(
      { userId: followingId },
      { $inc: { followerCount: 1 } }
    );
    
    // Increment following count for the user who is following
    await Profile.findOneAndUpdate(
      { userId: followerId },
      { $inc: { followingCount: 1 } }
    );
    
    // Update notification type from FOLLOW_REQUEST to FOLLOW
    await Notification.findByIdAndUpdate(notificationId, { 
      type: "FOLLOW",
      isRead: true 
    });
    
    return responseHandler.success(res, 200, "Follow request accepted");
  } else if (action === "declined") {
    // Delete the follow request
    await Follow.deleteOne({ followerId, followingId });
    
    // Delete the notification since action was declined
    await Notification.findByIdAndDelete(notificationId);
    
    return responseHandler.success(res, 200, "Follow request declined");
  }

  return responseHandler.success(res, 200, "Follow request updated");
});

/**
 * Get saved posts for a user
 * @route GET /api/v1/users/:userId/saved/post/list/all
 */
export const getSavedPosts = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const posts = await userService.getSavedPosts(userId);

  return responseHandler.success(res, 200, "Saved posts fetched successfully", posts);
});
