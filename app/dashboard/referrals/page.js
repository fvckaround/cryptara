import { getSession } from "@/lib/session";
import connectDB from "@/lib/db";
import User from "@/models/User";
import DashboardNav from "@/app/components/DashboardNav";
import ReferralsPanel from "@/app/components/ReferralsPanel";

export const metadata = {
  title: "Referrals — Cryptara Holdings",
};

export default async function ReferralsPage() {
  const session = await getSession();

  await connectDB();
  const user = await User.findById(session.userId)
    .select("fullName")
    .lean();

  return (
    <div className="min-h-screen bg-aubergine text-warm-white">
      <DashboardNav userName={user?.fullName} />

      <main className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        <h1 className="font-display text-xl text-warm-white sm:text-2xl">
          Referrals
        </h1>
        <p className="mt-2 font-body text-sm text-mauve">
          Share your code, earn a percentage of every approved deposit from
          people who join through it.
        </p>

        <div className="mt-8 md:mt-10">
          <ReferralsPanel />
        </div>
      </main>
    </div>
  );
}