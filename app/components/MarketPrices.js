"use client";

import { useEffect, useState } from "react";
import Sparkline from "./Sparkline";

function formatPrice(price) {
  if (price >= 1) {
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`;
}

function formatMarketCap(cap) {
  if (!cap) return "—";
  if (cap >= 1_000_000_000_000) {
    return `$${(cap / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (cap >= 1_000_000_000) {
    return `$${(cap / 1_000_000_000).toFixed(2)}B`;
  }
  if (cap >= 1_000_000) {
    return `$${(cap / 1_000_000).toFixed(2)}M`;
  }
  return `$${cap.toLocaleString()}`;
}

export default function MarketPrices() {
  const [coins, setCoins] = useState(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  async function load() {
    try {
      const res = await fetch("/api/market-prices");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load prices");
        return;
      }
      setCoins(data.coins);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      setError("Could not load prices");
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (error && coins === null) {
    return <p className="font-body text-sm text-[#d9738f]">{error}</p>;
  }

  if (coins === null) {
    return <p className="font-body text-sm text-mauve">Loading prices…</p>;
  }

  return (
    <div>
      {lastUpdated && (
        <div className="mb-4 flex items-center justify-between">
          <span className="font-data text-[11px] text-mauve">
            Live pricing, refreshed every 30s · 7-day charts
          </span>
          <span className="font-data text-[11px] text-mauve">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      )}

      <div className="max-h-[560px] overflow-y-auto border-t border-hairline">
        <div className="sticky top-0 z-10 hidden grid-cols-[2fr_1.2fr_1fr_1.4fr_1.2fr] gap-4 border-b border-hairline bg-aubergine py-3 font-data text-[11px] uppercase tracking-wide text-mauve md:grid">
          <span>Asset</span>
          <span className="text-right">Price</span>
          <span className="text-right">24h</span>
          <span className="text-center">7d chart</span>
          <span className="text-right">Market cap</span>
        </div>

        {coins.map((coin) => {
          const up = (coin.change24h ?? 0) >= 0;
          return (
            <div
              key={coin.id}
              className="grid grid-cols-[1.6fr_1fr_1fr] items-center gap-3 border-b border-hairline py-4 md:grid-cols-[2fr_1.2fr_1fr_1.4fr_1.2fr] md:gap-4"
            >
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coin.image} alt={coin.name} className="h-6 w-6" />
                <div>
                  <div className="font-body text-sm text-warm-white">
                    {coin.name}
                  </div>
                  <div className="font-data text-xs text-mauve">
                    {coin.symbol}
                  </div>
                </div>
              </div>

              <div className="text-right font-data text-sm text-warm-white">
                {formatPrice(coin.price)}
                <div
                  className={`mt-0.5 font-data text-xs md:hidden ${
                    up ? "text-amber" : "text-[#d9738f]"
                  }`}
                >
                  {up ? "+" : ""}
                  {coin.change24h?.toFixed(2)}%
                </div>
              </div>

              <div
                className={`hidden text-right font-data text-xs md:block ${
                  up ? "text-amber" : "text-[#d9738f]"
                }`}
              >
                {up ? "+" : ""}
                {coin.change24h?.toFixed(2)}%
              </div>

              <Sparkline
                data={coin.sparkline}
                up={up}
                className="h-8 w-full"
              />

              <div className="hidden text-right font-data text-xs text-mauve md:block">
                {formatMarketCap(coin.marketCap)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
