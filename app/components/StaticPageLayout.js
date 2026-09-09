import Nav from "./Nav";
import Footer from "./Footer";

export default function StaticPageLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-aubergine text-warm-white">
      <Nav />
      <main className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <h1 className="font-display text-3xl text-warm-white md:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 font-body text-sm text-mauve">{subtitle}</p>
        )}
        <div className="mt-10 space-y-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}