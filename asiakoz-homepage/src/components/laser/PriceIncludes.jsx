import { useLang } from "../../i18n/LanguageContext";
import { LASER_PROMO, isLaserPromoActive } from "../../data/laserPromo";
import { homeUrl } from "../../lib/routes";
import { trackEvent } from "../../lib/analytics";

export default function PriceIncludes() {
  const { lang, t } = useLang();
  const p = t.laserPrice;
  if (!p) return null;
  const active = isLaserPromoActive();

  return (
    <section id="price" className="scroll-mt-24 py-10 sm:py-12">
      <div className="section-container">
        <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-brand/20 bg-brand-soft/60 p-5 sm:p-8">
          <h2 className="section-title text-[1.55rem] sm:text-3xl">
            {active
              ? (p.title || "").replace("{price}", LASER_PROMO.currentPrice)
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
