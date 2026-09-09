import MarketPrices from "./MarketPrices";

export default function MarketsSection() {
  return (
    <section id="markets" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl text-warm-white md:text-3xl">
          Live markets
        </h2>
        <p className="mt-3 max-w-lg font-body text-sm text-mauve">
          Real-time pricing for the top digital assets by market cap.
        </p>

        <div className="mt-10">
          <MarketPrices />
        </div>
      </div>
    </section>
  );
}