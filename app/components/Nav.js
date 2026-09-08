"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "#offerings", label: "Offerings" },
  { href: "#security", label: "Security" },
  { href: "#faq", label: "FAQ" },
  { href: "#trust", label: "About" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-hairline bg-aubergine/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="font-display text-lg tracking-tight">
          Cryptara Holdings
        </span>

        <nav className="hidden items-center gap-8 font-body text-sm text-mauve md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-amber"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="font-body text-sm text-warm-white transition-colors hover:text-amber"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="gradient-magma px-4 py-2 font-body text-sm text-warm-white transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`h-px w-5 bg-warm-white transition-transform ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-5 bg-warm-white transition-transform ${
              open ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-hairline px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-4 font-body text-sm text-mauve">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="hover:text-amber"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="border border-hairline py-2 text-center font-body text-sm text-warm-white"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="gradient-magma py-2 text-center font-body text-sm text-warm-white"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}