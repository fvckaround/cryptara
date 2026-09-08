import connectDB from "@/lib/db";
import Wallet from "@/models/Wallet";
import { getSession } from "@/lib/session";
import User from "@/models/User";
import DashboardNav from "@/app/components/DashboardNav";
import DepositForm from "@/app/components/DepositForm";

export const metadata = {
  title: "Deposit — Cryptara Holdings",
};

export default async function DepositPage() {
  const session = await getSession();

  await connectDB();

  const [wallets, user] = await Promise.all([
    Wallet.find({ isActive: true })
      .select("currency label network address")
      .sort({ currency: 1 })
      .lean(),
    User.findById(session.userId).select("fullName").lean(),
  ]);

  const serializedWallets = wallets.map((w) => ({
    id: w._id.toString(),
    currency: w.currency,
    label: w.label,
    network: w.network,
    address: w.address,
  }));

  return (
    <div className="min-h-screen bg-aubergine text-warm-white">
      <DashboardNav userName={user?.fullName} />

      <main className="mx-auto max-w-2xl px-6 py-10 md:py-14">
        <h1 className="font-display text-xl text-warm-white sm:text-2xl">
          Make a deposit
        </h1>
        <p className="mt-2 font-body text-sm text-mauve">
          Send funds to one of the addresses below, then submit the details
          here. Deposits are credited to your account balance after review.
        </p>

        <div className="mt-8 md:mt-10">
          <DepositForm wallets={serializedWallets} />
        </div>
      </main>
    </div>
  );
}