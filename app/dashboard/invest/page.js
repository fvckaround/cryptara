import { getSession } from "@/lib/session";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Plan from "@/models/Plan";
import DashboardNav from "@/app/components/DashboardNav";
import PlanPicker from "@/app/components/PlanPicker";

export const metadata = {
  title: "Choose a plan — Cryptara Holdings",
};

export default async function InvestPage() {
  const session = await getSession();

  await connectDB();

  const [user, plans] = await Promise.all([
    User.findById(session.userId)
      .select("fullName accountBalance activePlan")
      .lean(),
    Plan.find({ isActive: true }).sort({ minDeposit: 1 }).lean(),
  ]);

  const serializedPlans = plans.map((p) => ({
    name: p.name,
    tagline: p.tagline,
    dailyRate: p.dailyRate,
    termDays: p.termDays,
    minDeposit: p.minDeposit,
    maxDeposit: p.maxDeposit,
    popular: p.popular,
    features: p.features,
  }));

  return (
    <div className="min-h-screen bg-aubergine text-warm-white">
      <DashboardNav userName={user?.fullName} />

      <main className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-display text-xl text-warm-white sm:text-2xl">
            Choose a holding plan
          </h1>
          <span className="font-body text-xs text-mauve">
            Available balance:{" "}
            <span className="text-warm-white">
              $
              {(user?.accountBalance ?? 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </span>
        </div>

        <div className="mt-8 md:mt-10">
          {serializedPlans.length === 0 ? (
            <p className="font-body text-sm text-mauve">
              No holding plans are available right now — check back
              shortly.
            </p>
          ) : (
            <PlanPicker
              plans={serializedPlans}
              accountBalance={user?.accountBalance ?? 0}
              activePlan={user?.activePlan ?? null}
            />
          )}
        </div>
      </main>
    </div>
  );
}