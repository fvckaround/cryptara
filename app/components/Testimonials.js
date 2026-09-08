const TESTIMONIALS = [
  {
    quote:
      "I've moved money through three different crypto platforms. This is the first one where I could actually explain to my accountant what I was invested in.",
    name: "J. Whitfield",
    role: "Compounding plan, 14 months",
  },
  {
    quote:
      "The dashboard matching what's actually in custody, updated in real time, is the thing that got me to fund a second account.",
    name: "H. Mercer",
    role: "Principal plan, 8 months",
  },
  {
    quote:
      "Support answered a custody question directly instead of pointing me to a help article. That's rare in this space.",
    name: "R. Ashworth",
    role: "Foundation plan, 5 months",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl text-warm-white md:text-3xl">
          From current holders
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="border-t border-magenta pt-4 transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="font-body text-sm leading-relaxed text-warm-white">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 font-data text-xs text-amber">
                {t.name}
              </div>
              <div className="font-body text-xs text-mauve">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}