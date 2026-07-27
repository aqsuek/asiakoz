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

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                className="flex flex-col rounded-[1.35rem] border border-ink/[0.06] bg-white px-5 py-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-card"
              >
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  {item.icon === "whatsapp" ? (
                    <WhatsAppIcon className="h-5 w-5" />
                  ) : (
                    <Icon name={item.icon || "arrow"} className="h-5 w-5" />
                  )}
                </span>
                <span className="text-base font-bold text-ink">{item.title}</span>
                <span className="mt-1 text-sm leading-snug text-ink-muted">{item.text}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                  {item.cta}
                  <Icon name="arrow" className="h-4 w-4" />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
