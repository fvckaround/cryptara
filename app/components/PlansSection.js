import Link from "next/link";
import connectDB from "@/lib/db";
import Plan from "@/models/Plan";

export default async function PlansSection() {
  await connectDB();
  const plans = await Plan.find({ isActive: true })
    .sort({ minDeposit: 1 })
    .lean();

  return (
    <section id="offerings" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="font-display text-2xl text-warm-white md:text-3xl">
        Holding plans
      </h2>
      <p className="mt-3 max-w-lg font-body text-sm text-mauve">
        Three terms, each with a fixed entry range and a defined custody
        arrangement. Choose by horizon, not by marketing tier.
      </p>

      {plans.length === 0 ? (
        <p className="mt-10 font-body text-sm text-mauve">
          Holding plans are being updated — check back shortly.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan._id.toString()}
              className={`relative flex flex-col border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_var(--magenta)] ${
                plan.popular
                  ? "border-magenta bg-plum"
                  : "border-hairline bg-plum-2"
              }`}
            >
              {plan.popular && (
                <span className="gradient-magma absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 font-data text-[11px] text-warm-white">
                  Most popular
                </span>
              )}

              <h3 className="font-display text-xl text-warm-white">
                {plan.name}
              </h3>
              <p className="mt-1 font-body text-sm text-mauve">
                {plan.tagline}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-gradient-magma font-display text-4xl">
                  {plan.dailyRate}
                </span>
                <span className="font-body text-sm text-mauve">
                  % / daily
                </span>
              </div>
              <div className="mt-1 font-body text-xs text-mauve">
                for {plan.termDays} days
              </div>

              <div className="mt-6 flex items-center justify-between border border-hairline px-4 py-3">
                <span className="font-body text-xs text-mauve">
                  Deposit range
                </span>
                <span className="font-data text-sm text-warm-white">
                  $
                  {plan.minDeposit.toLocaleString()}
                  {plan.maxDeposit
                    ? ` – $${plan.maxDeposit.toLocaleString()}`
                    : "+"}
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 font-body text-sm text-warm-white"
                  >
                    <span className="mt-0.5 text-amber">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`mt-8 py-3 text-center font-body text-sm transition-opacity hover:opacity-90 ${
                  plan.popular
                    ? "gradient-magma text-warm-white"
                    : "border border-magenta text-warm-white hover:bg-plum"
                }`}
              >
                Invest in {plan.name}
              </Link>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 font-body text-xs text-mauve">
        Target returns are indicative, not guaranteed, and reflect
        historical performance across market cycles.
      </p>
    </section>
  );
}