import { getSession } from "@/lib/session";
import connectDB from "@/lib/db";
import User from "@/models/User";
import AdminNav from "@/app/components/AdminNav";
import WalletsManager from "@/app/components/WalletsManager";

export const metadata = {
  title: "Wallets — Admin",
};

export default async function AdminWalletsPage() {
  const session = await getSession();

  await connectDB();
  const adminUser = await User.findById(session.userId)
    .select("fullName")
    .lean();

  return (
    <div className="min-h-screen bg-aubergine text-warm-white">
      <AdminNav userName={adminUser?.fullName} />

      <main className="mx-auto max-w-4xl px-6 py-10 md:py-14">
        <h1 className="font-display text-xl text-warm-white sm:text-2xl">
          Wallets
        </h1>
        <p className="mt-2 font-body text-sm text-mauve">
          Deposit addresses shown to users. Only active wallets appear on
          the deposit page.
        </p>

        <div className="mt-8 md:mt-10">
          <WalletsManager />
        </div>
      </main>
    </div>
  );
}