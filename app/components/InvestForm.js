"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InvestForm({ plan, accountBalance }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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
          planName: plan.name,
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
          You&apos;re in the {plan.name} plan
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
    <div className="border border-hairline bg-plum-2 p-6 md:p-8">
      <div className="flex items-baseline gap-1">
        <span className="text-gradient-magma font-display text-4xl">
          {plan.dailyRate}
        </span>
        <span className="font-body text-sm text-mauve">% / daily</span>
      </div>
      <div className="mt-1 font-body text-xs text-mauve">
        for {plan.termDays} days
      </div>

      <div className="mt-6 flex items-center justify-between border border-hairline px-4 py-3">
        <span className="font-body text-xs text-mauve">Deposit range</span>
        <span className="font-data text-sm text-warm-white">
          ${plan.minDeposit.toLocaleString()}
          {plan.maxDeposit ? ` – $${plan.maxDeposit.toLocaleString()}` : "+"}
        </span>
      </div>

      <ul className="mt-6 space-y-3">
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

      <form onSubmit={handleSubmit} className="mt-8 border-t border-hairline pt-6">
        <label className="font-data text-xs uppercase tracking-wide text-mauve">
          Amount (USD)
        </label>
        <input
          type="number"
          min={plan.minDeposit}
          max={plan.maxDeposit || undefined}
          step="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-2 w-full border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none transition-colors focus:border-magenta"
        />
        <p className="mt-2 font-body text-xs text-mauve">
          Available balance: $
          {accountBalance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </p>

        {error && (
          <p className="mt-3 font-body text-sm text-[#d9738f]">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="gradient-magma mt-5 w-full px-4 py-3 font-body text-sm text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Processing…" : `Confirm — Invest in ${plan.name}`}
        </button>
      </form>
    </div>
  );
}