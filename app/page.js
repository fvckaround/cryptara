import Link from "next/link";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import HoldingsTicker from "./components/HoldingsTicker";
import PlansSection from "./components/PlansSection";
import SecuritySection from "./components/SecuritySection";
import FeatureHighlights from "./components/FeatureHighlights";
import Testimonials from "./components/Testimonials";
import TeamSection from "./components/TeamSection";
import NewsSection from "./components/NewsSection";
import FAQSection from "./components/FAQSection";
import RealEstateSection from "./components/RealEstateSection";
import Reveal from "./components/Reveal";

const STEPS = [
  {
    mark: "First",
    title: "Open an account",
    body: "Register with your details and verify your identity. Most accounts are approved within one business day.",
  },
  {
    mark: "Second",
    title: "Fund and select a plan",
    body: "Deposit via wire or supported stablecoins, then choose the holding term that matches your horizon.",
  },
  {
    mark: "Third",
    title: "Track and withdraw",
    body: "Watch your position from the dashboard and request a withdrawal at term end, or roll it forward.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-aubergine text-warm-white">
      <Nav />

      {/* Hero — no reveal, visible immediately on load */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-aubergine/85" />
        <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-28">
          <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-start md:gap-14">
            <div>
              <p className="font-data text-xs text-amber">
                Est. 2019 — Digital asset holding company
              </p>
              <h1 className="mt-4 font-display text-3xl leading-[1.15] text-warm-white sm:text-4xl md:mt-5 md:text-5xl md:leading-[1.1]">
                A ledger for your digital holdings, kept plainly
              </h1>
              <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-mauve md:mt-6 md:text-base">
                Cryptara Holdings manages diversified crypto portfolios on
                behalf of long-term holders. No jargon, no leverage games —
                just custody, allocation, and a clear statement of what you
                hold.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4 md:mt-8">
                <Link
                  href="/register"
                  className="gradient-magma px-6 py-3 font-body text-sm text-warm-white transition-opacity hover:opacity-90"
                >
                  Open an account
                </Link>
                <a
                  href="#offerings"
                  className="font-body text-sm text-warm-white underline decoration-mauve underline-offset-4 hover:decoration-amber"
                >
                  View holding plans
                </a>
              </div>
            </div>
            <div className="w-full">
              <HoldingsTicker />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <Reveal>
        <section id="trust" className="border-y border-hairline">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4">
            <div>
              <div className="text-gradient-magma font-display text-2xl">
                $184M
              </div>
              <div className="mt-1 font-body text-xs text-mauve">
                Assets under management
              </div>
            </div>
            <div>
              <div className="text-gradient-magma font-display text-2xl">
                11,400+
              </div>
              <div className="mt-1 font-body text-xs text-mauve">
                Holding accounts
              </div>
            </div>
            <div>
              <div className="text-gradient-magma font-display text-2xl">
                6 yrs
              </div>
              <div className="mt-1 font-body text-xs text-mauve">
                Operating history
              </div>
            </div>
            <div>
              <div className="text-gradient-magma font-display text-2xl">
                24/7
              </div>
              <div className="mt-1 font-body text-xs text-mauve">
                Custody monitoring
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <PlansSection />
      </Reveal>

      <Reveal>
        <SecuritySection />
      </Reveal>

      <Reveal>
        <FeatureHighlights />
      </Reveal>

      <Reveal>
        <RealEstateSection />
      </Reveal>

      {/* Process */}
      <Reveal>
        <section id="process" className="border-t border-hairline">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="font-display text-2xl text-warm-white md:text-3xl">
              Opening an account
            </h2>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {STEPS.map((step) => (
                <div
                  key={step.mark}
                  className="border-t border-magenta pt-4 transition-transform duration-300 hover:translate-x-1"
                >
                  <span className="font-data text-xs uppercase tracking-wide text-amber">
                    {step.mark}
                  </span>
                  <h3 className="mt-2 font-display text-lg text-warm-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-mauve">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <Testimonials />
      </Reveal>

      <Reveal>
        <TeamSection />
      </Reveal>

      <Reveal>
        <NewsSection />
      </Reveal>

      <Reveal>
        <FAQSection />
      </Reveal>

      <Footer />
    </div>
  );
}