import WhatsAppIcon from "../WhatsAppIcon";
import { useLang } from "../../i18n/LanguageContext";
import { waBookingUrl } from "../../data/contacts";
import { useCity } from "../../context/CityContext";
import { onWhatsAppClick } from "../../lib/whatsapp";

export default function WhatsAppFunnel() {
  const { lang, t } = useLang();
  const { cityId } = useCity();
  const copy = t.conversion?.funnel;
  if (!copy?.steps?.length) return null;

  const href = waBookingUrl(lang, "", { branchId: cityId });

  return (
    <section id="how-to-book" className="scroll-mt-header bg-surface-muted py-8 sm:py-12">
      <div className="section-container">
        <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
          <h2 className="section-title text-[1.35rem] sm:text-3xl">{copy.title}</h2>
          <p className="mt-2 text-sm text-ink-muted sm:text-base">{copy.subtitle}</p>
        </div>

        <ol className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-3 sm:gap-4">
          {copy.steps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-[1.25rem] border border-ink/[0.06] bg-white p-4 text-center shadow-soft sm:p-5"
            >
              <span className="mx-auto mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-white">
                {i + 1}
              </span>
              <h3 className="text-sm font-bold text-ink sm:text-base">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted sm:text-sm">
                {step.text}
              </p>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-6 max-w-md text-center">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onWhatsAppClick("funnel_cta", { city: cityId })}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-bold text-white shadow-card sm:text-base"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {copy.cta}
          </a>
          {copy.note && (
            <p className="mt-2 text-xs text-ink-faint">{copy.note}</p>
          )}
        </div>
      </div>
    </section>
  );
}
