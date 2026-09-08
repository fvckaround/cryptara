import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Deposit from "@/models/Deposit";
import Wallet from "@/models/Wallet";
import { getSession } from "@/lib/session";

export const maxDuration = 30;

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { walletId, amountUsd, transactionReference } =
      await request.json();

    if (!walletId || !amountUsd) {
      return NextResponse.json(
        { error: "Wallet and amount are required" },
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

    const wallet = await Wallet.findById(walletId);
    if (!wallet || !wallet.isActive) {
      return NextResponse.json(
        { error: "Selected wallet is not available" },
        { status: 400 }
      );
    }

    const deposit = await Deposit.create({
      user: session.userId,
      wallet: wallet._id,
      currency: wallet.currency,
      amountUsd,
      transactionReference: transactionReference || null,
    });

    return NextResponse.json({ deposit }, { status: 201 });
  } catch (err) {
    console.error("Create deposit error:", err);
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

    const deposits = await Deposit.find({ user: session.userId })
      .populate("wallet", "currency label network")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ deposits }, { status: 200 });
  } catch (err) {
    console.error("List deposits error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}