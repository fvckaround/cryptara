"use client";

import { useState } from "react";

const FAQS = [
  {
    question: "How are my assets actually held?",
    answer:
      "Funds are custodied in segregated or pooled cold storage depending on your plan, with multi-signature controls on any withdrawal. See the Security & custody section above for specifics.",
  },
  {
    question: "Can I withdraw before my term ends?",
    answer:
      "Early withdrawal is possible on most plans but reduces the target return for that term. Exact terms are shown before you fund an account.",
  },
  {
    question: "What happens when my term ends?",
    answer:
      "You can withdraw the full balance, or roll it into a new term at the current plan rates. Nothing renews automatically without your confirmation.",
  },
  {
    question: "Is there a minimum to get started?",
    answer:
      "The Foundation plan starts at $500. There's no obligation to move to a higher tier — plans differ by term length and custody arrangement, not by pressure to upgrade.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl text-warm-white md:text-3xl">
          Common questions
        </h2>

        <div className="mt-10 border-t border-hairline">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="border-b border-hairline">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between py-5 text-left"
                >
                  <span className="font-body text-sm text-warm-white">
                    {faq.question}
                  </span>
                  <span className="font-data text-lg text-amber">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-5 font-body text-sm leading-relaxed text-mauve">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}