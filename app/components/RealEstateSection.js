export default function RealEstateSection() {
  return (
    <section id="real-estate" className="border-t border-hairline">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:gap-14">
        <div>
          <h2 className="font-display text-2xl text-warm-white md:text-3xl">
            Real estate holdings
          </h2>
          <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-mauve">
            We&apos;re extending Cryptara Holdings beyond digital assets —
            fixed-term property-backed holdings, the same custody and
            transparency principles applied to real estate. Details and
            entry terms will be published here as they&apos;re finalized.
          </p>
          <p className="mt-6 font-body text-xs text-mauve">
            Want to be notified when this opens? Open an account and
            we&apos;ll reach out to existing holders first.
          </p>
        </div>
        <div className="overflow-hidden border border-hairline">
          <img
            src="https://images.pexels.com/photos/7587880/pexels-photo-7587880.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200"
            alt="Modern house exterior representing a Cryptara real estate holding"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}