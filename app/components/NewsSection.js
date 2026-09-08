const NEWS = [
  {
    date: "Aug 2026",
    title: "Q2 proof-of-reserves published",
    body: "Our latest independent audit confirms full custody backing across all three holding plans.",
  },
  {
    date: "Jun 2026",
    title: "Compounding plan term extended to 90 days",
    body: "Based on holder feedback, the Compounding plan now runs a longer term with an adjusted target range.",
  },
  {
    date: "Mar 2026",
    title: "Market note: volatility and holding periods",
    body: "A short note on why fixed-term holding plans behave differently from spot trading during drawdowns.",
  },
];

export default function NewsSection() {
  return (
    <section id="news" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl text-warm-white md:text-3xl">
          From the desk
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {NEWS.map((item) => (
            <div
              key={item.title}
              className="border-t border-hairline pt-4 transition-transform duration-300 hover:translate-x-1"
            >
              <span className="font-data text-xs text-amber">
                {item.date}
              </span>
              <h3 className="mt-2 font-display text-lg text-warm-white">
                {item.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-mauve">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}