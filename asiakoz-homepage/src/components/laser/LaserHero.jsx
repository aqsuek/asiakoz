import { useEffect } from "react";
import WhatsAppIcon from "../WhatsAppIcon";
import { useLang } from "../../i18n/LanguageContext";
import { CLINIC } from "../../data/contacts";
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

  const priceLabel =
    LASER_PROMO.PRICE_SCOPE === "both_eyes"
      ? `${LASER_PROMO.currentPrice} ${lang === "ru" ? "за оба глаза" : "екі көзге"}`
      : LASER_PROMO.currentPrice;

  return (
    <section id="promo" className="scroll-mt-24 scroll-mb-28 pb-5 pt-3 sm:pb-10 sm:pt-6">
      <div className="section-container">
        <div className="grid items-center gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="max-w-xl">
            {active && badge && (
              <p className="mb-2 inline-flex items-center rounded-full border border-brand/20 bg-brand-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
                {badge}
              </p>
            )}

            <h1 className="font-display text-[1.45rem] font-extrabold leading-[1.18] tracking-tight text-ink sm:text-4xl lg:text-[2.5rem]">
              {h.title}
            </h1>

            {active ? (
              <div className="mt-3 flex flex-wrap items-end gap-2.5">
                <p className="font-display text-2xl font-extrabold text-brand sm:text-4xl">
                  {priceLabel}
                </p>
                <p className="pb-0.5 text-base font-semibold text-ink-faint line-through sm:text-lg">
                  {LASER_PROMO.oldPrice}
                </p>
                <span className="mb-0.5 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-bold text-red-600">
                  {h.discountBadge}
                </span>
              </div>
            ) : (
              <p className="mt-3 text-base font-semibold text-brand-deep sm:text-lg">{h.neutralOffer}</p>
            )}

            <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
              {h.priceNote}
            </p>

            {h.perks?.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {h.perks.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {active && (
              <p className="mt-3 text-sm font-semibold text-ink-muted">
                {h.spotsLabel}{" "}
                <span className="text-base font-extrabold text-red-600">{spots}</span>
              </p>
            )}

            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <a
                href={homeUrl("#booking")}
                onClick={() =>
                  trackEvent("laser_hero_cta_click", {
                    language: lang,
                    button_location: "hero_primary",
                  })
                }
                className="btn-primary min-h-11 w-full !py-3 sm:w-auto"
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
                className="btn-outline min-h-11 w-full !py-3 sm:w-auto"
              >
                {h.ctaSecondary}
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[280px] sm:max-w-none lg:mx-0">
            <div className="overflow-hidden rounded-[1.5rem] border border-ink/[0.06] bg-white shadow-float">
              <img
                src={assetUrl(h.image || CLINIC.heroImage)}
                alt={h.imageAlt || ""}
                className="aspect-[4/5] max-h-[380px] w-full object-cover object-[center_18%] sm:max-h-none sm:aspect-[4/3] sm:object-top"
                width={720}
                height={900}
                fetchPriority="high"
              />
            </div>
            <div className="absolute -bottom-2 left-2 right-2 rounded-xl border border-ink/[0.06] bg-white/95 p-2.5 shadow-card backdrop-blur-sm sm:left-4 sm:right-auto sm:max-w-xs sm:p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-brand">
                {h.doctorChipLabel}
              </p>
              <p className="mt-0.5 text-sm font-bold text-ink">{h.doctorChipName}</p>
              <p className="text-[11px] text-ink-muted">{h.doctorChipStats}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
