import StaticPageLayout from "../components/StaticPageLayout";

export const metadata = {
  title: "About — Cryptara Holdings",
};

export default function AboutPage() {
  return (
    <StaticPageLayout
      title="About Cryptara Holdings"
      subtitle="A digital asset holding company built on custody, allocation, and plain statements of what you hold."
    >
      <section>
        <h2 className="font-display text-lg text-warm-white">
          What we do
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Cryptara Holdings manages diversified crypto portfolios on behalf
          of long-term holders. We run fixed-term holding plans backed by
          custodied assets, with returns and terms stated upfront — no
          leverage products, no marketing tiers dressed up as investment
          strategy.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          How we think about custody
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Holding digital assets on someone&apos;s behalf is a custody
          problem before it&apos;s an investment problem. Client funds are
          held in cold storage with multi-signature controls, and reserves
          are reviewed on a regular basis. Full detail is on our{" "}
          <a href="/security" className="text-amber underline">
            Security page
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Who we serve
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Our holding plans are built for individual investors who want a
          fixed-term, transparently priced way to hold crypto — from
          first-time depositors on the Foundation plan through to larger
          allocations on Principal.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Get in touch
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Questions about an account, a holding plan, or anything else —
          reach us at{" "}
          <a
            href="mailto:cryptaraholding@outlook.com"
            className="text-amber underline"
          >
            cryptaraholding@outlook.com
          </a>{" "}
          or visit our{" "}
          <a href="/contact" className="text-amber underline">
            Contact page
          </a>
          .
        </p>
      </section>
    </StaticPageLayout>
  );
}