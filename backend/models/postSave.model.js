import mongoose from "mongoose";

const postSaveSchema = new mongoose.Schema(
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

postSaveSchema.index({ userId: 1, postId: 1 }, { unique: true });
postSaveSchema.index({ userId: 1, createdAt: -1 });
postSaveSchema.index({ postId: 1, createdAt: -1 });

const PostSave = mongoose.model("PostSave", postSaveSchema);
export default PostSave;
