"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/lib/countries";

export default function ProfileForm({ initialUser }) {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: initialUser.fullName || "",
    phone: initialUser.phone || "",
    country: initialUser.country || "",
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
    setLoading(true);

    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not save changes");
        setLoading(false);
        return;
      }

      setSaved(true);
      setLoading(false);
      router.refresh();
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
        <label className={labelClass}>Full name</label>
        <input
          type="text"
          required
          value={form.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          value={initialUser.email || ""}
          disabled
          className={`${inputClass} cursor-not-allowed opacity-60`}
        />
        <p className="mt-1 font-body text-xs text-mauve">
          Contact support to change your email address
        </p>
      </div>

      <div>
        <label className={labelClass}>Phone number</label>
        <input
          type="tel"
          required
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Country</label>
        <select
          required
          value={form.country}
          onChange={(e) => updateField("country", e.target.value)}
          className={`${inputClass} [color-scheme:dark]`}
        >
          <option value="" disabled>
            Select your country
          </option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="font-body text-sm text-[#d9738f]">{error}</p>}
      {saved && (
        <p className="font-body text-sm text-amber">Profile updated</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="gradient-magma px-5 py-2.5 font-body text-sm text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}