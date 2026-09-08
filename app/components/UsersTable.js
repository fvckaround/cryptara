"use client";

import { useEffect, useState } from "react";

export default function UsersTable() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

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
            <div
              key={u._id}
              className="flex flex-col gap-3 border-b border-hairline py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-body text-sm text-warm-white">
                  {u.fullName}{" "}
                  <span className="font-data text-xs text-amber">
                    {u.role}
                  </span>
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
                  · Plan: {u.activePlan || "None"}
                </div>
              </div>

              <button
                onClick={() => toggleRole(u)}
                disabled={updatingId === u._id}
                className="border border-hairline px-3 py-1.5 font-body text-xs text-warm-white transition-colors hover:border-magenta disabled:opacity-60"
              >
                {u.role === "admin" ? "Remove admin" : "Make admin"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}