"use client";

import { useEffect, useState } from "react";

const EMPTY_FORM = { currency: "", label: "", network: "", address: "" };

export default function WalletsManager() {
  const [wallets, setWallets] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/admin/wallets");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load wallets");
        return;
      }
      setWallets(data.wallets);
    } catch (err) {
      setError("Could not load wallets");
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEdit(wallet) {
    setEditingId(wallet._id);
    setForm({
      currency: wallet.currency,
      label: wallet.label,
      network: wallet.network,
      address: wallet.address,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const url = editingId
        ? `/api/admin/wallets/${editingId}`
        : "/api/admin/wallets";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not save wallet");
        setSubmitting(false);
        return;
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setSubmitting(false);
      await load();
    } catch (err) {
      setError("Something went wrong");
      setSubmitting(false);
    }
  }

  async function toggleActive(wallet) {
    try {
      await fetch(`/api/admin/wallets/${wallet._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !wallet.isActive }),
      });
      await load();
    } catch (err) {
      setError("Could not update wallet");
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`/api/admin/wallets/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError("Could not delete wallet");
    }
  }

  const inputClass =
    "mt-2 w-full border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none transition-colors focus:border-magenta";
  const labelClass = "font-data text-xs uppercase tracking-wide text-mauve";

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="border border-hairline bg-plum-2 p-6"
      >
        <h3 className="font-display text-lg text-warm-white">
          {editingId ? "Edit wallet" : "Add a wallet"}
        </h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Currency</label>
            <input
              type="text"
              required
              placeholder="BTC"
              value={form.currency}
              onChange={(e) => updateField("currency", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Label</label>
            <input
              type="text"
              required
              placeholder="Bitcoin"
              value={form.label}
              onChange={(e) => updateField("label", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Network</label>
            <input
              type="text"
              required
              placeholder="Bitcoin, ERC-20, TRC-20…"
              value={form.network}
              onChange={(e) => updateField("network", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 font-body text-sm text-[#d9738f]">{error}</p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="gradient-magma px-5 py-2.5 font-body text-sm text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting
              ? "Saving…"
              : editingId
                ? "Save changes"
                : "Add wallet"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="border border-hairline px-5 py-2.5 font-body text-sm text-mauve"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-10">
        <h3 className="font-display text-lg text-warm-white">
          Existing wallets
        </h3>
        {wallets === null ? (
          <p className="mt-3 font-body text-sm text-mauve">Loading…</p>
        ) : wallets.length === 0 ? (
          <p className="mt-3 font-body text-sm text-mauve">
            No wallets added yet.
          </p>
        ) : (
          <div className="mt-4 border-t border-hairline">
            {wallets.map((wallet) => (
              <div
                key={wallet._id}
                className="flex flex-col gap-3 border-b border-hairline py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-body text-sm text-warm-white">
                    {wallet.currency} — {wallet.label}{" "}
                    <span className="font-data text-xs text-mauve">
                      ({wallet.network})
                    </span>
                  </div>
                  <div className="mt-0.5 break-all font-data text-xs text-mauve">
                    {wallet.address}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-data text-xs ${
                      wallet.isActive ? "text-amber" : "text-mauve"
                    }`}
                  >
                    {wallet.isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => toggleActive(wallet)}
                    className="border border-hairline px-3 py-1.5 font-body text-xs text-warm-white transition-colors hover:border-mauve"
                  >
                    {wallet.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => startEdit(wallet)}
                    className="border border-hairline px-3 py-1.5 font-body text-xs text-warm-white transition-colors hover:border-mauve"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(wallet._id)}
                    className="border border-hairline px-3 py-1.5 font-body text-xs text-[#d9738f] transition-colors hover:border-[#d9738f]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}