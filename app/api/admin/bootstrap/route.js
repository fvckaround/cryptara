import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSession, createSession } from "@/lib/session";

export const maxDuration = 30;

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return NextResponse.json(
        { error: "ADMIN_EMAIL is not configured" },
        { status: 500 }
      );
    }

    if (session.email.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "This account does not match the configured admin email" },
        { status: 403 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.userId,
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Refresh the session cookie so the new role takes effect
    // immediately without needing to log out and back in.
    await createSession({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Bootstrap admin error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}