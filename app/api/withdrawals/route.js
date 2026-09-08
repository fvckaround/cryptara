import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Withdrawal from "@/models/Withdrawal";
import User from "@/models/User";
import { getSession } from "@/lib/session";

export const maxDuration = 30;

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amountUsd, currency, destinationAddress } = await request.json();

    if (!amountUsd || !currency || !destinationAddress) {
      return NextResponse.json(
        { error: "Amount, currency, and destination address are required" },
        { status: 400 }
      );
    }

    if (amountUsd < 1) {
      return NextResponse.json(
        { error: "Amount must be greater than zero" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.accountBalance < amountUsd) {
      return NextResponse.json(
        { error: "Withdrawal amount exceeds your available balance" },
        { status: 400 }
      );
    }

    // Reserve the funds immediately so the same balance can't be
    // withdrawn twice across multiple pending requests.
    user.accountBalance -= amountUsd;
    await user.save();

    const withdrawal = await Withdrawal.create({
      user: user._id,
      amountUsd,
      currency: currency.toUpperCase(),
      destinationAddress,
    });

    return NextResponse.json({ withdrawal }, { status: 201 });
  } catch (err) {
    console.error("Create withdrawal error:", err);
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

    const withdrawals = await Withdrawal.find({ user: session.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ withdrawals }, { status: 200 });
  } catch (err) {
    console.error("List withdrawals error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}