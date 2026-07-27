import { TRUST_STATS } from "../data/content";

export default function TrustStats() {
  return (
    <section className="pb-4 pt-20 sm:pt-24" aria-label="Ключевые показатели">
      <div className="section-container-wide">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="stat-pill text-center sm:text-left">
              <p className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs leading-snug text-ink-muted sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
