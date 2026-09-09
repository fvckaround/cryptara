import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Investment from "@/models/Investment";
import Plan from "@/models/Plan";
import Notification from "@/models/Notification";
import { getSession } from "@/lib/session";

export const maxDuration = 30;

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planName, amountUsd } = await request.json();

    await connectDB();

    const plan = await Plan.findOne({ name: planName, isActive: true });
    if (!plan) {
      return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
    }

    if (typeof amountUsd !== "number" || amountUsd <= 0) {
      return NextResponse.json(
        { error: "Enter a valid amount" },
        { status: 400 }
      );
    }

    if (amountUsd < plan.minDeposit) {
      return NextResponse.json(
        {
          error: `Minimum for ${plan.name} is $${plan.minDeposit.toLocaleString()}`,
        },
        { status: 400 }
      );
    }

    if (plan.maxDeposit && amountUsd > plan.maxDeposit) {
      return NextResponse.json(
        {
          error: `Maximum for ${plan.name} is $${plan.maxDeposit.toLocaleString()}`,
        },
        { status: 400 }
      );
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isFrozen) {
      return NextResponse.json(
        { error: "This account is frozen. Contact support for assistance." },
        { status: 403 }
      );
    }

    if (user.accountBalance < amountUsd) {
      return NextResponse.json(
        { error: "Insufficient account balance for this amount" },
        { status: 400 }
      );
    }

    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + plan.termDays);

    const investment = await Investment.create({
      user: user._id,
      planName: plan.name,
      amountUsd,
      dailyRate: plan.dailyRate,
      termDays: plan.termDays,
      endsAt,
    });

    user.accountBalance -= amountUsd;
    user.totalInvested += amountUsd;
    user.activePlan = plan.name;
    await user.save();

    await Notification.create({
      user: user._id,
      type: "investment_started",
      message: `You started the ${plan.name} plan with $${amountUsd.toLocaleString()}.`,
    });

    return NextResponse.json({ investment }, { status: 201 });
  } catch (err) {
    console.error("Create investment error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const investments = await Investment.find({ user: session.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ investments }, { status: 200 });
  } catch (err) {
    console.error("List investments error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}