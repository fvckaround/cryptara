import Link from "next/link";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Deposit from "@/models/Deposit";
import Withdrawal from "@/models/Withdrawal";
import AdminNav from "@/app/components/AdminNav";

export const metadata = {
  title: "Admin Overview — Cryptara Holdings",
};

export default async function AdminOverviewPage() {
  const session = await getSession();

  await connectDB();

  const [
    adminUser,
    totalUsers,
    pendingDeposits,
    pendingWithdrawals,
    balanceAgg,
    investedAgg,
  ] = await Promise.all([
    User.findById(session.userId).select("fullName").lean(),
    User.countDocuments({}),
    Deposit.countDocuments({ status: "pending" }),
    Withdrawal.countDocuments({ status: "pending" }),
    User.aggregate([
      { $group: { _id: null, total: { $sum: "$accountBalance" } } },
    ]),
    User.aggregate([
      { $group: { _id: null, total: { $sum: "$totalInvested" } } },
    ]),
  ]);

  const totalBalance = balanceAgg[0]?.total ?? 0;
  const totalInvested = investedAgg[0]?.total ?? 0;

  return (
    <div className="min-h-screen bg-aubergine text-warm-white">
      <AdminNav userName={adminUser?.fullName} />

      <main className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <h1 className="font-display text-xl text-warm-white sm:text-2xl">
          Overview
        </h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-10 md:grid-cols-4">
          <div className="border border-hairline bg-plum p-5">
            <div className="font-data text-xs uppercase tracking-wide text-mauve">
              Total users
            </div>
            <div className="mt-3 font-display text-2xl text-warm-white">
              {totalUsers}
            </div>
          </div>
          <div className="border border-hairline bg-plum p-5">
            <div className="font-data text-xs uppercase tracking-wide text-mauve">
              Held balances
            </div>
            <div className="text-gradient-magma mt-3 font-display text-2xl">
              $
              {totalBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="border border-hairline bg-plum p-5">
            <div className="font-data text-xs uppercase tracking-wide text-mauve">
              Total invested
            </div>
            <div className="mt-3 font-display text-2xl text-warm-white">
              $
              {totalInvested.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="border border-hairline bg-plum p-5">
            <div className="font-data text-xs uppercase tracking-wide text-mauve">
              Pending reviews
            </div>
            <div className="mt-3 font-display text-2xl text-amber">
              {pendingDeposits + pendingWithdrawals}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/deposits"
            className="border border-hairline bg-plum-2 p-5 transition-colors hover:border-magenta"
          >
            <div className="font-body text-sm text-warm-white">
              {pendingDeposits} pending deposit
              {pendingDeposits === 1 ? "" : "s"}
            </div>
            <div className="mt-1 font-body text-xs text-mauve">
              Review deposits →
            </div>
          </Link>
          <Link
            href="/admin/withdrawals"
            className="border border-hairline bg-plum-2 p-5 transition-colors hover:border-magenta"
          >
            <div className="font-body text-sm text-warm-white">
              {pendingWithdrawals} pending withdrawal
              {pendingWithdrawals === 1 ? "" : "s"}
            </div>
            <div className="mt-1 font-body text-xs text-mauve">
              Review withdrawals →
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}