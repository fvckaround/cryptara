import StaticPageLayout from "../components/StaticPageLayout";

export const metadata = {
  title: "Risk Disclosure — Cryptara Holdings",
};

export default function RiskDisclosurePage() {
  return (
    <StaticPageLayout
      title="Risk Disclosure"
      subtitle="Please read this before opening an account or committing funds to a holding plan."
    >
      <section>
        <h2 className="font-display text-lg text-warm-white">
          Digital assets are volatile
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          The value of cryptocurrencies can rise and fall significantly
          over short periods. Target returns shown on our holding plans
          are indicative, based on historical performance, and are not
          guaranteed.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Your capital is at risk
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          You could lose some or all of the funds you deposit or invest.
          Only commit funds you can afford to lose. Nothing on this site
          should be treated as a guarantee of return.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Fixed-term liquidity
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Funds committed to a holding plan are locked in for that
          plan&apos;s stated term. Early withdrawal, where available, may
          reduce your realized return. Plan directly through your
          dashboard to see current terms before committing.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Custody risk
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          While we maintain custody controls described on our{" "}
          <a href="/security" className="text-amber underline">
            Security page
          </a>
          , no custody arrangement eliminates risk entirely — including
          the risk of theft, technical failure, or insolvency.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Not financial advice
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Nothing on this site is financial, investment, tax, or legal
          advice. Consider seeking independent professional advice before
          making a decision, and only invest what you can afford to
          lose.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Regulatory status
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Digital asset services may not carry the same regulatory
          protections as traditional banking or investment products in
          your jurisdiction. You should understand the regulatory status
          of digital asset services where you live before using this
          platform.
        </p>
      </section>
    </StaticPageLayout>
  );
}