import Icon from "./Icon";
import { SERVICES } from "../data/content";

export default function Services() {
  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24">
      <div className="section-container">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">Наши услуги</h2>
            <p className="mt-2 max-w-xl text-ink-muted">
              Полный спектр офтальмологической помощи — от диагностики до сложных операций.
            </p>
          </div>
          <a
            href="/uslugi/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            Смотреть все услуги
            <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {SERVICES.map((service) => (
            <a
              key={service.title}
              href={service.href}
              className="card-premium group flex flex-col p-6"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <Icon name={service.icon} className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-ink">{service.title}</h3>
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
