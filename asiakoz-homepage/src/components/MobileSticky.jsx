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
          ? "Здравствуйте! Хочу узнать, подходит ли мне ReLEx SMILE по акции 650 000 ₸ за оба глаза."
          : "Сәлеметсіз бе! ReLEx SMILE маған жасай ала ма — акция 650 000 ₸ екі көзге.",
      )
    : waBookingUrl(lang);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/[0.08] bg-white/95 px-2.5 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl sm:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-2">
        <a
          href={CLINIC.phones[0].href}
          onClick={() =>
            trackEvent("laser_phone_click", { language: lang, button_location: "sticky" })
          }
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white text-ink"
          aria-label={t.mobile.call}
        >
          <Icon name="phone" className="h-4 w-4 text-brand" />
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("laser_whatsapp_click", { language: lang, button_location: "sticky" })
          }
          className="inline-flex h-11 min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-3 text-[13px] font-semibold leading-tight text-white"
        >
          <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{t.mobile.wa}</span>
        </a>
      </div>
    </div>
  );
}
