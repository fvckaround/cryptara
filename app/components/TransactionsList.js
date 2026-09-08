"use client";

import { useEffect, useState } from "react";

const STATUS_COLOR = {
  pending: "text-amber",
  approved: "text-warm-white",
  rejected: "text-[#d9738f]",
  active: "text-warm-white",
  completed: "text-warm-white",
  withdrawn: "text-mauve",
};

const TYPE_SIGN = {
  deposit: "+",
  withdrawal: "−",
  investment: "→",
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "deposit", label: "Deposits" },
  { key: "withdrawal", label: "Withdrawals" },
  { key: "investment", label: "Investments" },
];

export default function TransactionsList() {
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/activity");
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Could not load transactions");
          return;
        }
        setActivity(data.activity);
      } catch (err) {
        setError("Could not load transactions");
      }
    }
    load();
  }, []);

  if (error) {
    return <p className="font-body text-sm text-[#d9738f]">{error}</p>;
  }

  if (activity === null) {
    return (
      <p className="font-body text-sm text-mauve">Loading transactions…</p>
    );
  }

  const filtered =
    filter === "all" ? activity : activity.filter((a) => a.type === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`border px-4 py-2 font-body text-sm transition-colors ${
              filter === f.key
                ? "border-magenta bg-plum text-warm-white"
                : "border-hairline bg-plum-2 text-mauve hover:border-mauve"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 font-body text-sm text-mauve">
          No transactions in this category yet.
        </p>
      ) : (
        <div className="mt-6 border-t border-hairline">
          {filtered.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-hairline py-4"
            >
              <div>
                <div className="font-body text-sm text-warm-white">
                  {item.label}
                </div>
                <div className="mt-0.5 font-body text-xs text-mauve">
                  {new Date(item.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="font-data text-sm text-warm-white">
                  {TYPE_SIGN[item.type]} $
                  {item.amountUsd.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div
                  className={`font-data text-xs capitalize ${
                    STATUS_COLOR[item.status] || "text-mauve"
                  }`}
                >
                  {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}