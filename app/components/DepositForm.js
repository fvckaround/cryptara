"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DepositForm({ wallets }) {
  const router = useRouter();
  const [selectedWalletId, setSelectedWalletId] = useState(
    wallets[0]?.id ?? ""
  );
  const [amountUsd, setAmountUsd] = useState("");
  const [transactionReference, setTransactionReference] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedWallet = wallets.find((w) => w.id === selectedWalletId);

  async function handleCopy() {
    if (!selectedWallet) return;
    await navigator.clipboard.writeText(selectedWallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!selectedWalletId) {
      setError("Select a wallet to deposit to");
      return;
    }

    const amount = Number(amountUsd);
    if (!amount || amount < 50) {
      setError("Minimum deposit is $50");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletId: selectedWalletId,
          amountUsd: amount,
          transactionReference: transactionReference || null,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not submit deposit");
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

  if (wallets.length === 0) {
    return (
      <div className="border border-hairline bg-plum p-6">
        <p className="font-body text-sm text-warm-white">
          No deposit wallets are configured yet.
        </p>
        <p className="mt-2 font-body text-sm text-mauve">
          Check back shortly, or contact support if this persists.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="border border-magenta/40 bg-plum p-6">
        <p className="font-display text-lg text-warm-white">
          Deposit submitted
        </p>
        <p className="mt-2 font-body text-sm text-mauve">
          Your deposit is pending review. Your balance will update once
          it&apos;s confirmed — usually within one business day.
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
          Choose a currency
        </label>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {wallets.map((wallet) => (
            <button
              type="button"
              key={wallet.id}
              onClick={() => setSelectedWalletId(wallet.id)}
              className={`border p-4 text-left transition-colors ${
                selectedWalletId === wallet.id
                  ? "border-magenta bg-plum"
                  : "border-hairline bg-plum-2 hover:border-mauve"
              }`}
            >
              <div className="font-body text-sm text-warm-white">
                {wallet.currency}
              </div>
              <div className="font-body text-xs text-mauve">
                {wallet.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedWallet && (
        <div className="border border-hairline bg-plum-2 p-4">
          <div className="flex items-center justify-between">
            <span className="font-data text-xs uppercase tracking-wide text-mauve">
              {selectedWallet.network} address
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="font-body text-xs text-amber hover:underline"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="mt-2 break-all font-data text-sm text-warm-white">
            {selectedWallet.address}
          </div>
        </div>
      )}

      <div>
        <label className="font-data text-xs uppercase tracking-wide text-mauve">
          Amount (USD equivalent)
        </label>
        <input
          type="number"
          min="50"
          step="0.01"
          required
          value={amountUsd}
          onChange={(e) => setAmountUsd(e.target.value)}
          className="mt-2 w-full border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none transition-colors focus:border-magenta"
        />
        <p className="mt-2 font-body text-xs text-mauve">
          Minimum deposit: $50
        </p>
      </div>

      <div>
        <label className="font-data text-xs uppercase tracking-wide text-mauve">
          Transaction reference (optional)
        </label>
        <input
          type="text"
          value={transactionReference}
          onChange={(e) => setTransactionReference(e.target.value)}
          placeholder="Transaction hash, if you have it"
          className="mt-2 w-full border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none transition-colors focus:border-magenta"
        />
      </div>

      {error && <p className="font-body text-sm text-[#d9738f]">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="gradient-magma w-full px-4 py-3 font-body text-sm text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Submit deposit"}
      </button>
    </form>
  );
}