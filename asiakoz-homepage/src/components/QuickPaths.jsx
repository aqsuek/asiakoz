import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "../i18n/LanguageContext";
import { waBookingUrl } from "../data/contacts";
import { homeUrl } from "../lib/routes";

export default function QuickPaths() {
  const { lang, t } = useLang();
  if (!t.quickPaths?.items?.length) return null;

  return (
    <section id="paths" className="scroll-mt-24 pb-4 pt-2 sm:pb-6">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            {t.quickPaths.title}
          </h2>
          {t.quickPaths.subtitle && (
            <p className="mt-2 text-sm text-ink-muted sm:text-base">{t.quickPaths.subtitle}</p>
          )}
        </div>

        <div className="mt-4 grid gap-2 sm:mt-6 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          {t.quickPaths.items.map((item) => {
            const href =
              item.href === "wa"
                ? waBookingUrl(lang)
                : item.href?.startsWith("#")
                  ? homeUrl(item.href)
                  : item.href;
            const external = item.href === "wa" || href?.startsWith("http");

            return (
              <a
                key={item.id}
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="flex flex-row items-center gap-3 rounded-2xl border border-ink/[0.06] bg-white px-3.5 py-3 text-left shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-card sm:flex-col sm:items-stretch sm:rounded-[1.35rem] sm:px-5 sm:py-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand sm:mb-3 sm:h-10 sm:w-10 sm:rounded-2xl">
                  {item.icon === "whatsapp" ? (
                    <WhatsAppIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Icon name={item.icon || "arrow"} className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold leading-snug text-ink sm:text-base">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-ink-muted sm:mt-1 sm:text-sm">
                    {item.text}
                  </span>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand sm:mt-3 sm:text-sm">
                    {item.cta}
                    <Icon name="arrow" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
