import WhatsAppIcon from "./WhatsAppIcon";
import Icon from "./Icon";
import { useLang } from "../i18n/LanguageContext";
import { CLINIC, waBookingUrl } from "../data/contacts";
import { IS_LASER } from "../lib/branch";
import { trackEvent } from "../lib/analytics";

export default function MobileSticky() {
  const { lang, t } = useLang();

  const waHref = IS_LASER
    ? waBookingUrl(
        lang,
        lang === "ru"
          ? "Здравствуйте! Хочу узнать, подходит ли мне лазерная коррекция по акции 650 000 ₸."
          : "Сәлеметсіз бе! Лазерлік коррекция маған жасай ала ма — акция 650 000 ₸.",
      )
    : waBookingUrl(lang);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/[0.08] bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl sm:hidden">
      <div className="flex items-center gap-2">
        <a
          href={CLINIC.phones[0].href}
          onClick={() =>
            trackEvent("laser_phone_click", { language: lang, button_location: "sticky" })
          }
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white text-ink"
          aria-label={t.mobile.call}
        >
          <Icon name="phone" className="h-5 w-5 text-brand" />
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("laser_whatsapp_click", { language: lang, button_location: "sticky" })
          }
          className="inline-flex h-12 min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white"
        >
          <WhatsAppIcon className="h-4 w-4" />
          {t.mobile.wa}
        </a>
      </div>
    </div>
  );
}
