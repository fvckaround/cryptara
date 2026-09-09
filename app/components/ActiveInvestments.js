"use client";

import { useEffect, useState } from "react";

function daysElapsed(startedAt) {
  const ms = Date.now() - new Date(startedAt).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export default function ActiveInvestments() {
  const [investments, setInvestments] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/investments");
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Could not load investments");
          return;
        }
        setInvestments(data.investments.filter((i) => i.status === "active"));
      } catch (err) {
        setError("Could not load investments");
      }
    }
    load();
  }, []);

  if (error) {
    return <p className="font-body text-sm text-[#d9738f]">{error}</p>;
  }

  if (investments === null) {
    return (
      <p className="font-body text-sm text-mauve">Loading investments…</p>
    );
  }

  if (investments.length === 0) {
    return (
      <p className="font-body text-sm text-mauve">
        No active investments yet — pick a plan above to get started.
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {investments.map((inv) => {
        const elapsed = Math.min(daysElapsed(inv.startedAt), inv.termDays);
        const progressPct = Math.min(
          100,
          (elapsed / inv.termDays) * 100
        );
        const generated = inv.amountUsd * (inv.dailyRate / 100) * elapsed;

        return (
          <div
            key={inv._id}
            className="border border-hairline bg-plum p-6"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-lg text-warm-white">
                {inv.planName}
              </h3>
              <span className="font-data text-xs text-mauve">
                Day {elapsed} of {inv.termDays}
              </span>
            </div>

            <div className="mt-4 h-1.5 w-full bg-plum-2">
              <div
                className="gradient-magma h-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <div className="font-data text-xs uppercase tracking-wide text-mauve">
                  Principal
                </div>
                <div className="mt-1 font-body text-sm text-warm-white">
                  $
                  {inv.amountUsd.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div>
                <div className="font-data text-xs uppercase tracking-wide text-mauve">
                  Generated so far
                </div>
                <div className="text-gradient-magma mt-1 font-display text-sm">
                  +$
                  {generated.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}