"use client";

import { useEffect, useState } from "react";

function buildSparklinePoints(series, width, height) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  return series
    .map((value, i) => {
      const x = (i / (series.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

const SEED_ASSETS = [
  { symbol: "BTC", name: "Bitcoin", price: 68420.15, change: 2.34 },
  { symbol: "ETH", name: "Ethereum", price: 3814.62, change: 1.12 },
  { symbol: "SOL", name: "Solana", price: 178.9, change: -0.87 },
  { symbol: "LINK", name: "Chainlink", price: 21.44, change: 3.02 },
];

export default function HoldingsTicker() {
  const [assets, setAssets] = useState(SEED_ASSETS);
  const [series, setSeries] = useState([
    300000, 304500, 302100, 309800, 315200, 311900, 320400, 336000,
  ]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prev) =>
        prev.map((asset) => {
          const drift = (Math.random() - 0.48) * (asset.price * 0.0012);
          const newPrice = Math.max(0.01, asset.price + drift);
          const changeDrift = (Math.random() - 0.5) * 0.06;
          return {
            ...asset,
            price: newPrice,
            change: asset.change + changeDrift,
          };
        })
      );
      setSeries((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(1000, last + (Math.random() - 0.42) * 4000);
        return [...prev.slice(1), next];
      });
      setTick((t) => t + 1);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const totalValue = series[series.length - 1];
  const points = buildSparklinePoints(series, 280, 60);

  return (
    <div className="w-full overflow-hidden border border-hairline bg-plum">
      <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
        <span className="font-data text-[11px] tracking-wide text-mauve">
          Portfolio overview
        </span>
        <span className="flex items-center gap-2 font-data text-[11px] text-amber">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-amber"
            style={{ opacity: tick % 2 === 0 ? 1 : 0.4 }}
          />
          live
        </span>
      </div>

      <div className="px-6 py-6">
        <div className="text-gradient-magma font-display text-2xl sm:text-3xl">
          $
          {totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </div>
        <svg viewBox="0 0 280 60" className="mt-4 h-16 w-full">
          <polyline
            points={points}
            fill="none"
            stroke="url(#magmaLine)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="magmaLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c4306b" />
              <stop offset="100%" stopColor="#e8862f" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="border-t border-hairline">
        {assets.map((asset) => (
          <div
            key={asset.symbol}
            className="flex items-center justify-between border-b border-hairline px-6 py-4 last:border-b-0"
          >
            <div>
              <div className="font-body text-sm text-warm-white">
                {asset.symbol}
              </div>
              <div className="font-body text-xs text-mauve">
                {asset.name}
              </div>
            </div>
            <div className="text-right">
              <div className="font-data text-sm text-warm-white">
                $
                {asset.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div
                className={`font-data text-xs ${
                  asset.change >= 0 ? "text-amber" : "text-[#d9738f]"
                }`}
              >
                {asset.change >= 0 ? "+" : ""}
                {asset.change.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}