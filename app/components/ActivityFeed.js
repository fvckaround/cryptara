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

export default function ActivityFeed() {
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/activity");
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Could not load activity");
          return;
        }
        setActivity(data.activity);
      } catch (err) {
        setError("Could not load activity");
      }
    }
    load();
  }, []);

  if (error) {
    return <p className="font-body text-sm text-[#d9738f]">{error}</p>;
  }

  if (activity === null) {
    return <p className="font-body text-sm text-mauve">Loading activity…</p>;
  }

  if (activity.length === 0) {
    return (
      <p className="font-body text-sm text-mauve">
        No activity yet — your deposits, withdrawals, and investments will
        show up here.
      </p>
    );
  }

  return (
    <div className="border-t border-hairline">
      {activity.map((item, index) => (
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
  );
}