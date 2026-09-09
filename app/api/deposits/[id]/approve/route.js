import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Deposit from "@/models/Deposit";
import User from "@/models/User";
import ReferralBonus from "@/models/ReferralBonus";
import Notification from "@/models/Notification";
import { REFERRAL_BONUS_RATE } from "@/lib/referrals";
import { getSession } from "@/lib/session";
import { sendEmail } from "@/lib/email";
import {
  depositApprovedTemplate,
  depositRejectedTemplate,
} from "@/lib/emailTemplates";

export const maxDuration = 30;

export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { action } = await request.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    await connectDB();

    const deposit = await Deposit.findById(id);
    if (!deposit) {
      return NextResponse.json(
        { error: "Deposit not found" },
        { status: 404 }
      );
    }

    if (deposit.status !== "pending") {
      return NextResponse.json(
        { error: "This deposit has already been reviewed" },
        { status: 409 }
      );
    }

    deposit.status = action === "approve" ? "approved" : "rejected";
    deposit.reviewedBy = session.userId;
    deposit.reviewedAt = new Date();
    await deposit.save();

    const depositingUser = await User.findById(deposit.user);

    if (action === "approve") {
      await User.findByIdAndUpdate(deposit.user, {
        $inc: { accountBalance: deposit.amountUsd },
      });

      await Notification.create({
        user: deposit.user,
        type: "deposit_approved",
        message: `Your deposit of $${deposit.amountUsd.toLocaleString()} was approved and credited to your balance.`,
      });

      if (depositingUser) {
        sendEmail({
          to: depositingUser.email,
          subject: "Deposit confirmed",
          html: depositApprovedTemplate(
            depositingUser.fullName,
            deposit.amountUsd
          ),
        });
      }

      // Referral bonus: applies on every approved deposit from a
      // referred user, not just their first one.
      if (depositingUser?.referredBy) {
        const bonusAmountUsd = deposit.amountUsd * REFERRAL_BONUS_RATE;

        await User.findByIdAndUpdate(depositingUser.referredBy, {
          $inc: { accountBalance: bonusAmountUsd },
        });

        await ReferralBonus.create({
          referrer: depositingUser.referredBy,
          referredUser: depositingUser._id,
          deposit: deposit._id,
          depositAmountUsd: deposit.amountUsd,
          bonusAmountUsd,
          bonusRate: REFERRAL_BONUS_RATE,
        });

        await Notification.create({
          user: depositingUser.referredBy,
          type: "referral_bonus",
          message: `You earned $${bonusAmountUsd.toLocaleString()} from a referral's deposit.`,
        });
      }
    } else {
      await Notification.create({
        user: deposit.user,
        type: "deposit_rejected",
        message: `Your deposit of $${deposit.amountUsd.toLocaleString()} was not approved. Contact support for details.`,
      });

      if (depositingUser) {
        sendEmail({
          to: depositingUser.email,
          subject: "Deposit not approved",
          html: depositRejectedTemplate(
            depositingUser.fullName,
            deposit.amountUsd
          ),
        });
      }
    }

    return NextResponse.json({ deposit }, { status: 200 });
  } catch (err) {
    console.error("Approve deposit error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}