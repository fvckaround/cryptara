"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResendMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setResendMessage("");
    setResending(true);

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not resend code");
        setResending(false);
        return;
      }

      setResendMessage("A new code has been sent.");
      setResending(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setResending(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="font-display text-lg text-warm-white">
        Cryptara Holdings
      </Link>
      <h1 className="mt-8 font-display text-2xl text-warm-white">
        Verify your email
      </h1>
      <p className="mt-2 font-body text-sm text-mauve">
        {email
          ? `We sent a 6-digit code to ${email}.`
          : "Enter the 6-digit code we emailed you."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="font-data text-xs uppercase tracking-wide text-mauve">
            Verification code
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="mt-2 w-full border border-hairline bg-plum px-3 py-3 text-center font-data text-2xl tracking-[0.5em] text-warm-white outline-none transition-colors focus:border-magenta"
          />
        </div>

        {error && (
          <p className="font-body text-sm text-[#d9738f]">{error}</p>
        )}
        {resendMessage && (
          <p className="font-body text-sm text-amber">{resendMessage}</p>
        )}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="gradient-magma w-full px-4 py-3 font-body text-sm text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Verifying…" : "Verify"}
        </button>
      </form>

      <p className="mt-6 font-body text-sm text-mauve">
        Didn&apos;t get a code?{" "}
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-amber underline disabled:opacity-60"
        >
          {resending ? "Sending…" : "Resend code"}
        </button>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-aubergine px-6">
      <Suspense fallback={null}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}