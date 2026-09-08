"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/deposits", label: "Deposits" },
  { href: "/admin/withdrawals", label: "Withdrawals" },
  { href: "/admin/wallets", label: "Wallets" },
  { href: "/admin/plans", label: "Plans" },
  { href: "/admin/users", label: "Users" },
];

export default function AdminNav({ userName }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-hairline bg-aubergine/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg text-warm-white">
          Cryptara Holdings{" "}
          <span className="font-data text-xs text-amber">Admin</span>
        </Link>

        <nav className="hidden items-center gap-6 font-body text-sm md:flex">
          {LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive
                    ? "text-amber"
                    : "text-mauve hover:text-warm-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          {userName && (
            <span className="font-body text-sm text-mauve">{userName}</span>
          )}
          <LogoutButton />
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
          <nav className="flex flex-col gap-4 font-body text-sm">
            {LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={isActive ? "text-amber" : "text-mauve"}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 flex items-center justify-between border-t border-hairline pt-6">
            {userName && (
              <span className="font-body text-sm text-mauve">
                {userName}
              </span>
            )}
            <LogoutButton />
          </div>
        </div>
      )}
    </header>
  );
}