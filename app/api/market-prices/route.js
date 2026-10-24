import { NextResponse } from "next/server";

// Keep roughly 40 points of the 7-day line so the payload stays small.
function downsample(values, target = 40) {
  if (!Array.isArray(values) || values.length <= target) return values || [];
  const step = (values.length - 1) / (target - 1);
  const out = [];
  for (let i = 0; i < target; i++) {
    out.push(values[Math.round(i * step)]);
  }
  return out;
}

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h",
      { next: { revalidate: 30 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Could not fetch market prices" },
        { status: 502 }
      );
    }

    const data = await res.json();

    const coins = data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      sparkline: downsample(coin.sparkline_in_7d?.price),
    }));

    return NextResponse.json({ coins }, { status: 200 });
  } catch (err) {
    console.error("Market prices fetch error:", err);
    return NextResponse.json(
      { error: "Could not fetch market prices" },
      { status: 500 }
    );
  }
}
