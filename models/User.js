import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    myReferralCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    termsAcceptedAt: {
      type: Date,
      required: true,
    },
    role: {
      type: String,
      enum: ["investor", "admin"],
      default: "investor",
    },
    accountBalance: {
      type: Number,
      default: 0,
    },
    totalInvested: {
      type: Number,
      default: 0,
    },
    activePlan: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFrozen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);