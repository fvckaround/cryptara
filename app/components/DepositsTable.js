"use client";

import { useEffect, useState } from "react";

const STATUS_COLOR = {
  pending: "text-amber",
  approved: "text-warm-white",
  rejected: "text-[#d9738f]",
};

const FILTERS = [
  { key: "pending", label: "Pending" },
  { key: "all", label: "All" },
];

export default function DepositsTable() {
  const [deposits, setDeposits] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("pending");
  const [actioningId, setActioningId] = useState(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/deposits");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load deposits");
        return;
      }
      setDeposits(data.deposits);
    } catch (err) {
      setError("Could not load deposits");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAction(id, action) {
    setActioningId(id);
    try {
      const res = await fetch(`/api/deposits/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Action failed");
        setActioningId(null);
        return;
      }
      await load();
      setActioningId(null);
    } catch (err) {
      setError("Action failed");
      setActioningId(null);
    }
  }

  if (error) {
    return <p className="font-body text-sm text-[#d9738f]">{error}</p>;
  }

  if (deposits === null) {
    return <p className="font-body text-sm text-mauve">Loading deposits…</p>;
  }

  const filtered =
    filter === "pending"
      ? deposits.filter((d) => d.status === "pending")
      : deposits;

  return (
    <div>
      <div className="flex gap-2">
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
        <p className="mt-6 font-body text-sm text-mauve">
          No deposits in this view.
        </p>
      ) : (
        <div className="mt-6 border-t border-hairline">
          {filtered.map((d) => (
            <div
              key={d._id}
              className="flex flex-col gap-3 border-b border-hairline py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-body text-sm text-warm-white">
                  {d.user?.fullName || "Unknown user"}{" "}
                  <span className="text-mauve">({d.user?.email})</span>
                </div>
                <div className="mt-0.5 font-body text-xs text-mauve">
                  {d.wallet?.currency} · $
                  {d.amountUsd.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  ·{" "}
                  {new Date(d.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                {d.transactionReference && (
                  <div className="mt-0.5 break-all font-data text-xs text-mauve">
                    Ref: {d.transactionReference}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`font-data text-xs capitalize ${
                    STATUS_COLOR[d.status]
                  }`}
                >
                  {d.status}
                </span>
                {d.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAction(d._id, "approve")}
                      disabled={actioningId === d._id}
                      className="gradient-magma px-3 py-1.5 font-body text-xs text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(d._id, "reject")}
                      disabled={actioningId === d._id}
                      className="border border-hairline px-3 py-1.5 font-body text-xs text-warm-white transition-colors hover:border-mauve disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}