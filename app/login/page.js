"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      if (data.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
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
          Log in
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="font-data text-xs uppercase tracking-wide text-mauve">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 w-full border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none transition-colors focus:border-magenta"
            />
          </div>
          <div>
            <label className="font-data text-xs uppercase tracking-wide text-mauve">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="mt-2 w-full border border-hairline bg-plum px-3 py-2 font-body text-sm text-warm-white outline-none transition-colors focus:border-magenta"
            />
          </div>

          {error && (
            <p className="font-body text-sm text-[#d9738f]">{error}</p>
          )}

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="font-body text-xs text-mauve hover:text-amber"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gradient-magma w-full px-4 py-3 font-body text-sm text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 font-body text-sm text-mauve">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-amber underline">
            Open one
          </Link>
        </p>
      </div>
    </div>
  );
}