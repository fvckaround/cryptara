import StaticPageLayout from "../components/StaticPageLayout";

export const metadata = {
  title: "Privacy Policy — Cryptara Holdings",
};

export default function PrivacyPage() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      subtitle="Last updated: September 2026"
    >
      <section>
        <h2 className="font-display text-lg text-warm-white">
          Information we collect
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          When you open an account, we collect your name, email, phone
          number, country, and date of birth. When you make a deposit or
          request a withdrawal, we collect the relevant transaction
          details, including wallet addresses you provide.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          How we use it
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          We use this information to operate your account, process
          deposits and withdrawals, communicate with you about your
          account activity, and meet our legal and compliance
          obligations.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          How we share it
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          We don&apos;t sell your personal information. We share it only
          with service providers who help us operate the platform (such
          as our email and hosting providers), or where required by law.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Data retention
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          We retain account and transaction data for as long as your
          account is active and afterward as needed to meet legal,
          accounting, or reporting obligations.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Your rights
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          You can review and update most of your account details from{" "}
          <a href="/dashboard/settings" className="text-amber underline">
            Settings
          </a>{" "}
          once logged in. To request a copy of your data or ask us to
          delete your account, contact us directly.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">Cookies</h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          We use essential cookies to keep you logged in and to remember
          your session. We don&apos;t use third-party advertising
          cookies.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">Contact</h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Questions about this policy or your data:{" "}
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
        it reviewed by a qualified lawyer familiar with data protection
        law (such as UK GDPR) in your operating jurisdiction before
        relying on it.
      </p>
    </StaticPageLayout>
  );
}