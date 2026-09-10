"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not reset password");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-lg text-warm-white">
          Cryptara Holdings
        </Link>
        <div className="mt-8 border border-magenta/40 bg-plum p-6">
          <p className="font-body text-sm text-warm-white">
            This reset link is missing or invalid.
          </p>
          <Link
            href="/forgot-password"
            className="mt-3 inline-block font-body text-sm text-amber underline"
          >
            Request a new one
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-lg text-warm-white">
          Cryptara Holdings
        </Link>
        <div className="mt-8 border border-magenta/40 bg-plum p-6">
          <p className="font-display text-lg text-warm-white">
            Password updated
          </p>
          <p className="mt-2 font-body text-sm text-mauve">
            You can now log in with your new password.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="gradient-magma mt-4 px-4 py-2 font-body text-sm text-warm-white transition-opacity hover:opacity-90"
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="font-display text-lg text-warm-white">
        Cryptara Holdings
      </Link>
      <h1 className="mt-8 font-display text-2xl text-warm-white">
        Choose a new password
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="font-data text-xs uppercase tracking-wide text-mauve">
            New password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none transition-colors focus:border-magenta"
          />
          <p className="mt-1 font-body text-xs text-mauve">
            At least 8 characters
          </p>
        </div>
        <div>
          <label className="font-data text-xs uppercase tracking-wide text-mauve">
            Confirm new password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-aubergine px-6">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}