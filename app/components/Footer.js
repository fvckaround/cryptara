import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="font-display text-lg text-warm-white">
              Cryptara Holdings
            </span>
            <p className="mt-3 max-w-xs font-body text-xs leading-relaxed text-mauve">
              Digital asset holding and custody. Not a bank. Digital assets
              carry risk of loss.
            </p>
          </div>
          <div>
            <div className="font-data text-xs uppercase tracking-wide text-mauve">
              Company
            </div>
            <ul className="mt-3 space-y-2 font-body text-sm text-warm-white">
              <li>
                <Link href="/about" className="hover:text-amber">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-amber">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-data text-xs uppercase tracking-wide text-mauve">
              Legal
            </div>
            <ul className="mt-3 space-y-2 font-body text-sm text-warm-white">
              <li>
                <Link href="/terms" className="hover:text-amber">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/risk-disclosure" className="hover:text-amber">
                  Risk disclosure
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-data text-xs uppercase tracking-wide text-mauve">
              Support
            </div>
            <ul className="mt-3 space-y-2 font-body text-sm text-warm-white">
              <li>
                <Link href="/help" className="hover:text-amber">
                  Help center
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-amber">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-hairline pt-6 font-body text-xs text-mauve">
          © {new Date().getFullYear()} Cryptara Holdings. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}