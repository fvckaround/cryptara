import { getSession } from "@/lib/session";
import connectDB from "@/lib/db";
import User from "@/models/User";
import DashboardNav from "@/app/components/DashboardNav";
import TransactionsList from "@/app/components/TransactionsList";

export const metadata = {
  title: "Transactions — Cryptara Holdings",
};

export default async function TransactionsPage() {
  const session = await getSession();

  await connectDB();
  const user = await User.findById(session.userId)
    .select("fullName")
    .lean();

  return (
    <div className="min-h-screen bg-aubergine text-warm-white">
      <DashboardNav userName={user?.fullName} />

      <main className="mx-auto max-w-4xl px-6 py-10 md:py-14">
        <h1 className="font-display text-xl text-warm-white sm:text-2xl">
          Transactions
        </h1>
        <p className="mt-2 font-body text-sm text-mauve">
          Every deposit, withdrawal, and investment on your account.
        </p>

        <div className="mt-8 md:mt-10">
          <TransactionsList />
        </div>
      </main>
    </div>
  );
}