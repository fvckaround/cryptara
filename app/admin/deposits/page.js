import { getSession } from "@/lib/session";
import connectDB from "@/lib/db";
import User from "@/models/User";
import AdminNav from "@/app/components/AdminNav";
import DepositsTable from "@/app/components/DepositsTable";

export const metadata = {
  title: "Deposits — Admin",
};

export default async function AdminDepositsPage() {
  const session = await getSession();

  await connectDB();
  const adminUser = await User.findById(session.userId)
    .select("fullName")
    .lean();

  return (
    <div className="min-h-screen bg-aubergine text-warm-white">
      <AdminNav userName={adminUser?.fullName} />

      <main className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <h1 className="font-display text-xl text-warm-white sm:text-2xl">
          Deposits
        </h1>

        <div className="mt-8 md:mt-10">
          <DepositsTable />
        </div>
      </main>
    </div>
  );
}