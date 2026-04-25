import Post from "../models/post.model.js";
import Follow from "../models/follow.model.js";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Like from "../models/postLike.model.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";

/**
 * Post Service
 * Handles all post-related business logic
 */

export const postService = {
  /**
   * Get feed posts for a user
   * @param {string} userId - Current user ID
   * @param {number} page - Page number
   * @param {number} limit - Number of posts per page
   * @returns {Promise<Object>} Feed posts with pagination info
   */
  async getFeedPosts(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // Get users that current user follows
    const follows = await Follow.find({ followerId: userId }).select("followingId");
    const followingIds = follows.map((f) => f.followingId);

    // Include user's own posts in the feed
    const feedUserIds = [...followingIds, userId];

    // Get posts from followed users, user's own posts, and public posts
    const posts = await Post.find({
      $or: [
        { userId: { $in: feedUserIds } },
        { visibility: "PUBLIC" },
      ],
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalPosts = await Post.countDocuments({
      $or: [
        { userId: { $in: feedUserIds } },
        { visibility: "PUBLIC" },
      ],
      isDeleted: false,
    });

    // Populate posts with user info and map fields to match frontend
    const postsWithUserInfo = await Promise.all(
      posts.map(async (post) => {
        const user = await User.findById(post.userId).select("username").lean();
        const profile = await Profile.findOne({ userId: post.userId })
          .select("fullName avatar")
          .lean();
        const isLiked = await this.hasUserLiked(post._id, userId);

        return {
          _id: post._id,
          caption: post.caption,
          mediaUrls: post.mediaUrls,
          likeCount: post.likeCount,
          commentCount: post.commentCount,
          createdAt: post.createdAt,
          isLiked,
          user: {
            username: user?.username,
            fullName: profile?.fullName || null,
            avatar: profile?.avatar || null,
          },
        };
      }),
    );

    return {
      posts: postsWithUserInfo,
      pagination: {
        page,
        limit,
        total: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        hasNextPage: page * limit < totalPosts,
        hasPrevPage: page > 1,
      },
    };
  },

  /**
   * Create a new post
   * @param {Object} postData - Post data
   * @param {string} postData.userId - User ID
   * @param {string} postData.caption - Post caption
   * @param {Array} postData.mediaUrls - Array of media URLs
   * @param {string} postData.visibility - Post visibility
   * @returns {Promise<Object>} Created post
   */
  async createPost(postData) {
    const post = await Post.create(postData);

    // Increment post count for the user's profile
    await Profile.findOneAndUpdate(
      { userId: postData.userId },
      { $inc: { postCount: 1 } }
    );

    return post;
  },

  /**
   * Get post by ID
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} Post data
   */
  async getPostById(postId, userId) {
    const post = await Post.findById(postId)
      .select("userId caption mediaUrls likeCount commentCount createdAt")
      .lean();
    if (!post) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND, {
        cause: HTTP_STATUS.NOT_FOUND,
      });
    }

    const user = await User.findById(post.userId).select("username").lean();
    const profile = await Profile.findOne({ userId: post.userId })
      .select("fullName avatar")
      .lean();
    const isLiked = userId ? await this.hasUserLiked(postId, userId) : false;

    return {
      _id: post._id,
      caption: post.caption,
      mediaUrls: post.mediaUrls,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt,
      isLiked,
      user: {
        username: user?.username,
        fullName: profile?.fullName || null,
        avatar: profile?.avatar || null,
      },
    };
  },

  /**
   * Delete a post
   * @param {string} postId - Post ID
   * @param {string} userId - User ID (for authorization)
   * @returns {Promise<Object>} Result
   */
  async deletePost(postId, userId) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND, {
        cause: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (post.userId.toString() !== userId.toString()) {
      throw new Error(ERROR_MESSAGES.FORBIDDEN, {
        cause: HTTP_STATUS.FORBIDDEN,
      });
    }

    // Decrement post count for the user's profile
    await Profile.findOneAndUpdate(
      { userId: post.userId },
      { $inc: { postCount: -1 } }
    );

    await Post.findByIdAndUpdate(postId, { isDeleted: true });
    return { success: true };
  },

  /**
   * Toggle like/unlike on a post
   * @param {string} postId - Post ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Result with isLiked status and total likes
   */
  async toggleLike(postId, userId) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND, {
        cause: HTTP_STATUS.NOT_FOUND,
      });
    }

    const existingLike = await Like.findOne({ userId, postId });

    if (existingLike) {
      // Unlike: remove the like and decrement count
      await Like.deleteOne({ userId, postId });
      await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });
      const updatedPost = await Post.findById(postId);

      // Delete the like notification if it exists
      if (post.userId.toString() !== userId.toString()) {
        const Notification = (await import("../models/notification.model.js")).default;
        await Notification.deleteOne({
          recipientId: post.userId,
          actorId: userId,
          type: "LIKE_POST",
          entityId: postId,
        });
      }

      return {
        isLiked: false,
        totalLikes: updatedPost.likeCount,
      };
    } else {
      // Like: add the like and increment count
      await Like.create({ userId, postId });
      await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });
      const updatedPost = await Post.findById(postId);

      // Create notification if liking someone else's post
      if (post.userId.toString() !== userId.toString()) {
        const Notification = (await import("../models/notification.model.js")).default;
        await Notification.create({
          recipientId: post.userId,
          actorId: userId,
          type: "LIKE_POST",
          entityType: "POST",
          entityId: postId,
          metadata: { postCaption: post.caption },
        });
      }

      return {
        isLiked: true,
        totalLikes: updatedPost.likeCount,
      };
    }
  },

  /**
   * Check if user has liked a post
   * @param {string} postId - Post ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Whether user has liked the post
   */
  async hasUserLiked(postId, userId) {
    const like = await Like.findOne({ userId, postId });
    return !!like;
  },

  /**
   * Get posts by username
   * @param {string} username - Username
   * @param {string} userId - Current user ID
   * @returns {Promise<Array>} Posts by username
   */
  async getPostsByUsername(username, userId) {
    const user = await User.findOne({ username }).select("username").lean();
    if (!user) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND, {
        cause: HTTP_STATUS.NOT_FOUND,
      });
    }

    const profile = await Profile.findOne({ userId: user._id })
      .select("fullName avatar")
      .lean();

    const posts = await Post.find({
      userId: user._id,
      isDeleted: false,
    })
      .select("caption mediaUrls likeCount commentCount createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // Populate posts with like status
    const postsWithUserInfo = await Promise.all(
      posts.map(async (post) => {
        const isLiked = userId ? await this.hasUserLiked(post._id, userId) : false;

        return {
          _id: post._id,
          caption: post.caption,
          mediaUrls: post.mediaUrls,
          likeCount: post.likeCount,
          commentCount: post.commentCount,
          createdAt: post.createdAt,
          isLiked,
          user: {
            username: user.username,
            fullName: profile?.fullName || null,
            avatar: profile?.avatar || null,
          },
        };
      }),
    );

    return postsWithUserInfo;
  },
};
