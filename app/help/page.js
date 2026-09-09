import StaticPageLayout from "../components/StaticPageLayout";

const CATEGORIES = [
  {
    title: "Getting started",
    items: [
      {
        q: "How do I open an account?",
        a: "Go to Register, fill in your details, and verify your identity. Most accounts are approved within one business day.",
      },
      {
        q: "Is there a minimum to get started?",
        a: "The Foundation plan starts at $500 — see current plans on the homepage under Holding plans.",
      },
    ],
  },
  {
    title: "Deposits",
    items: [
      {
        q: "How do I make a deposit?",
        a: "From your dashboard, go to Deposit, choose a currency, send funds to the address shown, then submit the amount and (optionally) a transaction reference.",
      },
      {
        q: "How long does a deposit take to confirm?",
        a: "Deposits are reviewed manually and are typically confirmed within one business day. You'll get an email once it's confirmed.",
      },
    ],
  },
  {
    title: "Holding plans",
    items: [
      {
        q: "How do holding plans work?",
        a: "Each plan has a fixed entry range, daily rate, and term length. Once you invest, principal and profit are paid back to your account balance automatically when the term ends.",
      },
      {
        q: "Can I withdraw before my term ends?",
        a: "Early withdrawal terms vary by plan and are shown before you commit funds. Contact support if you need to discuss an early exit.",
      },
    ],
  },
  {
    title: "Withdrawals",
    items: [
      {
        q: "How do I request a withdrawal?",
        a: "From your dashboard, go to Withdraw, select the currency and network, enter the amount and destination address, then submit. The amount is reserved from your balance immediately.",
      },
      {
        q: "How long do withdrawals take?",
        a: "Withdrawal requests are reviewed before funds are sent, typically within one business day of approval.",
      },
    ],
  },
  {
    title: "Account & security",
    items: [
      {
        q: "How do I change my password?",
        a: "Go to Settings from your dashboard and use the Password section.",
      },
      {
        q: "What happens if my account gets frozen?",
        a: "A frozen account can't log in, deposit, withdraw, or invest until it's reviewed. Contact support for details.",
      },
    ],
  },
];

export const metadata = {
  title: "Help Center — Cryptara Holdings",
};

export default function HelpPage() {
  return (
    <StaticPageLayout
      title="Help center"
      subtitle="Common questions, grouped by topic. Can't find what you need?"
    >
      {CATEGORIES.map((category) => (
        <section key={category.title}>
          <h2 className="font-display text-lg text-warm-white">
            {category.title}
          </h2>
          <div className="mt-4 space-y-5">
            {category.items.map((item) => (
              <div key={item.q}>
                <p className="font-body text-sm text-warm-white">
                  {item.q}
                </p>
                <p className="mt-1 font-body text-sm leading-relaxed text-mauve">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section>
        <h2 className="font-display text-lg text-warm-white">
          Still need help?
        </h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
          Reach us at{" "}
          <a
            href="mailto:cryptaraholding@outlook.com"
            className="text-amber underline"
          >
            cryptaraholding@outlook.com
          </a>{" "}
          or use the{" "}
          <a href="/contact" className="text-amber underline">
            contact form
          </a>
          .
        </p>
      </section>
    </StaticPageLayout>
  );
}