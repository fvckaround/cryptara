import mongoose from "mongoose";

const DepositSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    currency: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    amountUsd: {
      type: Number,
      required: true,
      min: 1,
    },
    transactionReference: {
      type: String,
      trim: true,
      default: null,
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
  },
  { timestamps: true }
);

export default mongoose.models.Deposit ||
  mongoose.model("Deposit", DepositSchema);