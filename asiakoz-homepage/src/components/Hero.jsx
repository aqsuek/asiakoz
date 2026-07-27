import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "../i18n/LanguageContext";
import { CLINIC, waBookingUrl } from "../data/contacts";

export default function Hero() {
  const { lang, t } = useLang();

  return (
    <section className="relative overflow-hidden pb-10 pt-8 sm:pb-16 sm:pt-12">
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-brand/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-[280px] w-[280px] rounded-full bg-brand-deep/[0.05] blur-3xl"
        aria-hidden
      />

      <div className="section-container">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="max-w-xl">
            <p className="section-eyebrow mb-5">{CLINIC.city}</p>
            <h1 className="font-display text-[1.85rem] font-extrabold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
              {t.hero.title}
            </h1>
            <p className="mt-5 text-base font-medium leading-relaxed text-brand-deep sm:text-lg">
              {t.hero.subtitle}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted sm:text-base">
              {t.hero.text}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={waBookingUrl(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {t.hero.wa}
              </a>
              <a href={CLINIC.phones[0].href} className="btn-outline">
                {t.hero.call}
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-ink/[0.06] bg-white shadow-float">
              <img
                src={`${import.meta.env.BASE_URL}${CLINIC.heroImage}`}
                alt={t.hero.imageAlt}
                className="aspect-[4/3] w-full object-cover"
                width={800}
                height={600}
                fetchPriority="high"
              />
            </div>
            <div className="absolute -bottom-4 left-4 right-4 rounded-2xl border border-ink/[0.06] bg-white/95 p-4 shadow-card backdrop-blur-sm sm:left-6 sm:right-auto sm:max-w-xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                {lang === "ru" ? "Офтальмологический центр" : "Офтальмологиялық орталық"}
              </p>
              <p className="mt-1 text-sm font-bold text-ink">{CLINIC.address}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
