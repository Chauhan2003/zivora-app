import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Follow from "../models/follow.model.js";
import LoginActivity from "../models/loginActivity.model.js";
import { STATUS, HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";

/**
 * User Service
 * Handles all user-related business logic
 */

export const userService = {
  /**
   * Get current user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser(userId) {
    const user = await User.findById(userId).select("username email").lean();
    if (!user) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND, {
        cause: HTTP_STATUS.NOT_FOUND,
      });
    }

    const profile = await Profile.findOne({ userId }).select("fullName avatar").lean();
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: profile?.fullName || null,
      avatar: profile?.avatar || null,
    };
  },

  /**
   * Get user by username
   * @param {string} username - Username
   * @param {string} currentUserId - Current user ID (optional)
   * @returns {Promise<Object>} User data
   */
  async getUserByUsername(username, currentUserId = null) {
    const user = await User.findOne({ username }).select("username").lean();
    if (!user) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND, {
        cause: HTTP_STATUS.NOT_FOUND,
      });
    }

    const profile = await Profile.findOne({ userId: user._id })
      .select("fullName bio avatar website gender postCount followerCount followingCount visibility")
      .lean();

    // Get follow status if currentUserId is provided
    let followStatus = 0; // 0 = not following, 1 = requested, 2 = following
    if (currentUserId) {
      const follow = await Follow.findOne({
        followerId: currentUserId,
        followingId: user._id,
      });
      if (follow) {
        followStatus = follow.status === "PENDING" ? 1 : 2;
      }
    }

    return {
      _id: user._id,
      username: user.username,
      profile: {
        fullName: profile?.fullName || null,
        bio: profile?.bio || null,
        avatar: profile?.avatar || null,
        website: profile?.website || null,
        gender: profile?.gender || "",
        postCount: profile?.postCount || 0,
        followerCount: profile?.followerCount || 0,
        followingCount: profile?.followingCount || 0,
        visibility: profile?.visibility || "PUBLIC",
      },
      followStatus,
    };
  },

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(userId, updateData) {
    const profile = await Profile.findOneAndUpdate({ userId }, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!profile) {
      throw new Error(ERROR_MESSAGES.NOT_FOUND, {
        cause: HTTP_STATUS.NOT_FOUND,
      });
    }

    return profile;
  },

  /**
   * Get suggested users
   * @param {string} userId - Current user ID
   * @param {number} limit - Number of users to return
   * @returns {Promise<Array>} Suggested users with mutual friend count and location proximity
   */
  async getSuggestedUsers(userId, limit = 10) {
    // Get users that current user is not following
    const following = await Follow.find({ followerId: userId }).select(
      "followingId",
    );
    const followingIds = following.map((f) => f.followingId);

    // Get current user's latest location
    const currentLogin = await LoginActivity.findOne({ userId })
      .sort({ loginAt: -1 })
      .select("location")
      .lean();

    const currentLocation = currentLogin?.location;

    // Get all users that current user is not following
    const allUsers = await User.find({
      _id: { $ne: userId, $nin: followingIds },
      isDeleted: false,
    })
      .select("username")
      .lean();

    // Calculate scores for each user based on:
    // 1. Mutual friends count
    // 2. Location proximity
    const usersWithScores = await Promise.all(
      allUsers.map(async (user) => {
        // Get mutual friends count
        const userFollowing = await Follow.find({
          followerId: user._id,
        }).select("followingId");
        const userFollowingIds = userFollowing.map((f) => f.followingId);
        const mutualFriends = followingIds.filter((id) =>
          userFollowingIds.includes(id.toString()),
        );
        const mutualFriendCount = mutualFriends.length;

        // Get user's latest location
        const userLogin = await LoginActivity.findOne({ userId: user._id })
          .sort({ loginAt: -1 })
          .select("location")
          .lean();

        const userLocation = userLogin?.location;

        // Calculate location proximity score (closer = higher score)
        let locationScore = 0;
        if (currentLocation && userLocation) {
          // Simple proximity check: same country > same state > same city
          if (currentLocation.country === userLocation.country) {
            locationScore += 1;
            if (currentLocation.state === userLocation.state) {
              locationScore += 2;
              if (currentLocation.city === userLocation.city) {
                locationScore += 3;
              }
            }
          }
        }

        // Total score: mutual friends (weighted more) + location proximity
        const score = mutualFriendCount * 2 + locationScore;

        const profile = await Profile.findOne({ userId: user._id })
          .select("fullName avatar")
          .lean();

        return {
          _id: user._id,
          username: user.username,
          profile: {
            fullName: profile?.fullName || null,
            avatar: profile?.avatar || null,
          },
          score,
        };
      }),
    );

    // Sort by score and return top users
    const suggestedUsers = usersWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return suggestedUsers;
  },

  /**
   * Search users
   * @param {string} query - Search query
   * @param {number} limit - Number of results
   * @returns {Promise<Array>} Search results
   */
  async searchUsers(query, excludeUserId = null, limit = 20) {
    if (!query) {
      return [];
    }

    const searchQuery = {
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
      isDeleted: false,
    };

    // Exclude current user from search results
    if (excludeUserId) {
      searchQuery._id = { $ne: excludeUserId };
    }

    const users = await User.find(searchQuery)
      .select("username")
      .limit(limit)
      .lean();

    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await Profile.findOne({ userId: user._id })
          .select("fullName avatar")
          .lean();
        return {
          _id: user._id,
          username: user.username,
          profile: {
            fullName: profile?.fullName || null,
            avatar: profile?.avatar || null,
          },
        };
      }),
    );

    return usersWithProfiles;
  },

  /**
   * Follow a user
   * @param {string} followerId - Follower user ID
   * @param {string} followingId - User to follow ID
   * @returns {Promise<Object>} Follow relationship
   */
  async followUser(followerId, followingId) {
    if (followerId === followingId) {
      throw new Error("Cannot follow yourself", {
        cause: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const existingFollow = await Follow.findOne({ followerId, followingId });
    if (existingFollow) {
      throw new Error("Already following this user", {
        cause: HTTP_STATUS.CONFLICT,
      });
    }

    const follow = await Follow.create({ followerId, followingId, status: "ACCEPTED" });

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

    // Create notification for direct follow
    const Notification = (await import("../models/notification.model.js")).default;
    await Notification.create({
      recipientId: followingId,
      actorId: followerId,
      type: "FOLLOW",
      entityType: "USER",
      entityId: followingId,
    });

    return follow;
  },

  /**
   * Send follow request
   * @param {string} followerId - Follower user ID
   * @param {string} followingId - User to follow ID
   * @returns {Promise<Object>} Follow relationship
   */
  async sendFollowRequest(followerId, followingId) {
    if (followerId === followingId) {
      throw new Error("Cannot follow yourself", {
        cause: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const existingFollow = await Follow.findOne({ followerId, followingId });
    if (existingFollow) {
      throw new Error("Already following or request sent", {
        cause: HTTP_STATUS.CONFLICT,
      });
    }

    const follow = await Follow.create({ followerId, followingId, status: "PENDING" });

    // Create notification for follow request
    const Notification = (await import("../models/notification.model.js")).default;
    await Notification.create({
      recipientId: followingId,
      actorId: followerId,
      type: "FOLLOW_REQUEST",
      entityType: "USER",
      entityId: followingId,
    });

    return follow;
  },

  /**
   * Unfollow a user
   * @param {string} followerId - Follower user ID
   * @param {string} followingId - User to unfollow ID
   * @returns {Promise<Object>} Result
   */
  async unfollowUser(followerId, followingId) {
    const follow = await Follow.findOne({ followerId, followingId });
    if (!follow) {
      throw new Error("Not following this user", {
        cause: HTTP_STATUS.NOT_FOUND,
      });
    }

    // Decrement follower count for the user being unfollowed
    await Profile.findOneAndUpdate(
      { userId: followingId },
      { $inc: { followerCount: -1 } }
    );

    // Decrement following count for the user who is unfollowing
    await Profile.findOneAndUpdate(
      { userId: followerId },
      { $inc: { followingCount: -1 } }
    );

    await Follow.deleteOne({ followerId, followingId });
    return { success: true };
  },

  /**
   * Get saved posts
   * @returns {Promise<Array>} Saved posts
   */
  async getSavedPosts(userId) {
    const PostSave = (await import("../models/postSave.model.js")).default;
    const Post = (await import("../models/post.model.js")).default;

    const savedPosts = await PostSave.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const postsWithDetails = await Promise.all(
      savedPosts.map(async (savedPost) => {
        const post = await Post.findById(savedPost.postId)
          .select("mediaUrls likeCount")
          .lean();
        if (!post || post.isDeleted) return null;

        return {
          _id: post._id,
          mediaUrls: post.mediaUrls,
          likeCount: post.likeCount || 0,
        };
      })
    );

    return postsWithDetails.filter(post => post !== null);
  },
};
