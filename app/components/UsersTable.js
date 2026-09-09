"use client";

import { useEffect, useState } from "react";

export default function UsersTable() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [balanceFormId, setBalanceFormId] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceDirection, setBalanceDirection] = useState("add");
  const [balanceReason, setBalanceReason] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load users");
        return;
      }
      setUsers(data.users);
    } catch (err) {
      setError("Could not load users");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRole(user) {
    const newRole = user.role === "admin" ? "investor" : "admin";
    setUpdatingId(user._id);
    setError("");

    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not update role");
        setUpdatingId(null);
        return;
      }

      await load();
      setUpdatingId(null);
    } catch (err) {
      setError("Could not update role");
      setUpdatingId(null);
    }
  }

  async function toggleFrozen(user) {
    setUpdatingId(user._id);
    setError("");

    try {
      const res = await fetch(`/api/admin/users/${user._id}/freeze`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFrozen: !user.isFrozen }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not update freeze status");
        setUpdatingId(null);
        return;
      }

      await load();
      setUpdatingId(null);
    } catch (err) {
      setError("Could not update freeze status");
      setUpdatingId(null);
    }
  }

  function openBalanceForm(user) {
    setBalanceFormId(user._id);
    setBalanceAmount("");
    setBalanceDirection("add");
    setBalanceReason("");
  }

  async function submitBalanceChange(userId) {
    const amount = Number(balanceAmount);
    if (!amount || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setUpdatingId(userId);
    setError("");

    try {
      const res = await fetch(`/api/admin/users/${userId}/balance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          direction: balanceDirection,
          reason: balanceReason || null,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not update balance");
        setUpdatingId(null);
        return;
      }

      setBalanceFormId(null);
      await load();
      setUpdatingId(null);
    } catch (err) {
      setError("Could not update balance");
      setUpdatingId(null);
    }
  }

  if (error) {
    return <p className="font-body text-sm text-[#d9738f]">{error}</p>;
  }

  if (users === null) {
    return <p className="font-body text-sm text-mauve">Loading users…</p>;
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none focus:border-magenta"
      />

      {filtered.length === 0 ? (
        <p className="mt-6 font-body text-sm text-mauve">No users found.</p>
      ) : (
        <div className="mt-6 border-t border-hairline">
          {filtered.map((u) => (
            <div key={u._id} className="border-b border-hairline py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="font-body text-sm text-warm-white">
                    {u.fullName}{" "}
                    <span className="font-data text-xs text-amber">
                      {u.role}
                    </span>
                    {u.isFrozen && (
                      <span className="ml-2 font-data text-xs text-[#d9738f]">
                        FROZEN
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 font-body text-xs text-mauve">
                    {u.email} · {u.country || "—"}
                  </div>
                  <div className="mt-0.5 font-data text-xs text-mauve">
                    Balance: $
                    {u.accountBalance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    · Invested: $
                    {u.totalInvested.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    · Earned: $
                    {u.totalEarned.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    · Plan: {u.activePlan || "None"}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => openBalanceForm(u)}
                    disabled={updatingId === u._id}
                    className="border border-hairline px-3 py-1.5 font-body text-xs text-warm-white transition-colors hover:border-amber disabled:opacity-60"
                  >
                    Adjust balance
                  </button>
                  <button
                    onClick={() => toggleFrozen(u)}
                    disabled={updatingId === u._id}
                    className={`border px-3 py-1.5 font-body text-xs transition-colors disabled:opacity-60 ${
                      u.isFrozen
                        ? "border-hairline text-warm-white hover:border-mauve"
                        : "border-hairline text-[#d9738f] hover:border-[#d9738f]"
                    }`}
                  >
                    {u.isFrozen ? "Unfreeze" : "Freeze"}
                  </button>
                  <button
                    onClick={() => toggleRole(u)}
                    disabled={updatingId === u._id}
                    className="border border-hairline px-3 py-1.5 font-body text-xs text-warm-white transition-colors hover:border-magenta disabled:opacity-60"
                  >
                    {u.role === "admin" ? "Remove admin" : "Make admin"}
                  </button>
                </div>
              </div>

              {balanceFormId === u._id && (
                <div className="mt-4 flex flex-col gap-2 border border-hairline bg-plum-2 p-4 sm:flex-row sm:items-end">
                  <div>
                    <label className="font-data text-xs uppercase tracking-wide text-mauve">
                      Direction
                    </label>
                    <select
                      value={balanceDirection}
                      onChange={(e) => setBalanceDirection(e.target.value)}
                      className="mt-2 border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none [color-scheme:dark]"
                    >
                      <option value="add">Add</option>
                      <option value="subtract">Subtract</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-data text-xs uppercase tracking-wide text-mauve">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={balanceAmount}
                      onChange={(e) => setBalanceAmount(e.target.value)}
                      className="mt-2 w-32 border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none focus:border-magenta"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="font-data text-xs uppercase tracking-wide text-mauve">
                      Reason (optional)
                    </label>
                    <input
                      type="text"
                      value={balanceReason}
                      onChange={(e) => setBalanceReason(e.target.value)}
                      className="mt-2 w-full border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none focus:border-magenta"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => submitBalanceChange(u._id)}
                      disabled={updatingId === u._id}
                      className="gradient-magma px-4 py-2 font-body text-xs text-warm-white disabled:opacity-60"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setBalanceFormId(null)}
                      className="border border-hairline px-4 py-2 font-body text-xs text-mauve"
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