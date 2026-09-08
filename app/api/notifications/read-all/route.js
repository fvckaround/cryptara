import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import { getSession } from "@/lib/session";

export async function PATCH() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    await Notification.updateMany(
      { user: session.userId, isRead: false },
      { $set: { isRead: true } }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Mark notifications read error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}