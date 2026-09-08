"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClaimAdminButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClaim() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/bootstrap", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not claim admin access");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 border border-magenta/40 bg-plum p-6">
      <p className="font-body text-sm text-warm-white">
        This account matches the configured admin email.
      </p>
      <button
        onClick={handleClaim}
        disabled={loading}
        className="gradient-magma mt-4 px-4 py-2 font-body text-sm text-warm-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Claiming…" : "Claim admin access"}
      </button>
      {error && (
        <p className="mt-3 font-body text-sm text-[#d9738f]">{error}</p>
      )}
    </div>
  );
}