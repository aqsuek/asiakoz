import { useEffect } from "react";
import WhatsAppIcon from "../WhatsAppIcon";
import { useLang } from "../../i18n/LanguageContext";
import { CLINIC } from "../../data/contacts";
import {
  isLaserPromoActive,
  getPromoSpots,
  getPromoPriceLabel,
  getPromoOldPriceLabel,
  getPromoEndMonthName,
} from "../../data/laserPromo";
import { trackEvent } from "../../lib/analytics";
import { captureUtmFromUrl } from "../../lib/utm";
import { assetUrl } from "../../data/reviews";
import { homeUrl } from "../../lib/routes";

export default function LaserHero() {
  const { lang, t } = useLang();
  const h = t.laserHero || {};
  const active = isLaserPromoActive();
  const monthName = getPromoEndMonthName(lang);
  const badge = active && monthName ? (h.badge || "").replace("{month}", monthName) : "";
  const spots = active ? getPromoSpots() : null;
  const priceLabel = getPromoPriceLabel(lang);
  const oldPriceLabel = getPromoOldPriceLabel();

  useEffect(() => {
    captureUtmFromUrl();
    trackEvent("laser_page_view", { language: lang });
  }, [lang]);

  return (
    <section id="promo" className="scroll-mt-24 scroll-mb-28 pb-4 pt-2 sm:pb-8 sm:pt-6">
      <div className="section-container">
        <div className="grid items-start gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
          <div className="max-w-xl">
            {badge && (
              <p className="mb-1.5 inline-flex items-center rounded-full border border-brand/20 bg-brand-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
                {badge}
              </p>
            )}

            <h1 className="font-display text-[1.45rem] font-extrabold leading-[1.18] tracking-tight text-ink sm:text-4xl lg:text-[2.5rem]">
              {h.title}
            </h1>

            {active ? (
              <div className="mt-2.5 flex flex-wrap items-end gap-2.5">
                <p className="font-display text-2xl font-extrabold text-brand sm:text-4xl">
                  {priceLabel}
                </p>
                <p className="pb-0.5 text-base font-semibold text-ink-faint line-through sm:text-lg">
                  {oldPriceLabel}
                </p>
              </div>
            ) : (
              <p className="mt-2.5 text-base font-semibold text-brand-deep sm:text-lg">
                {h.neutralOffer}
              </p>
            )}

            <p className="mt-1.5 text-sm leading-snug text-ink-muted sm:text-base sm:leading-relaxed">
              {h.priceNote}
            </p>

            {h.perks?.length > 0 && (
              <ul className="mt-2 space-y-1">
                {h.perks.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {spots != null && (
              <p className="mt-2 text-sm font-semibold text-ink-muted">
                {(h.spotsLabel || "").includes("{n}") ? (
                  <>
                    {(h.spotsLabel || "").split("{n}")[0]}
                    <span className="text-base font-extrabold text-red-600">{spots}</span>
                    {(h.spotsLabel || "").split("{n}")[1]}
                  </>
                ) : (
                  <>
                    {h.spotsLabel}{" "}
                    <span className="text-base font-extrabold text-red-600">{spots}</span>
                  </>
                )}
              </p>
            )}

            <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:items-center">
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

            {/* Compact doctor strip — mobile only */}
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-ink/[0.06] bg-white p-2.5 shadow-soft sm:hidden">
              <img
                src={assetUrl(h.image || CLINIC.heroImage)}
                alt={h.imageAlt || ""}
                className="h-14 w-14 shrink-0 rounded-xl object-cover object-[center_18%]"
                width={56}
                height={56}
                fetchPriority="high"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-brand">
                  {h.doctorChipLabel}
                </p>
                <p className="truncate text-sm font-bold text-ink">{h.doctorChipName}</p>
                <p className="truncate text-[11px] text-ink-muted">{h.doctorChipStats}</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[260px] sm:block sm:max-w-[320px] lg:mx-0 lg:max-w-none">
            <div className="overflow-hidden rounded-[1.5rem] border border-ink/[0.06] bg-white shadow-float">
              <img
                src={assetUrl(h.image || CLINIC.heroImage)}
                alt={h.imageAlt || ""}
                className="aspect-[4/5] max-h-[360px] w-full object-cover object-[center_18%] sm:aspect-[4/3] sm:max-h-[320px] sm:object-top lg:max-h-none"
                width={720}
                height={900}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-2 left-2 right-2 rounded-xl border border-ink/[0.06] bg-white/95 p-2.5 shadow-card backdrop-blur-sm sm:left-4 sm:right-auto sm:max-w-xs sm:p-3">
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
