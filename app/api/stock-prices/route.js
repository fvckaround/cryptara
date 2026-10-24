import { NextResponse } from "next/server";

export const maxDuration = 30;

const STOCKS = [
  ["AAPL", "Apple"], ["MSFT", "Microsoft"], ["NVDA", "NVIDIA"],
  ["GOOGL", "Alphabet"], ["AMZN", "Amazon"], ["META", "Meta Platforms"],
  ["TSLA", "Tesla"], ["AVGO", "Broadcom"], ["BRK-B", "Berkshire Hathaway"],
  ["JPM", "JPMorgan Chase"], ["LLY", "Eli Lilly"], ["V", "Visa"],
  ["WMT", "Walmart"], ["XOM", "Exxon Mobil"], ["MA", "Mastercard"],
  ["UNH", "UnitedHealth"], ["ORCL", "Oracle"], ["COST", "Costco"],
  ["PG", "Procter & Gamble"], ["JNJ", "Johnson & Johnson"], ["HD", "Home Depot"],
  ["NFLX", "Netflix"], ["BAC", "Bank of America"], ["ABBV", "AbbVie"],
  ["KO", "Coca-Cola"], ["CRM", "Salesforce"], ["CVX", "Chevron"],
  ["AMD", "AMD"], ["MRK", "Merck"], ["PEP", "PepsiCo"],
  ["TMO", "Thermo Fisher"], ["ADBE", "Adobe"], ["CSCO", "Cisco"],
  ["MCD", "McDonald's"], ["DIS", "Walt Disney"], ["INTC", "Intel"],
  ["NKE", "Nike"], ["PFE", "Pfizer"], ["QCOM", "Qualcomm"],
  ["T", "AT&T"], ["VZ", "Verizon"], ["BA", "Boeing"],
  ["GS", "Goldman Sachs"], ["IBM", "IBM"], ["UBER", "Uber"],
  ["PYPL", "PayPal"], ["SHOP", "Shopify"], ["COIN", "Coinbase"],
  ["SBUX", "Starbucks"], ["PLTR", "Palantir"],
];

async function fetchStock([symbol, name]) {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
        symbol
      )}?range=5d&interval=1h`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;

    const json = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result) return null;

    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];

    const series = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (typeof closes[i] === "number") {
        series.push({ t: timestamps[i], c: closes[i] });
      }
    }
    if (series.length < 2) return null;

    const last = series[series.length - 1];
    const price =
      typeof result.meta?.regularMarketPrice === "number"
        ? result.meta.regularMarketPrice
        : last.c;

    // Previous close = last hourly close that falls on an earlier trading day.
    const dayOf = (t) =>
      new Date((t + (result.meta?.gmtoffset || 0)) * 1000)
        .toISOString()
        .slice(0, 10);
    const lastDay = dayOf(last.t);
    let prevClose = null;
    for (let i = series.length - 1; i >= 0; i--) {
      if (dayOf(series[i].t) !== lastDay) {
        prevClose = series[i].c;
        break;
      }
    }
    if (prevClose === null) prevClose = series[0].c;

    return {
      symbol,
      name,
      price,
      change: ((price - prevClose) / prevClose) * 100,
      sparkline: series.map((p) => p.c),
    };
  } catch (err) {
    return null;
  }
}

export async function GET() {
  try {
    const results = await Promise.all(STOCKS.map(fetchStock));
    const stocks = results.filter(Boolean);

    if (stocks.length === 0) {
      return NextResponse.json(
        { error: "Could not fetch stock prices" },
        { status: 502 }
      );
    }

    return NextResponse.json({ stocks }, { status: 200 });
  } catch (err) {
    console.error("Stock prices fetch error:", err);
    return NextResponse.json(
      { error: "Could not fetch stock prices" },
      { status: 500 }
    );
  }
}
