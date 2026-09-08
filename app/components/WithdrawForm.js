"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CURRENCIES = ["BTC", "ETH", "USDT"];

export default function WithdrawForm({ accountBalance }) {
  const router = useRouter();
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [amountUsd, setAmountUsd] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const amount = Number(amountUsd);

    if (!amount || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    if (amount > accountBalance) {
      setError("That's more than your available balance");
      return;
    }

    if (!destinationAddress.trim()) {
      setError("Enter a destination wallet address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountUsd: amount,
          currency,
          destinationAddress: destinationAddress.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not submit withdrawal");
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
          Withdrawal requested
        </p>
        <p className="mt-2 font-body text-sm text-mauve">
          The amount has been reserved from your balance and your request
          is pending review. Funds are typically sent within one business
          day of approval.
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="font-data text-xs uppercase tracking-wide text-mauve">
          Currency to receive
        </label>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {CURRENCIES.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCurrency(c)}
              className={`border p-3 font-body text-sm transition-colors ${
                currency === c
                  ? "border-magenta bg-plum text-warm-white"
                  : "border-hairline bg-plum-2 text-mauve hover:border-mauve"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="font-data text-xs uppercase tracking-wide text-mauve">
          Amount (USD equivalent)
        </label>
        <input
          type="number"
          min="1"
          max={accountBalance}
          step="0.01"
          required
          value={amountUsd}
          onChange={(e) => setAmountUsd(e.target.value)}
          className="mt-2 w-full border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none transition-colors focus:border-magenta"
        />
      </div>

      <div>
        <label className="font-data text-xs uppercase tracking-wide text-mauve">
          Destination wallet address
        </label>
        <input
          type="text"
          required
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.target.value)}
          placeholder="The address you want funds sent to"
          className="mt-2 w-full border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none transition-colors focus:border-magenta"
        />
      </div>

      {error && <p className="font-body text-sm text-[#d9738f]">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="gradient-magma w-full px-4 py-3 font-body text-sm text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Request withdrawal"}
      </button>
    </form>
  );
}