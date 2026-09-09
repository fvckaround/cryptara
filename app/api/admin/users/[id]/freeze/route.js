import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { getSession } from "@/lib/session";

export const maxDuration = 30;

export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { isFrozen } = await request.json();

    if (typeof isFrozen !== "boolean") {
      return NextResponse.json(
        { error: "isFrozen must be true or false" },
        { status: 400 }
      );
    }

    if (id === session.userId) {
      return NextResponse.json(
        { error: "You can't freeze your own account" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      id,
      { isFrozen },
      { new: true }
    ).select("fullName email isFrozen");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await Notification.create({
      user: user._id,
      type: isFrozen ? "withdrawal_rejected" : "withdrawal_approved",
      message: isFrozen
        ? "Your account has been frozen. Contact support for assistance."
        : "Your account has been unfrozen. You can now use your account normally.",
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("Freeze user error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}