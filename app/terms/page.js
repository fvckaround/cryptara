import StaticPageLayout from "../components/StaticPageLayout";

export const metadata = {
  title: "Terms — Cryptara Holdings",
};

export default function TermsPage() {
  return (
    <StaticPageLayout
      title="Terms of Service"
      subtitle="Last updated: September 2026"
    >
      <section>
        <h2 className="font-display text-lg text-warm-white">
          1. Acceptance of terms
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          By creating an account or using Cryptara Holdings, you agree to
          these terms. If you don&apos;t agree, please don&apos;t use the
          service.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          2. Eligibility
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          You must be at least 18 years old and legally able to enter into
          a binding agreement in your jurisdiction to open an account.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          3. Your account
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          You&apos;re responsible for keeping your login details secure and
          for all activity under your account. Contact us immediately if
          you suspect unauthorized access.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          4. Holding plans, deposits, and withdrawals
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Deposits are reviewed before being credited to your account
          balance. Committing balance to a holding plan locks it in for
          the plan&apos;s stated term; principal and profit are paid out
          automatically at maturity. Withdrawal requests are reviewed
          before funds are sent. We reserve the right to decline a
          deposit or withdrawal at our discretion, including for
          suspected fraud or compliance reasons.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          5. Fees
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Any fees associated with a holding plan are stated on the plan
          itself at the time you invest. We don&apos;t charge hidden fees
          beyond what&apos;s shown.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          6. Prohibited use
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          You may not use Cryptara Holdings for money laundering, fraud,
          or any unlawful purpose, or attempt to interfere with the
          security or normal operation of the platform.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          7. Risk
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Digital assets are volatile and carry risk of loss. See our{" "}
          <a href="/risk-disclosure" className="text-amber underline">
            Risk Disclosure
          </a>{" "}
          for full detail before using the service.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          8. Limitation of liability
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          To the fullest extent permitted by law, Cryptara Holdings is not
          liable for indirect, incidental, or consequential losses arising
          from your use of the service.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          9. Termination
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          We may suspend or close an account that violates these terms or
          for compliance reasons. You may close your account at any time
          by contacting support.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          10. Changes to these terms
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          We may update these terms from time to time. Continued use of
          the service after a change means you accept the updated terms.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          11. Governing law
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          These terms are governed by the laws of the United Kingdom.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">Contact</h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Questions about these terms:{" "}
          <a
            href="mailto:cryptaraholding@outlook.com"
            className="text-amber underline"
          >
            cryptaraholding@outlook.com
          </a>
        </p>
      </section>

      <p className="border-t border-hairline pt-6 font-body text-xs text-mauve">
        This document is a general template and is not legal advice. Have
        it reviewed by a qualified lawyer familiar with financial services
        regulation in your operating jurisdiction before relying on it.
      </p>
    </StaticPageLayout>
  );
}