"use client";

import { useEffect, useState } from "react";

export default function ReferralsPanel() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/referrals");
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || "Could not load referrals");
          return;
        }
        setData(json);
      } catch (err) {
        setError("Could not load referrals");
      }
    }
    load();
  }, []);

  async function handleCopy(referralLink) {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (error) {
    return <p className="font-body text-sm text-[#d9738f]">{error}</p>;
  }

  if (!data) {
    return <p className="font-body text-sm text-mauve">Loading…</p>;
  }

  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${data.myReferralCode}`
      : `/register?ref=${data.myReferralCode}`;

  return (
    <div className="space-y-10">
      <div className="border border-hairline bg-plum p-6">
        <span className="font-data text-xs uppercase tracking-wide text-mauve">
          Your referral code
        </span>
        <div className="text-gradient-magma mt-2 font-display text-2xl">
          {data.myReferralCode}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex-1 break-all border border-hairline bg-plum-2 px-3 py-2 font-data text-xs text-warm-white">
            {referralLink}
          </div>
          <button
            onClick={() => handleCopy(referralLink)}
            className="gradient-magma px-4 py-2 font-body text-sm text-warm-white transition-opacity hover:opacity-90"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>

        <p className="mt-4 font-body text-xs text-mauve">
          Earn 10% of every deposit made by someone who signs up with your
          code — not just their first one.
        </p>
      </div>

      <div className="border border-hairline bg-plum p-6">
        <span className="font-data text-xs uppercase tracking-wide text-mauve">
          Total earned from referrals
        </span>
        <div className="text-gradient-magma mt-2 font-display text-2xl">
          $
          {data.totalEarned.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg text-warm-white">
          People you&apos;ve referred
        </h3>
        {data.referredUsers.length === 0 ? (
          <p className="mt-3 font-body text-sm text-mauve">
            Nobody has signed up with your code yet.
          </p>
        ) : (
          <div className="mt-4 border-t border-hairline">
            {data.referredUsers.map((u, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-hairline py-3"
              >
                <span className="font-body text-sm text-warm-white">
                  {u.fullName}
                </span>
                <span className="font-body text-xs text-mauve">
                  Joined{" "}
                  {new Date(u.joinedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-display text-lg text-warm-white">
          Bonus history
        </h3>
        {data.bonuses.length === 0 ? (
          <p className="mt-3 font-body text-sm text-mauve">
            No referral bonuses yet — they show up here once a referred
            deposit is approved.
          </p>
        ) : (
          <div className="mt-4 border-t border-hairline">
            {data.bonuses.map((b, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-hairline py-3"
              >
                <div>
                  <div className="font-body text-sm text-warm-white">
                    {b.referredUserName}
                  </div>
                  <div className="mt-0.5 font-body text-xs text-mauve">
                    Deposit: $
                    {b.depositAmountUsd.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <span className="font-data text-sm text-amber">
                  +$
                  {b.bonusAmountUsd.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}