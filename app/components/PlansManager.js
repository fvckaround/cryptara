"use client";

import { useEffect, useState } from "react";

const EMPTY_FORM = {
  name: "",
  tagline: "",
  dailyRate: "",
  termDays: "",
  minDeposit: "",
  maxDeposit: "",
  popular: false,
  features: "",
};

export default function PlansManager() {
  const [plans, setPlans] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/admin/plans");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load plans");
        return;
      }
      setPlans(data.plans);
    } catch (err) {
      setError("Could not load plans");
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEdit(plan) {
    setEditingId(plan._id);
    setForm({
      name: plan.name,
      tagline: plan.tagline,
      dailyRate: plan.dailyRate,
      termDays: plan.termDays,
      minDeposit: plan.minDeposit,
      maxDeposit: plan.maxDeposit ?? "",
      popular: plan.popular,
      features: plan.features.join("\n"),
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

    const payload = {
      name: form.name,
      tagline: form.tagline,
      dailyRate: Number(form.dailyRate),
      termDays: Number(form.termDays),
      minDeposit: Number(form.minDeposit),
      maxDeposit: form.maxDeposit ? Number(form.maxDeposit) : null,
      popular: form.popular,
      features: form.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    };

    try {
      const url = editingId
        ? `/api/admin/plans/${editingId}`
        : "/api/admin/plans";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not save plan");
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

  async function toggleActive(plan) {
    try {
      await fetch(`/api/admin/plans/${plan._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !plan.isActive }),
      });
      await load();
    } catch (err) {
      setError("Could not update plan");
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError("Could not delete plan");
    }
  }

  async function handleSeed() {
    setSeeding(true);
    setError("");
    try {
      const res = await fetch("/api/admin/plans/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not seed plans");
        setSeeding(false);
        return;
      }
      setSeeding(false);
      await load();
    } catch (err) {
      setError("Could not seed plans");
      setSeeding(false);
    }
  }

  const inputClass =
    "mt-2 w-full border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none transition-colors focus:border-magenta";
  const labelClass = "font-data text-xs uppercase tracking-wide text-mauve";

  return (
    <div>
      {plans !== null && plans.length === 0 && (
        <div className="mb-8 border border-magenta/40 bg-plum p-6">
          <p className="font-body text-sm text-warm-white">
            No plans exist yet.
          </p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="gradient-magma mt-4 px-4 py-2 font-body text-sm text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {seeding ? "Seeding…" : "Seed default plans (Foundation, Compounding, Principal)"}
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border border-hairline bg-plum-2 p-6"
      >
        <h3 className="font-display text-lg text-warm-white">
          {editingId ? "Edit plan" : "Add a plan"}
        </h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input
              type="text"
              required
              value={form.tagline}
              onChange={(e) => updateField("tagline", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Daily rate (%)</label>
            <input
              type="number"
              step="0.1"
              required
              value={form.dailyRate}
              onChange={(e) => updateField("dailyRate", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Term (days)</label>
            <input
              type="number"
              required
              value={form.termDays}
              onChange={(e) => updateField("termDays", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Minimum deposit ($)</label>
            <input
              type="number"
              required
              value={form.minDeposit}
              onChange={(e) => updateField("minDeposit", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Maximum deposit ($, blank = no limit)
            </label>
            <input
              type="number"
              value={form.maxDeposit}
              onChange={(e) => updateField("maxDeposit", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClass}>Features (one per line)</label>
          <textarea
            rows={4}
            value={form.features}
            onChange={(e) => updateField("features", e.target.value)}
            className={inputClass}
          />
        </div>

        <label className="mt-4 flex items-center gap-2 font-body text-sm text-mauve">
          <input
            type="checkbox"
            checked={form.popular}
            onChange={(e) => updateField("popular", e.target.checked)}
            className="h-4 w-4 accent-magenta"
          />
          Mark as &quot;Most popular&quot;
        </label>

        {error && (
          <p className="mt-3 font-body text-sm text-[#d9738f]">{error}</p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="gradient-magma px-5 py-2.5 font-body text-sm text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Saving…" : editingId ? "Save changes" : "Add plan"}
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
          Existing plans
        </h3>
        {plans === null ? (
          <p className="mt-3 font-body text-sm text-mauve">Loading…</p>
        ) : plans.length === 0 ? (
          <p className="mt-3 font-body text-sm text-mauve">
            No plans added yet.
          </p>
        ) : (
          <div className="mt-4 border-t border-hairline">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="flex flex-col gap-3 border-b border-hairline py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-body text-sm text-warm-white">
                    {plan.name}{" "}
                    {plan.popular && (
                      <span className="font-data text-xs text-amber">
                        (Most popular)
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 font-body text-xs text-mauve">
                    {plan.dailyRate}% / daily · {plan.termDays} days · $
                    {plan.minDeposit.toLocaleString()}
                    {plan.maxDeposit
                      ? ` – $${plan.maxDeposit.toLocaleString()}`
                      : "+"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-data text-xs ${
                      plan.isActive ? "text-amber" : "text-mauve"
                    }`}
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={() => toggleActive(plan)}
                    className="border border-hairline px-3 py-1.5 font-body text-xs text-warm-white transition-colors hover:border-mauve"
                  >
                    {plan.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => startEdit(plan)}
                    className="border border-hairline px-3 py-1.5 font-body text-xs text-warm-white transition-colors hover:border-mauve"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
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