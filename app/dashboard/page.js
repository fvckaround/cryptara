import Link from "next/link";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/db";
import User from "@/models/User";
import DashboardNav from "../components/DashboardNav";
import ActivityFeed from "../components/ActivityFeed";
import ClaimAdminButton from "../components/ClaimAdminButton";

export const metadata = {
  title: "Dashboard — Cryptara Holdings",
};

export default async function DashboardPage() {
  const session = await getSession();

  await connectDB();
  const user = await User.findById(session.userId).lean();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-aubergine text-warm-white">
      <DashboardNav userName={user?.fullName} />

      <main className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-display text-xl text-warm-white sm:text-2xl">
            Welcome back, {user?.fullName?.split(" ")[0]}
          </h1>
          {memberSince && (
            <span className="font-body text-xs text-mauve">
              Member since {memberSince}
            </span>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:gap-6 md:mt-10 md:grid-cols-3">
          <div className="border border-hairline bg-plum p-5 md:p-6">
            <div className="font-data text-xs uppercase tracking-wide text-mauve">
              Account balance
            </div>
            <div className="text-gradient-magma mt-3 font-display text-2xl sm:text-3xl">
              $
              {(user?.accountBalance ?? 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="border border-hairline bg-plum p-5 md:p-6">
            <div className="font-data text-xs uppercase tracking-wide text-mauve">
              Total invested
            </div>
            <div className="mt-3 font-display text-2xl text-warm-white sm:text-3xl">
              $
              {(user?.totalInvested ?? 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          <div className="border border-hairline bg-plum p-5 md:p-6">
            <div className="font-data text-xs uppercase tracking-wide text-mauve">
              Active plan
            </div>
            <div className="mt-3 font-display text-2xl text-warm-white sm:text-3xl">
              {user?.activePlan ?? "None yet"}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
          <Link
            href="/dashboard/deposit"
            className="gradient-magma px-5 py-2.5 font-body text-sm text-warm-white transition-opacity hover:opacity-90"
          >
            Make a deposit
          </Link>
          <Link
            href="/dashboard/invest"
            className="border border-magenta px-5 py-2.5 font-body text-sm text-warm-white transition-colors hover:bg-plum"
          >
            Choose a plan
          </Link>
          <Link
            href="/dashboard/withdraw"
            className="border border-hairline px-5 py-2.5 font-body text-sm text-warm-white transition-colors hover:border-mauve"
          >
            Withdraw
          </Link>
        </div>

        {!user?.activePlan && (
          <div className="mt-10 border border-magenta/40 bg-plum p-6">
            <p className="font-body text-sm text-warm-white">
              You haven&apos;t selected a holding plan yet.
            </p>
            <Link
              href="/dashboard/invest"
              className="mt-3 inline-block font-body text-sm text-amber underline"
            >
              View holding plans
            </Link>
          </div>
        )}

        <div className="mt-10 border-t border-hairline pt-8">
          <h2 className="font-display text-lg text-warm-white">
            Recent activity
          </h2>
          <div className="mt-4">
            <ActivityFeed />
          </div>
        </div>

        <div className="mt-10 border-t border-hairline pt-8">
          <h2 className="font-display text-lg text-warm-white">
            Account details
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-data text-xs uppercase tracking-wide text-mauve">
                Email
              </dt>
              <dd className="mt-1 font-body text-sm text-warm-white">
                {user?.email}
              </dd>
            </div>
            <div>
              <dt className="font-data text-xs uppercase tracking-wide text-mauve">
                Phone
              </dt>
              <dd className="mt-1 font-body text-sm text-warm-white">
                {user?.phone || "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="font-data text-xs uppercase tracking-wide text-mauve">
                Country
              </dt>
              <dd className="mt-1 font-body text-sm text-warm-white">
                {user?.country || "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="font-data text-xs uppercase tracking-wide text-mauve">
                Member since
              </dt>
              <dd className="mt-1 font-body text-sm text-warm-white">
                {memberSince || "—"}
              </dd>
            </div>
          </dl>
        </div>

        {user?.email?.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase() &&
          user?.role !== "admin" && <ClaimAdminButton />}
      </main>
    </div>
  );
}