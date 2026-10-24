"use client";

import { useState } from "react";
import MarketPrices from "./MarketPrices";
import StockPrices from "./StockPrices";

export default function MarketsSection() {
  const [tab, setTab] = useState("crypto");

  return (
    <section id="markets" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl text-warm-white md:text-3xl">
          Live markets
        </h2>
        <p className="mt-3 max-w-lg font-body text-sm text-mauve">
          Real-time pricing and charts for the top 50 digital assets and 50
          leading stocks. Scroll inside the table to see them all.
        </p>

        <div className="mt-8 flex gap-2">
          {[
            ["crypto", "Crypto"],
            ["stocks", "Stocks"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2 font-body text-sm transition-colors ${
                tab === key
                  ? "gradient-magma text-warm-white"
                  : "border border-hairline text-mauve hover:text-warm-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "crypto" ? <MarketPrices /> : <StockPrices />}
        </div>
      </div>
    </section>
  );
}
