"use client";

import { useEffect, useState } from "react";
import Sparkline from "./Sparkline";

function formatPrice(price) {
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function StockPrices() {
  const [stocks, setStocks] = useState(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  async function load() {
    try {
      const res = await fetch("/api/stock-prices");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load stock prices");
        return;
      }
      setStocks(data.stocks);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      setError("Could not load stock prices");
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  if (error && stocks === null) {
    return <p className="font-body text-sm text-[#d9738f]">{error}</p>;
  }

  if (stocks === null) {
    return <p className="font-body text-sm text-mauve">Loading stocks…</p>;
  }

  return (
    <div>
      {lastUpdated && (
        <div className="mb-4 flex items-center justify-between">
          <span className="font-data text-[11px] text-mauve">
            Live pricing, refreshed every 60s · 5-day charts
          </span>
          <span className="font-data text-[11px] text-mauve">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      )}

      <div className="max-h-[560px] overflow-y-auto border-t border-hairline">
        <div className="sticky top-0 z-10 hidden grid-cols-[2fr_1.2fr_1fr_1.4fr] gap-4 border-b border-hairline bg-aubergine py-3 font-data text-[11px] uppercase tracking-wide text-mauve md:grid">
          <span>Company</span>
          <span className="text-right">Price</span>
          <span className="text-right">Today</span>
          <span className="text-center">5d chart</span>
        </div>

        {stocks.map((stock) => {
          const up = stock.change >= 0;
          return (
            <div
              key={stock.symbol}
              className="grid grid-cols-[1.6fr_1fr_1fr] items-center gap-3 border-b border-hairline py-4 md:grid-cols-[2fr_1.2fr_1fr_1.4fr] md:gap-4"
            >
              <div>
                <div className="font-body text-sm text-warm-white">
                  {stock.name}
                </div>
                <div className="font-data text-xs text-mauve">
                  {stock.symbol}
                </div>
              </div>

              <div className="text-right font-data text-sm text-warm-white">
                {formatPrice(stock.price)}
                <div
                  className={`mt-0.5 font-data text-xs md:hidden ${
                    up ? "text-amber" : "text-[#d9738f]"
                  }`}
                >
                  {up ? "+" : ""}
                  {stock.change.toFixed(2)}%
                </div>
              </div>

              <div
                className={`hidden text-right font-data text-xs md:block ${
                  up ? "text-amber" : "text-[#d9738f]"
                }`}
              >
                {up ? "+" : ""}
                {stock.change.toFixed(2)}%
              </div>

              <Sparkline
                data={stock.sparkline}
                up={up}
                className="h-8 w-full"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
