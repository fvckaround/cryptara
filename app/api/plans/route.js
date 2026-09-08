import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Plan from "@/models/Plan";

export async function GET() {
  try {
    await connectDB();

    const plans = await Plan.find({ isActive: true })
      .sort({ minDeposit: 1 })
      .lean();

    return NextResponse.json({ plans }, { status: 200 });
  } catch (err) {
    console.error("List plans error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}