import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Withdrawal from "@/models/Withdrawal";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { getSession } from "@/lib/session";
import { sendEmail } from "@/lib/email";
import {
  withdrawalApprovedTemplate,
  withdrawalRejectedTemplate,
} from "@/lib/emailTemplates";

export const maxDuration = 30;

export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { action, rejectionReason } = await request.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    await connectDB();

    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal not found" },
        { status: 404 }
      );
    }

    if (withdrawal.status !== "pending") {
      return NextResponse.json(
        { error: "This withdrawal has already been reviewed" },
        { status: 409 }
      );
    }

    withdrawal.status = action === "approve" ? "approved" : "rejected";
    withdrawal.reviewedBy = session.userId;
    withdrawal.reviewedAt = new Date();

    const withdrawingUser = await User.findById(withdrawal.user);

    if (action === "reject") {
      withdrawal.rejectionReason = rejectionReason || null;

      // Funds were reserved at request time — return them since the
      // withdrawal did not go through.
      await User.findByIdAndUpdate(withdrawal.user, {
        $inc: { accountBalance: withdrawal.amountUsd },
      });

      await Notification.create({
        user: withdrawal.user,
        type: "withdrawal_rejected",
        message: `Your withdrawal of $${withdrawal.amountUsd.toLocaleString()} was not approved and has been returned to your balance.`,
      });

      if (withdrawingUser) {
        sendEmail({
          to: withdrawingUser.email,
          subject: "Withdrawal not approved",
          html: withdrawalRejectedTemplate(
            withdrawingUser.fullName,
            withdrawal.amountUsd,
            rejectionReason
          ),
        });
      }
    } else {
      await Notification.create({
        user: withdrawal.user,
        type: "withdrawal_approved",
        message: `Your withdrawal of $${withdrawal.amountUsd.toLocaleString()} was approved and sent.`,
      });

      if (withdrawingUser) {
        sendEmail({
          to: withdrawingUser.email,
          subject: "Withdrawal approved",
          html: withdrawalApprovedTemplate(
            withdrawingUser.fullName,
            withdrawal.amountUsd
          ),
        });
      }
    }

    await withdrawal.save();

    return NextResponse.json({ withdrawal }, { status: 200 });
  } catch (err) {
    console.error("Review withdrawal error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}