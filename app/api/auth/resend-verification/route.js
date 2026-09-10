import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { verificationCodeTemplate } from "@/lib/emailTemplates";

export const maxDuration = 30;

const VERIFICATION_CODE_TTL_MINUTES = 15;

function generateVerificationCode() {
  return String(crypto.randomInt(100000, 999999));
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
    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "This account is already verified" },
        { status: 409 }
      );
    }

    const verificationCode = generateVerificationCode();
    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = new Date(
      Date.now() + VERIFICATION_CODE_TTL_MINUTES * 60 * 1000
    );
    await user.save();

    sendEmail({
      to: user.email,
      subject: "Your new verification code",
      html: verificationCodeTemplate(user.fullName, verificationCode),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Resend verification error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}