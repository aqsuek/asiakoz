import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "../i18n/LanguageContext";
import { CLINIC, clinicAddress, waBookingUrl } from "../data/contacts";
import { IS_HOME } from "../lib/branch";
import { useCity } from "../context/CityContext";
import {
  branchAddress,
  branchCityName,
  phoneHref,
} from "../data/branches";
import { trackEvent } from "../lib/analytics";

export default function Hero() {
  const { lang, t } = useLang();
  const { cityId, branch, isComingSoon } = useCity();

  const phoneHrefValue = IS_HOME ? phoneHref(branch.phoneTel) : CLINIC.phones[0].href;
  const waHref = IS_HOME
    ? waBookingUrl(lang, "", { branchId: cityId })
    : waBookingUrl(lang);
  const cityLabel = IS_HOME
    ? branchCityName(branch, lang)
    : lang === "ru" && CLINIC.cityRu
      ? CLINIC.cityRu
      : CLINIC.city;
  const address = IS_HOME ? branchAddress(branch, lang) : clinicAddress(lang);
  const typeLabel = IS_HOME
    ? isComingSoon
      ? t.cityPicker?.soonBadge || (lang === "ru" ? "Скоро открытие" : "Жақында ашылу")
      : lang === "ru"
        ? CLINIC.typeRu
        : CLINIC.typeKz
    : lang === "ru"
      ? CLINIC.typeRu
      : CLINIC.typeKz;

  return (
    <section className="relative overflow-hidden pb-8 pt-5 sm:pb-14 sm:pt-10">
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-brand/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-[280px] w-[280px] rounded-full bg-brand-deep/[0.05] blur-3xl"
        aria-hidden
      />

      <div className="section-container">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="max-w-xl">
            <p className="section-eyebrow mb-3 sm:mb-5">
              {IS_HOME
                ? lang === "ru"
                  ? "АЛМАТЫ · АКТАУ — РАБОТАЮТ"
                  : "АЛМАТЫ · АҚТАУ — ЖҰМЫС ІСТЕЙДІ"
                : CLINIC.city}
            </p>
            <h1 className="font-display text-[clamp(1.65rem,5.6vw,2.2rem)] font-extrabold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
              {t.hero.title}
            </h1>
            <p className="mt-3 text-[15px] font-medium leading-relaxed text-brand-deep sm:mt-5 sm:text-lg">
              {t.hero.subtitle}
            </p>
            <p className="mt-2.5 text-[14px] leading-relaxed text-ink-muted sm:mt-3 sm:text-base">
              {t.hero.text}
            </p>
            {IS_HOME && t.hero.badge && (
              <p className="mt-3 inline-flex rounded-full border border-brand/25 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                {t.hero.badge}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("whatsapp_click", {
                    city: IS_HOME ? cityId : undefined,
                    button_location: "hero",
                    page_url: window.location.href,
                  })
                }
                className="btn-primary"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {t.hero.wa}
              </a>
              <a
                href={phoneHrefValue}
                onClick={() =>
                  trackEvent("phone_click", {
                    city: IS_HOME ? cityId : undefined,
                    button_location: "hero",
                    page_url: window.location.href,
                  })
                }
                className="btn-outline"
              >
                {t.hero.call}
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[1.75rem] border border-ink/[0.06] bg-white shadow-soft sm:rounded-[2rem] sm:shadow-float">
              <img
                src={`${import.meta.env.BASE_URL}${CLINIC.heroImage}`}
                alt={t.hero.imageAlt}
                className="aspect-[4/3] w-full object-cover object-center"
                width={800}
                height={600}
                fetchPriority="high"
              />
            </div>
            <div className="absolute -bottom-3 left-3 right-3 rounded-[1.25rem] border border-ink/[0.06] bg-white/95 p-3.5 shadow-soft backdrop-blur-sm sm:-bottom-4 sm:left-6 sm:right-auto sm:max-w-xs sm:p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-brand sm:text-xs">
                {typeLabel}
              </p>
              <p className="mt-1 text-sm font-bold text-ink">{cityLabel}</p>
              <p className="mt-0.5 text-sm text-ink-muted">{address}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
