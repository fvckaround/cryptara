import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { verificationCodeTemplate } from "@/lib/emailTemplates";

export const maxDuration = 30;

const VERIFICATION_CODE_TTL_MINUTES = 15;

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

function randomReferralCode(length = 8) {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, length)
    .toUpperCase();
}

async function generateUniqueReferralCode() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomReferralCode(8);
    const existing = await User.findOne({ myReferralCode: code });
    if (!existing) {
      return code;
    }
  }
  throw new Error("Could not generate a unique referral code");
}

function generateVerificationCode() {
  return String(crypto.randomInt(100000, 999999));
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

    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(
      Date.now() + VERIFICATION_CODE_TTL_MINUTES * 60 * 1000
    );

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
      isVerified: false,
      emailVerificationCode: verificationCode,
      emailVerificationExpires: verificationExpires,
    });

    sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: verificationCodeTemplate(user.fullName, verificationCode),
    });

    return NextResponse.json(
      { requiresVerification: true, email: user.email },
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