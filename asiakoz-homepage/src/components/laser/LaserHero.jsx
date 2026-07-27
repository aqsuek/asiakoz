import { useEffect } from "react";
import WhatsAppIcon from "../WhatsAppIcon";
import { useLang } from "../../i18n/LanguageContext";
import { CLINIC, waBookingUrl } from "../../data/contacts";
import { LASER_PROMO, isLaserPromoActive, getPromoSpots } from "../../data/laserPromo";
import { trackEvent } from "../../lib/analytics";
import { captureUtmFromUrl } from "../../lib/utm";
import { assetUrl } from "../../data/reviews";
import { homeUrl } from "../../lib/routes";

const MONTHS_KZ = [
  "қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым",
  "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан",
];
const MONTHS_RU = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

export default function LaserHero() {
  const { lang, t } = useLang();
  const h = t.laserHero || {};
  const active = isLaserPromoActive();
  const monthName = lang === "ru" ? MONTHS_RU[new Date().getMonth()] : MONTHS_KZ[new Date().getMonth()];
  const badge = (h.badge || "").replace("{month}", monthName);
  const spots = getPromoSpots();

  useEffect(() => {
    captureUtmFromUrl();
    trackEvent("laser_page_view", { language: lang });
  }, [lang]);

  const waHref = waBookingUrl(
    lang,
    lang === "ru"
      ? "Хочу узнать, подходит ли мне лазерная коррекция по акции 650 000 ₸."
      : "Лазерлік коррекция маған жасай ала ма — акция 650 000 ₸ бойынша білгім келеді.",
  );

  return (
    <section id="promo" className="scroll-mt-24 pb-8 pt-4 sm:pb-12 sm:pt-8">
      <div className="section-container">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="max-w-xl">
            {active && badge && (
              <p className="mb-3 inline-flex items-center rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand">
                {badge}
              </p>
            )}

            <h1 className="font-display text-[1.7rem] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[2.5rem]">
              {h.title}
            </h1>

            {active ? (
              <div className="mt-5 flex flex-wrap items-end gap-3">
                <p className="font-display text-3xl font-extrabold text-brand sm:text-4xl">
                  {LASER_PROMO.currentPrice}
                </p>
                <p className="pb-1 text-lg font-semibold text-ink-faint line-through">
                  {LASER_PROMO.oldPrice}
                </p>
                <span className="mb-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-600">
                  {h.discountBadge}
                </span>
              </div>
            ) : (
              <p className="mt-5 text-lg font-semibold text-brand-deep">{h.neutralOffer}</p>
            )}

            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted sm:text-base">
              {h.priceNote}
            </p>

            {h.perks?.length > 0 && (
              <ul className="mt-4 space-y-2">
                {h.perks.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {active && (
              <p className="mt-4 text-sm font-semibold text-ink-muted">
                {h.spotsLabel}{" "}
                <span className="text-base font-extrabold text-red-600">{spots}</span>
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={homeUrl("#booking")}
                onClick={() =>
                  trackEvent("laser_hero_cta_click", {
                    language: lang,
                    button_location: "hero_primary",
                  })
                }
                className="btn-primary min-h-12 w-full sm:w-auto"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {h.ctaPrimary}
              </a>
              <a
                href={CLINIC.phones[0].href}
                onClick={() =>
                  trackEvent("laser_phone_click", {
                    language: lang,
                    button_location: "hero_secondary",
                  })
                }
                className="btn-outline min-h-12 w-full sm:w-auto"
              >
                {h.ctaSecondary}
              </a>
            </div>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("laser_whatsapp_click", {
                  language: lang,
                  button_location: "hero_wa_link",
                })
              }
              className="btn-ghost mt-3 min-h-11 !px-0"
            >
              {h.ctaWhatsapp}
            </a>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[1.75rem] border border-ink/[0.06] bg-white shadow-float">
              <img
                src={assetUrl(h.image || CLINIC.heroImage)}
                alt={h.imageAlt || ""}
                className="aspect-[4/5] w-full object-cover object-top sm:aspect-[4/3]"
                width={720}
                height={900}
                fetchPriority="high"
              />
            </div>
            <div className="absolute -bottom-3 left-3 right-3 rounded-2xl border border-ink/[0.06] bg-white/95 p-3.5 shadow-card backdrop-blur-sm sm:left-5 sm:right-auto sm:max-w-xs">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">
                {h.doctorChipLabel}
              </p>
              <p className="mt-0.5 text-sm font-bold text-ink">{h.doctorChipName}</p>
              <p className="text-xs text-ink-muted">{h.doctorChipStats}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
