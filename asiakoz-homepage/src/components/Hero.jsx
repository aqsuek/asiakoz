import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { HERO_FEATURES, WHATSAPP_URL } from "../data/content";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-section-fade pb-8 pt-8 sm:pb-12 sm:pt-12 lg:pb-16 lg:pt-14">
      <div className="pointer-events-none absolute -right-24 top-0 h-[520px] w-[520px] rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-sky-100 blur-3xl" />

      <div className="section-container relative">
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Турецкая офтальмология
            </p>
            <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
              Турецкая глазная клиника{" "}
              <span className="text-brand">в Алматы и Актау</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">
              Сложные операции на глазах, диагностика и лечение у офтальмохирургов с
              международным опытом.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Записаться в WhatsApp
              </a>
              <a href="/uslugi/" className="btn-outline">
                Смотреть услуги
                <Icon name="arrow" className="h-4 w-4" />
              </a>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {HERO_FEATURES.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <Icon name="badge" className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium leading-snug text-ink-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative z-10 overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 to-brand-soft shadow-float">
              <div className="absolute inset-0 bg-hero-glow" />
              <img
                src="/images/clinic-1.png"
                alt="Офтальмохирург AsiaKoz за современным оборудованием"
                className="relative aspect-[4/5] w-full object-cover object-center sm:aspect-[5/6]"
                width="800"
                height="1000"
                loading="eager"
                fetchPriority="high"
              />
            </div>

            <div className="glass-badge absolute -bottom-4 left-4 z-20 flex items-center gap-3 px-4 py-3 sm:-left-6 sm:bottom-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-card">
                <Icon name="award" className="h-6 w-6" strokeWidth={1.25} />
              </div>
              <div>
                <p className="text-lg font-extrabold leading-none text-ink">12 000+</p>
                <p className="text-xs font-medium text-ink-muted">успешных операций</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
