import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import ReferralBonus from "@/models/ReferralBonus";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.userId).select(
      "myReferralCode"
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [referredUsers, bonuses] = await Promise.all([
      User.find({ referredBy: session.userId })
        .select("fullName createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      ReferralBonus.find({ referrer: session.userId })
        .populate("referredUser", "fullName")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const totalEarned = bonuses.reduce(
      (sum, bonus) => sum + bonus.bonusAmountUsd,
      0
    );

    return NextResponse.json(
      {
        myReferralCode: user.myReferralCode,
        totalEarned,
        referredUsers: referredUsers.map((u) => ({
          fullName: u.fullName,
          joinedAt: u.createdAt,
        })),
        bonuses: bonuses.map((b) => ({
          referredUserName: b.referredUser?.fullName || "Unknown",
          depositAmountUsd: b.depositAmountUsd,
          bonusAmountUsd: b.bonusAmountUsd,
          createdAt: b.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Referrals fetch error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}