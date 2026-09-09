import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Withdrawal from "@/models/Withdrawal";
import User from "@/models/User";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const withdrawals = await Withdrawal.find({})
      .populate("user", "fullName email")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ withdrawals }, { status: 200 });
  } catch (err) {
    console.error("Admin list withdrawals error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}