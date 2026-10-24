import MarketPrices from "./MarketPrices";
import StockPrices from "./StockPrices";

export default function MarketsSection() {
  return (
    <section id="markets" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl text-warm-white md:text-3xl">
          Live markets
        </h2>
        <p className="mt-3 max-w-lg font-body text-sm text-mauve">
          Real-time pricing and charts for the top 50 digital assets and 50
          leading stocks. The lists scroll on their own — hover or touch to
          pause.
        </p>

        <h3 className="mt-12 font-display text-xl text-warm-white">Crypto</h3>
        <div className="mt-4">
          <MarketPrices />
        </div>

        <h3 className="mt-16 font-display text-xl text-warm-white">Stocks</h3>
        <div className="mt-4">
          <StockPrices />
        </div>
      </div>
    </section>
  );
}
