import StaticPageLayout from "../components/StaticPageLayout";

export const metadata = {
  title: "Security — Cryptara Holdings",
};

export default function SecurityPage() {
  return (
    <StaticPageLayout
      title="Security"
      subtitle="How we treat custody of client assets, and how to keep your own account secure."
    >
      <section>
        <h2 className="font-display text-lg text-warm-white">
          Cold storage custody
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          The majority of client assets are held in geographically
          distributed offline wallets, air-gapped from any
          internet-connected system, reducing exposure to remote attacks.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Multi-signature withdrawals
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Every withdrawal requires sign-off from multiple independent key
          holders before funds move — no single person can move client
          funds alone.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Independent audits
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Reserves are reviewed on a regular basis to confirm client
          balances are backed by assets actually held in custody.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Platform security
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Passwords are never stored in plain text. Sessions are secured
          with signed, expiring tokens, and admin actions (approving
          deposits, withdrawals, and account changes) are restricted to
          verified admin accounts only.
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Keeping your own account secure
        </h2>
        <ul className="mt-3 space-y-2 font-body text-sm leading-relaxed text-mauve">
          <li>— Use a unique, strong password you don&apos;t reuse elsewhere.</li>
          <li>— Never share your password or one-time codes with anyone, including someone claiming to be Cryptara support.</li>
          <li>— Double-check the destination address before submitting a withdrawal — transactions can&apos;t be reversed once sent.</li>
          <li>— Log out on shared or public devices.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Report a security issue
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          If you believe you&apos;ve found a security vulnerability,
          please report it to{" "}
          <a
            href="mailto:cryptaraholding@outlook.com"
            className="text-amber underline"
          >
            cryptaraholding@outlook.com
          </a>{" "}
          rather than disclosing it publicly. We take these reports
          seriously and will respond promptly.
        </p>
      </section>
    </StaticPageLayout>
  );
}