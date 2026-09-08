import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planName: {
      type: String,
      required: true,
      trim: true,
    },
    amountUsd: {
      type: Number,
      required: true,
      min: 1,
    },
    dailyRate: {
      type: Number,
      required: true,
    },
    termDays: {
      type: Number,
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endsAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "withdrawn"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Investment ||
  mongoose.model("Investment", InvestmentSchema);