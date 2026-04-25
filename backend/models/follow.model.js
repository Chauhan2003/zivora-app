import mongoose from "mongoose";

const followsSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED"],
      default: "ACCEPTED",
    },
  },
  { timestamps: true },
);

followsSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
followsSchema.index({ followingId: 1, createdAt: -1 });
followsSchema.index({ followerId: 1, createdAt: -1 });

const Follows = mongoose.model("Follow", followsSchema);
export default Follows;
