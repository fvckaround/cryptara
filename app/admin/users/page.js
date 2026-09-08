import { getSession } from "@/lib/session";
import connectDB from "@/lib/db";
import User from "@/models/User";
import AdminNav from "@/app/components/AdminNav";
import UsersTable from "@/app/components/UsersTable";

export const metadata = {
  title: "Users — Admin",
};

export default async function AdminUsersPage() {
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
          Users
        </h1>
        <p className="mt-2 font-body text-sm text-mauve">
          {" "}
          All registered accounts. Promote a user to admin so they can
          review deposits, withdrawals, and manage wallets/plans.
        </p>

        <div className="mt-8 md:mt-10">
          <UsersTable />
        </div>
      </main>
    </div>
  );
}