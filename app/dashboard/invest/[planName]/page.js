import Link from "next/link";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Plan from "@/models/Plan";
import DashboardNav from "@/app/components/DashboardNav";
import InvestForm from "@/app/components/InvestForm";

export async function generateMetadata({ params }) {
  const { planName } = await params;
  return { title: `${decodeURIComponent(planName)} — Cryptara Holdings` };
}

export default async function InvestInPlanPage({ params }) {
  const { planName } = await params;
  const session = await getSession();

  await connectDB();

  const [user, plan] = await Promise.all([
    User.findById(session.userId)
      .select("fullName accountBalance")
      .lean(),
    Plan.findOne({
      name: decodeURIComponent(planName),
      isActive: true,
    }).lean(),
  ]);

  if (!plan) {
    return (
      <div className="min-h-screen bg-aubergine text-warm-white">
        <DashboardNav userName={user?.fullName} />
        <main className="mx-auto max-w-2xl px-6 py-14">
          <p className="font-body text-sm text-mauve">
            That plan isn&apos;t available right now.
          </p>
          <Link
            href="/dashboard/invest"
            className="mt-3 inline-block font-body text-sm text-amber underline"
          >
            View holding plans
          </Link>
        </main>
      </div>
    );
  }

  const serializedPlan = {
    name: plan.name,
    tagline: plan.tagline,
    dailyRate: plan.dailyRate,
    termDays: plan.termDays,
    minDeposit: plan.minDeposit,
    maxDeposit: plan.maxDeposit,
    features: plan.features,
  };

  return (
    <div className="min-h-screen bg-aubergine text-warm-white">
      <DashboardNav userName={user?.fullName} />

      <main className="mx-auto max-w-2xl px-6 py-10 md:py-14">
        <Link
          href="/dashboard/invest"
          className="font-body text-xs text-mauve hover:text-amber"
        >
          ← All plans
        </Link>

        <h1 className="mt-3 font-display text-xl text-warm-white sm:text-2xl">
          {plan.name}
        </h1>
        <p className="mt-1 font-body text-sm text-mauve">{plan.tagline}</p>

        <div className="mt-8">
          <InvestForm
            plan={serializedPlan}
            accountBalance={user?.accountBalance ?? 0}
          />
        </div>
      </main>
    </div>
  );
}