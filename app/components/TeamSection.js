const TEAM = [
  {
    name: "J. Fairbanks",
    role: "Founder & custody lead",
    bio: "Previously built settlement infrastructure for a regional payments processor before moving into digital asset custody.",
  },
  {
    name: "E. Sinclair",
    role: "Head of portfolio strategy",
    bio: "Manages allocation models across all three holding plans and reviews term structures quarterly.",
  },
  {
    name: "O. Bramwell",
    role: "Investor relations",
    bio: "First point of contact for account holders above the Foundation tier.",
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl text-warm-white md:text-3xl">
          Who runs Cryptara
        </h2>
        <p className="mt-3 max-w-lg font-body text-sm text-mauve">
          A small team, deliberately — fewer people between you and a
          straight answer.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {TEAM.map((person) => (
            <div
              key={person.name}
              className="border-t border-amber pt-4 transition-transform duration-300 hover:-translate-y-1"
            >
              <h3 className="font-display text-lg text-warm-white">
                {person.name}
              </h3>
              <div className="mt-1 font-data text-xs text-amber">
                {person.role}
              </div>
              <p className="mt-3 font-body text-sm leading-relaxed text-mauve">
                {person.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}