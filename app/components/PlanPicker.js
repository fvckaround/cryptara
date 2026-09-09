import Link from "next/link";

export default function PlanPicker({ plans }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Link
          key={plan.name}
          href={`/dashboard/invest/${encodeURIComponent(plan.name)}`}
          className={`relative flex flex-col border p-6 text-left transition-all duration-300 hover:-translate-y-1 ${
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
            <span className="text-gradient-magma font-display text-3xl">
              {plan.dailyRate}
            </span>
            <span className="font-body text-sm text-mauve">% / daily</span>
          </div>
          <div className="mt-1 font-body text-xs text-mauve">
            for {plan.termDays} days
          </div>
          <div className="mt-4 font-data text-xs text-warm-white">
            ${plan.minDeposit.toLocaleString()}
            {plan.maxDeposit ? ` – $${plan.maxDeposit.toLocaleString()}` : "+"}
          </div>
          <span className="mt-6 font-body text-xs text-amber">
            Invest in {plan.name} →
          </span>
        </Link>
      ))}
    </div>
  );
}