"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { COUNTRIES } from "@/lib/countries";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    dateOfBirth: "",
    referralCode: "",
    termsAccepted: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setForm((prev) => ({ ...prev, referralCode: ref.toUpperCase() }));
    }
  }, [searchParams]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!form.termsAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 w-full border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none transition-colors focus:border-magenta";
  const labelClass = "font-data text-xs uppercase tracking-wide text-mauve";

  return (
    <div className="flex min-h-screen items-center justify-center bg-aubergine px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="font-display text-lg text-warm-white">
          Cryptara Holdings
        </Link>
        <h1 className="mt-8 font-display text-2xl text-warm-white">
          Open an account
        </h1>
        <p className="mt-2 font-body text-sm text-mauve">
          Takes about three minutes.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              required
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone number</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+44 7700 900000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Date of birth</label>
              <input
                type="date"
                required
                value={form.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Confirm password</label>
              <input
                type="password"
                required
                minLength={8}
                value={form.confirmPassword}
                onChange={(e) =>
                  updateField("confirmPassword", e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>
          <p className="-mt-3 font-body text-xs text-mauve">
            At least 8 characters
          </p>

          <div>
            <label className={labelClass}>Referral code (optional)</label>
            <input
              type="text"
              value={form.referralCode}
              onChange={(e) => updateField("referralCode", e.target.value)}
              className={inputClass}
            />
          </div>

          <label className="flex items-start gap-3 font-body text-sm text-mauve">
            <input
              type="checkbox"
              required
              checked={form.termsAccepted}
              onChange={(e) =>
                updateField("termsAccepted", e.target.checked)
              }
              className="mt-1 h-4 w-4 accent-magenta"
            />
            <span>
              I agree to the{" "}
              <span className="text-amber underline">Terms</span> and{" "}
              <span className="text-amber underline">Risk disclosure</span>
            </span>
          </label>

          {error && (
            <p className="font-body text-sm text-[#d9738f]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="gradient-magma w-full px-4 py-3 font-body text-sm text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 font-body text-sm text-mauve">
          Already have an account?{" "}
          <Link href="/login" className="text-amber underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}