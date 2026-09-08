import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Investment from "@/models/Investment";
import User from "@/models/User";
import Notification from "@/models/Notification";

export const maxDuration = 60;

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const now = new Date();
    const maturedInvestments = await Investment.find({
      status: "active",
      endsAt: { $lte: now },
    });

    let processedCount = 0;

    for (const investment of maturedInvestments) {
      const profit =
        investment.amountUsd *
        (investment.dailyRate / 100) *
        investment.termDays;
      const payout = investment.amountUsd + profit;

      investment.status = "completed";
      await investment.save();

      const user = await User.findById(investment.user);
      if (!user) continue;

      user.accountBalance += payout;

      // If this was the plan shown as "active" and the user has no
      // other active investments left, clear the displayed active plan.
      const stillActive = await Investment.countDocuments({
        user: user._id,
        status: "active",
      });
      if (user.activePlan === investment.planName && stillActive === 0) {
        user.activePlan = null;
      }

      await user.save();

      await Notification.create({
        user: user._id,
        type: "investment_started",
        message: `Your ${investment.planName} plan matured. $${payout.toLocaleString(
          undefined,
          { minimumFractionDigits: 2 }
        )} (principal + profit) was added to your balance.`,
      });

      processedCount++;
    }

    return NextResponse.json(
      { processed: processedCount },
      { status: 200 }
    );
  } catch (err) {
    console.error("Mature investments cron error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}