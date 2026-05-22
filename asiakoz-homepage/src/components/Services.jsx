import Icon from "./Icon";
import SectionHeading from "./SectionHeading";
import { SERVICES } from "../data/content";

export default function Services() {
  return (
    <section id="services" className="section-tint relative z-0 py-16 sm:py-20 lg:py-24">
      <div className="section-container">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            label="Услуги"
            title="Наши услуги"
            subtitle="Полный спектр офтальмологической помощи — от диагностики до сложных операций."
            className="max-w-xl"
          />
          <a
            href="/uslugi/"
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brand/25 bg-white px-4 py-2 text-sm font-semibold text-brand shadow-soft transition-all hover:border-brand hover:bg-brand-soft"
          >
            Смотреть все услуги
            <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {SERVICES.map((service, i) => (
            <a
              key={service.title}
              href={service.href}
              className={
                i % 2 === 0
                  ? "card-premium group flex flex-col p-6"
                  : "card-premium-tint group flex flex-col p-6"
              }
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-card transition-colors group-hover:bg-brand-dark">
                <Icon name={service.icon} className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-ink group-hover:text-brand">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                {service.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
