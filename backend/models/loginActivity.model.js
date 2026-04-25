import mongoose from "mongoose";

const loginActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String, // browser/device info
    },

    location: {
      city: String,
      state: String,
      country: String,
      latitude: Number,
      longitude: Number,
    },

    loginAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const LoginActivity = mongoose.model("LoginActivity", loginActivitySchema);
export default LoginActivity;
