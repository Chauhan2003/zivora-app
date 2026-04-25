import mongoose from "mongoose";

const userFeedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true },
);

userFeedSchema.index({ userId: 1, postId: 1 }, { unique: true });
userFeedSchema.index({ userId: 1, createdAt: -1 });

const UserFeed = mongoose.model("UserFeed", userFeedSchema);
export default UserFeed;
