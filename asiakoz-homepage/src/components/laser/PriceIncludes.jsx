import { useLang } from "../../i18n/LanguageContext";
import { LASER_PROMO, isLaserPromoActive } from "../../data/laserPromo";
import { homeUrl } from "../../lib/routes";
import { trackEvent } from "../../lib/analytics";

export default function PriceIncludes() {
  const { lang, t } = useLang();
  const p = t.laserPrice;
  if (!p) return null;
  const active = isLaserPromoActive();
  const priceLabel =
    LASER_PROMO.PRICE_SCOPE === "both_eyes"
      ? `${LASER_PROMO.currentPrice} ${lang === "ru" ? "за оба глаза" : "екі көзге"}`
      : LASER_PROMO.currentPrice;

  return (
    <section id="price" className="scroll-mt-24 scroll-mb-28 py-7 sm:py-10">
      <div className="section-container">
        <div className="mx-auto max-w-2xl rounded-[1.5rem] border border-brand/20 bg-brand-soft/60 p-4 sm:p-7">
          <h2 className="section-title text-[1.4rem] sm:text-3xl">
            {active
              ? (p.title || "").replace("{price}", priceLabel)
              : p.titleNeutral}
          </h2>
          <ul className="mt-5 space-y-2.5">
            {p.items?.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-ink sm:text-[15px]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-faint">{p.note}</p>
          <a
            href={homeUrl("#booking")}
            onClick={() =>
              trackEvent("laser_hero_cta_click", {
                language: lang,
                button_location: "price_includes",
              })
            }
            className="btn-primary mt-6 min-h-12 w-full sm:w-auto"
          >
            {p.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
