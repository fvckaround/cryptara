import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { createSession } from "@/lib/session";
import { sendEmail } from "@/lib/email";
import {
  welcomeEmailTemplate,
  adminNewUserTemplate,
} from "@/lib/emailTemplates";

export const maxDuration = 30;

const SIGNUP_BONUS_USD = 10;

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
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

    if (
      !user.emailVerificationCode ||
      !user.emailVerificationExpires ||
      user.emailVerificationExpires < new Date()
    ) {
      return NextResponse.json(
        { error: "This code has expired. Request a new one." },
        { status: 400 }
      );
    }

    if (user.emailVerificationCode !== code.trim()) {
      return NextResponse.json(
        { error: "Incorrect code" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationExpires = null;
    user.accountBalance += SIGNUP_BONUS_USD;
    await user.save();

    await Notification.create({
      user: user._id,
      type: "deposit_approved",
      message: `You received a $${SIGNUP_BONUS_USD} welcome bonus, credited to your account balance.`,
    });

    await createSession({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    sendEmail({
      to: user.email,
      subject: "Welcome to Cryptara Holdings",
      html: welcomeEmailTemplate(user.fullName, SIGNUP_BONUS_USD),
    });

    if (process.env.ADMIN_EMAIL) {
      sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "New account registered",
        html: adminNewUserTemplate(user.fullName, user.email),
      });
    }

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Verify email error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}