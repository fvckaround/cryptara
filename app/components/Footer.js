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
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <div className="font-data text-xs uppercase tracking-wide text-mauve">
              Legal
            </div>
            <ul className="mt-3 space-y-2 font-body text-sm text-warm-white">
              <li>Terms</li>
              <li>Privacy</li>
              <li>Risk disclosure</li>
            </ul>
          </div>
          <div>
            <div className="font-data text-xs uppercase tracking-wide text-mauve">
              Support
            </div>
            <ul className="mt-3 space-y-2 font-body text-sm text-warm-white">
              <li>Help center</li>
              <li>Security</li>
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