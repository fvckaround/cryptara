import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { getSession } from "@/lib/session";

export const maxDuration = 30;

export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { amount, direction, reason } = await request.json();

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Enter a valid positive amount" },
        { status: 400 }
      );
    }

    if (!["add", "subtract"].includes(direction)) {
      return NextResponse.json(
        { error: "Direction must be 'add' or 'subtract'" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const delta = direction === "add" ? amount : -amount;
    const newBalance = user.accountBalance + delta;

    if (newBalance < 0) {
      return NextResponse.json(
        { error: "This would take the account balance below zero" },
        { status: 400 }
      );
    }

    user.accountBalance = newBalance;
    await user.save();

    await Notification.create({
      user: user._id,
      type: "deposit_approved",
      message:
        direction === "add"
          ? `An admin added $${amount.toLocaleString()} to your balance${reason ? `: ${reason}` : "."}`
          : `An admin deducted $${amount.toLocaleString()} from your balance${reason ? `: ${reason}` : "."}`,
    });

    return NextResponse.json(
      { user: { id: user._id, accountBalance: user.accountBalance } },
      { status: 200 }
    );
  } catch (err) {
    console.error("Adjust balance error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}