import Icon from "./Icon";
import { TRUST_STATS } from "../data/content";

export default function TrustStats() {
  return (
    <section className="relative z-10 -mt-6 pb-4 sm:-mt-10" aria-label="Ключевые показатели">
      <div className="section-container">
        <div className="grid gap-4 rounded-3xl border border-brand/20 bg-gradient-to-r from-white via-brand-soft/60 to-white p-5 shadow-float sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-brand/15 sm:p-0">
          {TRUST_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 px-2 py-2 sm:px-8 sm:py-7"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-card">
                <Icon name={stat.icon} className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-brand sm:text-2xl">{stat.value}</p>
                <p className="text-sm text-ink-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
