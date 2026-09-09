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

export default function WithdrawalsTable() {
  const [withdrawals, setWithdrawals] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("pending");
  const [actioningId, setActioningId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/admin/withdrawals");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load withdrawals");
        return;
      }
      setWithdrawals(data.withdrawals);
    } catch (err) {
      setError("Could not load withdrawals");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleApprove(id) {
    setActioningId(id);
    try {
      const res = await fetch(`/api/withdrawals/${id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
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

  async function handleReject(id) {
    setActioningId(id);
    try {
      const res = await fetch(`/api/withdrawals/${id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", rejectionReason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Action failed");
        setActioningId(null);
        return;
      }
      setRejectingId(null);
      setRejectionReason("");
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

  if (withdrawals === null) {
    return (
      <p className="font-body text-sm text-mauve">Loading withdrawals…</p>
    );
  }

  const filtered =
    filter === "pending"
      ? withdrawals.filter((w) => w.status === "pending")
      : withdrawals;

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
          No withdrawals in this view.
        </p>
      ) : (
        <div className="mt-6 border-t border-hairline">
          {filtered.map((w) => (
            <div key={w._id} className="border-b border-hairline py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-body text-sm text-warm-white">
                    {w.user?.fullName || "Unknown user"}{" "}
                    <span className="text-mauve">({w.user?.email})</span>
                  </div>
                  <div className="mt-0.5 font-body text-xs text-mauve">
                    {w.currency} · {w.network} · $
                    {w.amountUsd.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    ·{" "}
                    {new Date(w.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="mt-0.5 break-all font-data text-xs text-mauve">
                    To: {w.destinationAddress}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-data text-xs capitalize ${
                      STATUS_COLOR[w.status]
                    }`}
                  >
                    {w.status}
                  </span>
                  {w.status === "pending" && rejectingId !== w._id && (
                    <>
                      <button
                        onClick={() => handleApprove(w._id)}
                        disabled={actioningId === w._id}
                        className="gradient-magma px-3 py-1.5 font-body text-xs text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectingId(w._id)}
                        disabled={actioningId === w._id}
                        className="border border-hairline px-3 py-1.5 font-body text-xs text-warm-white transition-colors hover:border-mauve disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              {rejectingId === w._id && (
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    placeholder="Reason (optional)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="flex-1 border border-hairline bg-plum-2 px-3 py-2 font-body text-sm text-warm-white outline-none focus:border-magenta"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(w._id)}
                      disabled={actioningId === w._id}
                      className="border border-magenta px-3 py-2 font-body text-xs text-warm-white disabled:opacity-60"
                    >
                      Confirm reject
                    </button>
                    <button
                      onClick={() => {
                        setRejectingId(null);
                        setRejectionReason("");
                      }}
                      className="border border-hairline px-3 py-2 font-body text-xs text-mauve"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}