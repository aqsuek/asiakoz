import { useEffect, useRef, useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import Icon from "./Icon";
import { useLang } from "../i18n/LanguageContext";
import { CLINIC, waBookingUrl } from "../data/contacts";
import { IS_HOME, IS_LASER } from "../lib/branch";
import { useCity } from "../context/CityContext";
import { phoneHref } from "../data/branches";
import { getPromoPriceLabel, LASER_PROMO } from "../data/laserPromo";
import { trackEvent } from "../lib/analytics";

export default function MobileSticky() {
  const { lang, t } = useLang();
  const { cityId, branch } = useCity();
  const [hidden, setHidden] = useState(false);
  const hiddenRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const contacts = document.getElementById("contacts");
    const booking = document.getElementById("booking");
    const footer = document.querySelector("footer");
    const targets = [contacts, booking, footer].filter(Boolean);
    if (!targets.length) return undefined;

    const apply = (next) => {
      if (hiddenRef.current === next) return;
      hiddenRef.current = next;
      setHidden(next);
    };

    const sync = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const stickyZoneTop = window.innerHeight - 88;
        const shouldHide = targets.some((el) => {
          const r = el.getBoundingClientRect();
          return r.top < stickyZoneTop && r.bottom > 0;
        });
        apply(shouldHide);
      });
    };

    const observer = new IntersectionObserver(() => sync(), {
      root: null,
      threshold: [0, 0.05, 0.15, 0.3, 0.5],
      rootMargin: "0px 0px -88px 0px",
    });

    targets.forEach((el) => observer.observe(el));
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const price = getPromoPriceLabel(lang);
  const waHref = IS_LASER
    ? waBookingUrl(
        lang,
        lang === "ru"
          ? `Здравствуйте! Хочу узнать, подходит ли мне ${LASER_PROMO.method} по акции ${price}.`
          : `Сәлеметсіз бе! ${LASER_PROMO.method} маған жасай ала ма — акция ${price}.`,
      )
    : IS_HOME
      ? waBookingUrl(lang, "", { branchId: cityId })
      : waBookingUrl(lang);

  const callHref = IS_HOME ? phoneHref(branch.phoneTel) : CLINIC.phones[0].href;
  const callAria = t.mobile.callAria || t.mobile.call;

  return (
    <div
      className={`mobile-sticky-bar fixed inset-x-0 bottom-0 z-50 border-t border-ink/[0.08] bg-white/95 px-2.5 pt-1.5 backdrop-blur-xl transition-[opacity,transform] duration-300 ease-out will-change-transform sm:hidden ${
        hidden
          ? "pointer-events-none translate-y-[110%] opacity-0"
          : "translate-y-0 opacity-100"
      }`}
      style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom))" }}
      aria-hidden={hidden}
    >
      <div className="mx-auto flex max-w-lg items-center gap-2">
        <a
          href={callHref}
          onClick={() =>
            trackEvent(IS_LASER ? "laser_phone_click" : "phone_click", {
              language: lang,
              city: IS_HOME ? cityId : undefined,
              button_location: "sticky",
              page_url: window.location.href,
            })
          }
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white text-ink"
          aria-label={callAria}
          tabIndex={hidden ? -1 : 0}
        >
          <Icon name="phone" className="h-4 w-4 text-brand" />
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent(IS_LASER ? "laser_whatsapp_click" : "whatsapp_click", {
              language: lang,
              city: IS_HOME ? cityId : undefined,
              button_location: "sticky",
              page_url: window.location.href,
            })
          }
          className="inline-flex h-11 min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-3 text-[13px] font-semibold leading-tight text-white"
          tabIndex={hidden ? -1 : 0}
        >
          <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{t.mobile.wa}</span>
        </a>
      </div>
    </div>
  );
}
