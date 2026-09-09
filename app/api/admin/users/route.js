import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Investment from "@/models/Investment";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [users, earnedAgg] = await Promise.all([
      User.find({})
        .select(
          "fullName email role accountBalance totalInvested activePlan country isFrozen createdAt"
        )
        .sort({ createdAt: -1 })
        .lean(),
      Investment.aggregate([
        { $match: { status: "completed" } },
        {
          $project: {
            user: 1,
            profit: {
              $multiply: [
                "$amountUsd",
                { $divide: ["$dailyRate", 100] },
                "$termDays",
              ],
            },
          },
        },
        {
          $group: {
            _id: "$user",
            totalEarned: { $sum: "$profit" },
          },
        },
      ]),
    ]);

    const earnedByUser = new Map(
      earnedAgg.map((entry) => [entry._id.toString(), entry.totalEarned])
    );

    const usersWithEarnings = users.map((u) => ({
      ...u,
      totalEarned: earnedByUser.get(u._id.toString()) || 0,
    }));

    return NextResponse.json({ users: usersWithEarnings }, { status: 200 });
  } catch (err) {
    console.error("Admin list users error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}