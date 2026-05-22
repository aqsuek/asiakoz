import Icon from "./Icon";
import { TRUST_STATS } from "../data/content";

export default function TrustStats() {
  return (
    <section
      className="relative z-30 -mt-10 mb-10 sm:-mt-14 sm:mb-14"
      aria-label="Ключевые показатели"
    >
      <div className="section-container">
        <div className="grid grid-cols-1 gap-4 rounded-3xl border border-brand/20 bg-white p-4 shadow-float sm:grid-cols-2 sm:gap-0 sm:divide-y sm:divide-brand/10 sm:p-0 lg:grid-cols-4 lg:divide-x lg:divide-y-0 lg:divide-brand/15">
          {TRUST_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex min-w-0 items-center gap-3 px-3 py-4 sm:gap-4 sm:px-5 sm:py-6 lg:px-4 lg:py-7 xl:px-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-card sm:h-12 sm:w-12">
                <Icon name={stat.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-extrabold leading-none text-brand sm:text-xl lg:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs leading-snug text-ink-muted sm:text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
