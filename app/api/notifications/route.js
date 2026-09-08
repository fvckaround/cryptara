import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user: session.userId })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
      Notification.countDocuments({ user: session.userId, isRead: false }),
    ]);

    return NextResponse.json(
      { notifications, unreadCount },
      { status: 200 }
    );
  } catch (err) {
    console.error("List notifications error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}