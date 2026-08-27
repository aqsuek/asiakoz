import WhatsAppIcon from "../WhatsAppIcon";
import { useLang } from "../../i18n/LanguageContext";
import { waBookingUrl } from "../../data/contacts";
import { useCity } from "../../context/CityContext";
import { isAdTraffic } from "../../lib/utm";
import { onWhatsAppClick } from "../../lib/whatsapp";

export default function AdStickyBar() {
  const { lang, t } = useLang();
  const { cityId } = useCity();
  const copy = t.conversion?.sticky;
  if (!copy || !isAdTraffic()) return null;

  const href = waBookingUrl(lang, "", { branchId: cityId });

  return (
    <div className="sticky top-14 z-40 border-b border-brand/15 bg-brand-soft/95 backdrop-blur-md sm:top-[68px]">
      <div className="section-container flex items-center justify-between gap-2 py-2">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-bold text-ink sm:text-sm">
            <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
            {copy.title}
          </p>
          <p className="truncate text-[11px] text-ink-muted sm:text-xs">{copy.subtitle}</p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onWhatsAppClick("ad_sticky_bar", { city: cityId })}
          className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 text-xs font-bold text-white shadow-soft sm:px-4 sm:text-sm"
        >
          <WhatsAppIcon className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">{copy.cta}</span>
          <span className="xs:hidden">WA</span>
        </a>
      </div>
    </div>
  );
}
