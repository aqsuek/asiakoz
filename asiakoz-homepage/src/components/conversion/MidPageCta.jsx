import WhatsAppIcon from "../WhatsAppIcon";
import { useLang } from "../../i18n/LanguageContext";
import { waBookingUrl } from "../../data/contacts";
import { useCity } from "../../context/CityContext";
import { onWhatsAppClick } from "../../lib/whatsapp";

export default function MidPageCta({ topic = "" }) {
  const { lang, t } = useLang();
  const { cityId } = useCity();
  const copy = t.conversion?.mid;
  if (!copy) return null;

  const extra = topic
    ? lang === "ru"
      ? `Интересует: ${topic}`
      : `Қызығушылық: ${topic}`
    : "";
  const href = waBookingUrl(lang, extra, { branchId: cityId });

  return (
    <section className="py-6 sm:py-8" aria-label={copy.title}>
      <div className="section-container">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-brand/20 bg-gradient-to-br from-brand-soft via-white to-white p-5 shadow-soft sm:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/10 blur-2xl"
            aria-hidden
          />
          <div className="relative grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand">{copy.eyebrow}</p>
              <h2 className="mt-1 font-display text-xl font-extrabold text-ink sm:text-2xl">
                {copy.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
                {copy.subtitle}
              </p>
              <ul className="mt-3 space-y-1.5">
                {(copy.points || []).map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onWhatsAppClick("mid_page_cta", { city: cityId, topic })}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-bold text-white shadow-card transition-transform hover:scale-[1.02] lg:w-auto lg:min-w-[220px]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {copy.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
