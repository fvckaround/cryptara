import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/session";

export const maxDuration = 30;

export async function PATCH(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmNewPassword } =
      await request.json();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { error: "New passwords do not match" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}