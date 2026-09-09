import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
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

function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dob.getDate())
  ) {
    age--;
  }
  return age;
}

function randomCode(length = 8) {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, length)
    .toUpperCase();
}

async function generateUniqueReferralCode() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode(8);
    const existing = await User.findOne({ myReferralCode: code });
    if (!existing) {
      return code;
    }
  }
  throw new Error("Could not generate a unique referral code");
}

export async function POST(request) {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      phone,
      country,
      dateOfBirth,
      referralCode,
      termsAccepted,
    } = await request.json();

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !country ||
      !dateOfBirth
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
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

    if (!termsAccepted) {
      return NextResponse.json(
        { error: "You must accept the terms and conditions" },
        { status: 400 }
      );
    }

    const dob = new Date(dateOfBirth);
    if (Number.isNaN(dob.getTime())) {
      return NextResponse.json(
        { error: "Please provide a valid date of birth" },
        { status: 400 }
      );
    }

    if (calculateAge(dob) < 18) {
      return NextResponse.json(
        { error: "You must be at least 18 years old to open an account" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    let referredBy = null;
    if (referralCode && referralCode.trim()) {
      const referrer = await User.findOne({
        myReferralCode: referralCode.trim().toUpperCase(),
      });
      if (referrer) {
        referredBy = referrer._id;
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const myReferralCode = await generateUniqueReferralCode();

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      country,
      dateOfBirth: dob,
      myReferralCode,
      referredBy,
      termsAcceptedAt: new Date(),
      accountBalance: SIGNUP_BONUS_USD,
    });

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
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}