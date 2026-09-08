import mongoose from "mongoose";

const WithdrawalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amountUsd: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    destinationAddress: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Withdrawal ||
  mongoose.model("Withdrawal", WithdrawalSchema);