import { useEffect, useState } from "react";
import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "../i18n/LanguageContext";
import { waBookingUrl } from "../data/contacts";
import { IS_HOME } from "../lib/branch";
import { useCity } from "../context/CityContext";
import { trackEvent } from "../lib/analytics";

const HOME_PREVIEW = 6;

export default function Services() {
  const { lang, t } = useLang();
  const { cityId } = useCity();
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setActive(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const allItems = t.services.items || [];
  const items = IS_HOME ? allItems.slice(0, HOME_PREVIEW) : allItems;
  const service = active ? allItems.find((item) => item.id === active) : null;

  const openService = (id) => {
    setActive(id);
    trackEvent("service_open", {
      service_id: id,
      city: IS_HOME ? cityId : undefined,
      page_url: window.location.href,
    });
  };

  return (
    <section id="services" className="scroll-mt-header bg-surface-muted py-8 sm:py-12">
      <div className="section-container">
        <div className="mx-auto mb-5 max-w-2xl text-center sm:mb-8">
          <h2 className="section-title text-[1.35rem] sm:text-3xl">{t.services.title}</h2>
          <p className="mt-2 text-sm text-ink-muted sm:text-base">{t.services.subtitle}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className={`flex flex-col border border-ink/[0.06] bg-white shadow-soft transition-all duration-300 hover:border-brand/20 ${
                IS_HOME
                  ? "rounded-[1.5rem] p-5 sm:p-6"
                  : "rounded-3xl p-6 hover:-translate-y-0.5 hover:shadow-card"
              }`}
            >
              <div
                className={`mb-3 flex items-center justify-center rounded-2xl bg-brand text-white ${
                  IS_HOME ? "h-12 w-12" : "mb-4 h-11 w-11"
                }`}
              >
                <Icon name={item.icon} className="h-5 w-5" />
              </div>
              <h3 className="text-[15px] font-bold leading-snug text-ink sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-snug text-ink-muted">{item.short}</p>
              <button
                type="button"
                onClick={() => openService(item.id)}
                className="btn-ghost mt-3 self-start !px-0 text-sm"
              >
                {t.services.more}
                <Icon name="arrow" className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>

        {IS_HOME && allItems.length > HOME_PREVIEW && (
          <div className="mt-5 flex justify-center">
            <a
              href="/uslugi/"
              className="btn-outline min-h-11 !px-5 !py-2.5 text-sm"
            >
              {t.services.showAll}
            </a>
          </div>
        )}
      </div>

      {service && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setActive(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-[1.75rem] border border-ink/[0.06] bg-white p-6 shadow-float sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <Icon name={service.icon} className="h-5 w-5" />
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 text-ink-muted hover:text-ink"
                aria-label={t.services.close}
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
            <h3 id="service-modal-title" className="text-xl font-bold text-ink">
              {service.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{service.detail}</p>
            {service.points?.length > 0 && (
              <ul className="mt-4 space-y-2.5">
                {service.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2.5 rounded-2xl border border-ink/[0.06] bg-surface-muted/70 px-3.5 py-2.5 text-sm leading-relaxed text-ink"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
            <a
              href={waBookingUrl(
                lang,
                lang === "ru" ? `Услуга: ${service.title}` : `Қызмет: ${service.title}`,
                IS_HOME ? { branchId: cityId } : {},
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("whatsapp_click", {
                  city: IS_HOME ? cityId : undefined,
                  service: service.title,
                  button_location: "service_modal",
                  page_url: window.location.href,
                })
              }
              className="btn-primary mt-6 w-full"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {t.services.book}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
