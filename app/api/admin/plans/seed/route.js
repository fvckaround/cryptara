import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Plan from "@/models/Plan";
import { getSession } from "@/lib/session";

export const maxDuration = 30;

const DEFAULT_PLANS = [
  {
    name: "Foundation",
    tagline: "For first-time holders",
    dailyRate: 1.8,
    termDays: 30,
    minDeposit: 500,
    maxDeposit: 4999,
    popular: false,
    features: [
      "Daily payout schedule",
      "Real-time portfolio tracking",
      "Standard email support",
      "Withdrawal requests within 24h",
    ],
  },
  {
    name: "Compounding",
    tagline: "For hands-on investors",
    dailyRate: 2.6,
    termDays: 90,
    minDeposit: 5000,
    maxDeposit: 24999,
    popular: true,
    features: [
      "Everything in Foundation",
      "Automatic daily compounding",
      "Dedicated account contact",
      "Priority withdrawal processing",
      "Quarterly allocation review",
    ],
  },
  {
    name: "Principal",
    tagline: "For institutional-grade capital",
    dailyRate: 3.4,
    termDays: 180,
    minDeposit: 25000,
    maxDeposit: null,
    popular: false,
    features: [
      "Everything in Compounding",
      "Segregated wallet allocation",
      "Direct line to portfolio team",
      "Custom holding structuring",
      "Early access to new asset pools",
    ],
  },
];

export async function POST() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const existingCount = await Plan.countDocuments({});
    if (existingCount > 0) {
      return NextResponse.json(
        { error: "Plans already exist — seeding is only for an empty collection" },
        { status: 409 }
      );
    }

    const plans = await Plan.insertMany(DEFAULT_PLANS);

    return NextResponse.json({ plans }, { status: 201 });
  } catch (err) {
    console.error("Seed plans error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}