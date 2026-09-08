import mongoose from "mongoose";

const ReferralBonusSchema = new mongoose.Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deposit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deposit",
      required: true,
    },
    depositAmountUsd: {
      type: Number,
      required: true,
    },
    bonusAmountUsd: {
      type: Number,
      required: true,
    },
    bonusRate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ReferralBonus ||
  mongoose.model("ReferralBonus", ReferralBonusSchema);