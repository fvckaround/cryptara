import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema(
  {
    currency: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    network: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);