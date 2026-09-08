import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Deposit from "@/models/Deposit";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const deposits = await Deposit.find({})
      .populate("user", "fullName email")
      .populate("wallet", "currency label")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ deposits }, { status: 200 });
  } catch (err) {
    console.error("Admin list deposits error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}