const SECURITY_POINTS = [
  {
    title: "Cold storage custody",
    body: "97% of client assets are held in geographically distributed offline wallets, air-gapped from any internet-connected system.",
  },
  {
    title: "Multi-signature withdrawals",
    body: "Every withdrawal requires sign-off from multiple independent key holders before funds move.",
  },
  {
    title: "Independent audits",
    body: "Reserves are verified quarterly by an independent third party, with proof-of-reserves published to account holders.",
  },
  {
    title: "Insurance coverage",
    body: "Custodied assets are covered against theft and internal fraud up to policy limits held with our custody partner.",
  },
];

export default function SecuritySection() {
  return (
    <section id="security" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl text-warm-white md:text-3xl">
          Security & custody
        </h2>
        <p className="mt-3 max-w-lg font-body text-sm text-mauve">
          Holding digital assets on someone&apos;s behalf is a custody
          problem before it&apos;s an investment problem. Here&apos;s how we
          treat it.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {SECURITY_POINTS.map((point) => (
            <div
              key={point.title}
              className="border-t border-magenta pt-4 transition-transform duration-300 hover:translate-x-1"
            >
              <h3 className="font-display text-lg text-warm-white">
                {point.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-mauve">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}