import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const users = await User.find({})
      .select(
        "fullName email role accountBalance totalInvested activePlan country createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("Admin list users error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}