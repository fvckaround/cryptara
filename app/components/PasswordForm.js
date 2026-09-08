"use client";

import { useState } from "react";

export default function PasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaved(false);

    if (form.newPassword !== form.confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not change password");
        setLoading(false);
        return;
      }

      setSaved(true);
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setLoading(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 w-full border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none transition-colors focus:border-magenta";
  const labelClass = "font-data text-xs uppercase tracking-wide text-mauve";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Current password</label>
        <input
          type="password"
          required
          value={form.currentPassword}
          onChange={(e) => updateField("currentPassword", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>New password</label>
        <input
          type="password"
          required
          minLength={8}
          value={form.newPassword}
          onChange={(e) => updateField("newPassword", e.target.value)}
          className={inputClass}
        />
        <p className="mt-1 font-body text-xs text-mauve">
          At least 8 characters
        </p>
      </div>

      <div>
        <label className={labelClass}>Confirm new password</label>
        <input
          type="password"
          required
          minLength={8}
          value={form.confirmNewPassword}
          onChange={(e) =>
            updateField("confirmNewPassword", e.target.value)
          }
          className={inputClass}
        />
      </div>

      {error && <p className="font-body text-sm text-[#d9738f]">{error}</p>}
      {saved && (
        <p className="font-body text-sm text-amber">Password updated</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="gradient-magma px-5 py-2.5 font-body text-sm text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}