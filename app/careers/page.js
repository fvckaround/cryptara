import StaticPageLayout from "../components/StaticPageLayout";

export const metadata = {
  title: "Careers — Cryptara Holdings",
};

export default function CareersPage() {
  return (
    <StaticPageLayout
      title="Careers"
      subtitle="We're a small team, deliberately — fewer people between a client and a straight answer."
    >
      <section>
        <h2 className="font-display text-lg text-warm-white">
          Open roles
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          We don&apos;t have any open positions listed right now. When
          we&apos;re hiring, roles will be posted here first.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Get on our radar
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          If you think you&apos;d be a fit for a future role — custody
          operations, portfolio strategy, or client support — you&apos;re
          welcome to reach out directly at{" "}
          <a
            href="mailto:cryptaraholding@outlook.com"
            className="text-amber underline"
          >
            cryptaraholding@outlook.com
          </a>
          . Include a short note on what you&apos;d want to work on.
        </p>
      </section>
    </StaticPageLayout>
  );
}