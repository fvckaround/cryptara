const FEATURES = [
  {
    title: "Transparent allocation",
    body: "Every holding plan states exactly which assets it covers and how they're weighted — no black-box strategies.",
  },
  {
    title: "No lock-in surprises",
    body: "Term lengths and early-exit terms are shown before you fund an account, not buried in a footnote after.",
  },
  {
    title: "Direct human support",
    body: "A dedicated account contact for anything above the Foundation tier — not a ticket queue.",
  },
  {
    title: "Real-time reporting",
    body: "Balance, gains, and allocation update continuously on your dashboard, matched to custody records.",
  },
];

export default function FeatureHighlights() {
  return (
    <section id="features" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl text-warm-white md:text-3xl">
          Why investors choose Cryptara
        </h2>
        <p className="mt-3 max-w-lg font-body text-sm text-mauve">
          Not the highest advertised yield — the clearest picture of what
          you actually hold.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="border-t border-amber pt-4 transition-transform duration-300 hover:translate-x-1"
            >
              <h3 className="font-display text-lg text-warm-white">
                {feature.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-mauve">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}