"use client";

import { useEffect, useState } from "react";

function formatPrice(price) {
  if (price >= 1) {
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`;
}

function formatMarketCap(cap) {
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
    const interval = setInterval(load, 60000);
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
            Live pricing, refreshed every 60s
          </span>
          <span className="font-data text-[11px] text-mauve">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      )}

      <div className="border-t border-hairline">
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b border-hairline py-3 font-data text-[11px] uppercase tracking-wide text-mauve md:grid">
          <span>Asset</span>
          <span className="text-right">Price</span>
          <span className="text-right">24h</span>
          <span className="text-right">Market cap</span>
        </div>

        {coins.map((coin) => (
          <div
            key={coin.id}
            className="grid grid-cols-2 items-center gap-3 border-b border-hairline py-4 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-4"
          >
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coin.image}
                alt={coin.name}
                className="h-6 w-6"
              />
              <div>
                <div className="font-body text-sm text-warm-white">
                  {coin.name}
                </div>
                <div className="font-data text-xs text-mauve">
                  {coin.symbol}
                </div>
              </div>
            </div>

            <div className="text-right font-data text-sm text-warm-white md:text-right">
              {formatPrice(coin.price)}
            </div>

            <div
              className={`text-right font-data text-xs ${
                coin.change24h >= 0 ? "text-amber" : "text-[#d9738f]"
              }`}
            >
              {coin.change24h >= 0 ? "+" : ""}
              {coin.change24h?.toFixed(2)}%
            </div>

            <div className="hidden text-right font-data text-xs text-mauve md:block">
              {formatMarketCap(coin.marketCap)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}