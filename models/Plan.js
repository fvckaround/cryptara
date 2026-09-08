import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    tagline: {
      type: String,
      required: true,
      trim: true,
    },
    dailyRate: {
      type: Number,
      required: true,
    },
    termDays: {
      type: Number,
      required: true,
    },
    minDeposit: {
      type: Number,
      required: true,
    },
    maxDeposit: {
      type: Number,
      default: null,
    },
    popular: {
      type: Boolean,
      default: false,
    },
    features: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);