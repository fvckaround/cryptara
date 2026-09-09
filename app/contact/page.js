import StaticPageLayout from "../components/StaticPageLayout";
import ContactForm from "../components/ContactForm";

export const metadata = {
  title: "Contact — Cryptara Holdings",
};

export default function ContactPage() {
  return (
    <StaticPageLayout
      title="Contact us"
      subtitle="Questions about your account, a deposit, or a holding plan — we usually reply within one business day."
    >
      <section>
        <p className="font-body text-sm leading-relaxed text-mauve">
          You can also reach us directly at{" "}
          <a
            href="mailto:cryptaraholding@outlook.com"
            className="text-amber underline"
          >
            cryptaraholding@outlook.com
          </a>
          .
        </p>
      </section>

      <section>
        <ContactForm />
      </section>
    </StaticPageLayout>
  );
}