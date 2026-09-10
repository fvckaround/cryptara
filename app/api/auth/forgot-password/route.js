import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { passwordResetTemplate } from "@/lib/emailTemplates";

export const maxDuration = 30;

const SITE_URL = "https://cryptaraholdings.com";
const RESET_TOKEN_TTL_MINUTES = 30;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return the same generic response whether or not the
    // account exists — this prevents someone from using this endpoint
    // to check which emails are registered.
    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordTokenHash = hashToken(rawToken);
      user.resetPasswordExpires = new Date(
        Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000
      );
      await user.save();

      const resetUrl = `${SITE_URL}/reset-password?token=${rawToken}`;

      sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: passwordResetTemplate(user.fullName, resetUrl),
      });
    }

    return NextResponse.json(
      {
        message:
          "If an account exists with that email, a reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}