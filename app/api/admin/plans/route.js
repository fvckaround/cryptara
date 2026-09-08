import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Plan from "@/models/Plan";
import { getSession } from "@/lib/session";

export const maxDuration = 30;

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const plans = await Plan.find({}).sort({ minDeposit: 1 }).lean();

    return NextResponse.json({ plans }, { status: 200 });
  } catch (err) {
    console.error("Admin list plans error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      name,
      tagline,
      dailyRate,
      termDays,
      minDeposit,
      maxDeposit,
      popular,
      features,
    } = await request.json();

    if (!name || !tagline || !dailyRate || !termDays || !minDeposit) {
      return NextResponse.json(
        { error: "Name, tagline, rate, term, and minimum deposit are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const plan = await Plan.create({
      name,
      tagline,
      dailyRate,
      termDays,
      minDeposit,
      maxDeposit: maxDeposit || null,
      popular: Boolean(popular),
      features: Array.isArray(features) ? features : [],
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (err) {
    console.error("Create plan error:", err);
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "A plan with this name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}