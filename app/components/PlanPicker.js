"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlanPicker({ plans, accountBalance, activePlan }) {
  const router = useRouter();
  const [selectedPlanName, setSelectedPlanName] = useState(
    plans[0]?.name ?? ""
  );
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedPlan = plans.find((p) => p.name === selectedPlanName);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const amountNumber = Number(amount);

    if (!amountNumber || amountNumber <= 0) {
      setError("Enter a valid amount");
      return;
    }

    if (amountNumber > accountBalance) {
      setError("That's more than your available balance");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: selectedPlanName,
          amountUsd: amountNumber,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not start this plan");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="border border-magenta/40 bg-plum p-6">
        <p className="font-display text-lg text-warm-white">
          You&apos;re in the {selectedPlanName} plan
        </p>
        <p className="mt-2 font-body text-sm text-mauve">
          Your balance has been committed and your term has started.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="gradient-magma mt-6 px-4 py-2 font-body text-sm text-warm-white transition-opacity hover:opacity-90"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isSelected = selectedPlanName === plan.name;
          return (
            <button
              type="button"
              key={plan.name}
              onClick={() => setSelectedPlanName(plan.name)}
              className={`relative flex flex-col border p-6 text-left transition-all duration-300 hover:-translate-y-1 ${
                isSelected
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
                <span className="font-body text-sm text-mauve">
                  % / daily
                </span>
              </div>
              <div className="mt-1 font-body text-xs text-mauve">
                for {plan.termDays} days
              </div>
              <div className="mt-4 font-data text-xs text-warm-white">
                $
                {plan.minDeposit.toLocaleString()}
                {plan.maxDeposit
                  ? ` – $${plan.maxDeposit.toLocaleString()}`
                  : "+"}
              </div>
            </button>
          );
        })}
      </div>

      {selectedPlan && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 max-w-md border border-hairline bg-plum-2 p-6"
        >
          <h3 className="font-display text-lg text-warm-white">
            Invest in {selectedPlan.name}
          </h3>
          <p className="mt-1 font-body text-xs text-mauve">
            Range: ${selectedPlan.minDeposit.toLocaleString()}
            {selectedPlan.maxDeposit
              ? ` – $${selectedPlan.maxDeposit.toLocaleString()}`
              : "+"}
          </p>

          <label className="mt-5 block font-data text-xs uppercase tracking-wide text-mauve">
            Amount (USD)
          </label>
          <input
            type="number"
            min={selectedPlan.minDeposit}
            max={selectedPlan.maxDeposit || undefined}
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-2 w-full border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none transition-colors focus:border-magenta"
          />

          {activePlan && activePlan !== selectedPlan.name && (
            <p className="mt-3 font-body text-xs text-mauve">
              Note: you currently have an active {activePlan} plan. Starting
              a new plan will replace it as your displayed active plan.
            </p>
          )}

          {error && (
            <p className="mt-3 font-body text-sm text-[#d9738f]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="gradient-magma mt-5 w-full px-4 py-3 font-body text-sm text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Processing…" : `Invest in ${selectedPlan.name}`}
          </button>
        </form>
      )}
    </div>
  );
}