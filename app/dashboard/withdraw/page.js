import { getSession } from "@/lib/session";
import connectDB from "@/lib/db";
import User from "@/models/User";
import DashboardNav from "@/app/components/DashboardNav";
import WithdrawForm from "@/app/components/WithdrawForm";

export const metadata = {
  title: "Withdraw — Cryptara Holdings",
};

export default async function WithdrawPage() {
  const session = await getSession();

  await connectDB();
  const user = await User.findById(session.userId)
    .select("fullName accountBalance")
    .lean();

  return (
    <div className="min-h-screen bg-aubergine text-warm-white">
      <DashboardNav userName={user?.fullName} />

      <main className="mx-auto max-w-2xl px-6 py-10 md:py-14">
        <h1 className="font-display text-xl text-warm-white sm:text-2xl">
          Withdraw funds
        </h1>
        <p className="mt-2 font-body text-sm text-mauve">
          Requests are reviewed before funds are sent. Your available
          balance is reserved as soon as you submit a request.
        </p>

        <div className="mt-6 border border-hairline bg-plum p-4">
          <span className="font-data text-xs uppercase tracking-wide text-mauve">
            Available balance
          </span>
          <div className="text-gradient-magma mt-1 font-display text-2xl">
            $
            {(user?.accountBalance ?? 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="mt-8 md:mt-10">
          <WithdrawForm accountBalance={user?.accountBalance ?? 0} />
        </div>
      </main>
    </div>
  );
}