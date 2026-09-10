import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const maxDuration = 30;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request) {
  try {
    const { token, password, confirmPassword } = await request.json();

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    await connectDB();

    const tokenHash = hashToken(token);

    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired" },
        { status: 400 }
      );
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpires = null;
    await user.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}