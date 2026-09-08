import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Deposit from "@/models/Deposit";
import Withdrawal from "@/models/Withdrawal";
import Investment from "@/models/Investment";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [deposits, withdrawals, investments] = await Promise.all([
      Deposit.find({ user: session.userId })
        .select("currency amountUsd status createdAt")
        .lean(),
      Withdrawal.find({ user: session.userId })
        .select("currency amountUsd status createdAt")
        .lean(),
      Investment.find({ user: session.userId })
        .select("planName amountUsd status createdAt")
        .lean(),
    ]);

    const activity = [
      ...deposits.map((d) => ({
        type: "deposit",
        label: `Deposit — ${d.currency}`,
        amountUsd: d.amountUsd,
        status: d.status,
        createdAt: d.createdAt,
      })),
      ...withdrawals.map((w) => ({
        type: "withdrawal",
        label: `Withdrawal — ${w.currency}`,
        amountUsd: w.amountUsd,
        status: w.status,
        createdAt: w.createdAt,
      })),
      ...investments.map((i) => ({
        type: "investment",
        label: `Invested — ${i.planName}`,
        amountUsd: i.amountUsd,
        status: i.status,
        createdAt: i.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ activity }, { status: 200 });
  } catch (err) {
    console.error("Activity fetch error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}