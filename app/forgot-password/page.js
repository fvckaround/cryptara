"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-aubergine px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-lg text-warm-white">
          Cryptara Holdings
        </Link>
        <h1 className="mt-8 font-display text-2xl text-warm-white">
          Reset your password
        </h1>

        {submitted ? (
          <div className="mt-8 border border-magenta/40 bg-plum p-6">
            <p className="font-body text-sm text-warm-white">
              If an account exists with that email, we&apos;ve sent a
              reset link.
            </p>
            <p className="mt-2 font-body text-sm text-mauve">
              Check your inbox and follow the link — it expires in 30
              minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="font-data text-xs uppercase tracking-wide text-mauve">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none transition-colors focus:border-magenta"
              />
            </div>

            {error && (
              <p className="font-body text-sm text-[#d9738f]">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="gradient-magma w-full px-4 py-3 font-body text-sm text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-6 font-body text-sm text-mauve">
          <Link href="/login" className="text-amber underline">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}