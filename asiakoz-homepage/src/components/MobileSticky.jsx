import { useEffect, useRef, useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import Icon from "./Icon";
import { useLang } from "../i18n/LanguageContext";
import { CLINIC, waBookingUrl } from "../data/contacts";
import { IS_HOME, IS_LASER } from "../lib/branch";
import { useCity } from "../context/CityContext";
import { NETWORK_BRANCHES, branchCityName, phoneHref } from "../data/branches";
import { getPromoPriceLabel, LASER_PROMO } from "../data/laserPromo";
import { trackEvent } from "../lib/analytics";

export default function MobileSticky() {
  const { lang, t } = useLang();
  const { cityId, branch, setCityId } = useCity();
  const [hidden, setHidden] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
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

  const openPicker = (action) => {
    setPendingAction(action);
    setPickerOpen(true);
  };

  const onPickCity = (id) => {
    setCityId(id);
    setPickerOpen(false);
    if (pendingAction === "phone") {
      window.location.href = phoneHref(
        NETWORK_BRANCHES.find((b) => b.id === id)?.phoneTel || branch.phoneTel,
      );
      return;
    }
    if (pendingAction === "whatsapp") {
      window.open(
        waBookingUrl(lang, "", { branchId: id }),
        "_blank",
        "noopener,noreferrer",
      );
    }
  };

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
          onClick={(e) => {
            if (IS_HOME && !cityId) {
              e.preventDefault();
              openPicker("phone");
              return;
            }
            trackEvent(IS_LASER ? "laser_phone_click" : "phone_click", {
              language: lang,
              city: IS_HOME ? cityId : undefined,
              button_location: "sticky",
              page_url: window.location.href,
            });
          }}
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
          onClick={(e) => {
            if (IS_HOME && !cityId) {
              e.preventDefault();
              openPicker("whatsapp");
              return;
            }
            trackEvent(IS_LASER ? "laser_whatsapp_click" : "whatsapp_click", {
              language: lang,
              city: IS_HOME ? cityId : undefined,
              button_location: "sticky",
              page_url: window.location.href,
            });
          }}
          className="inline-flex h-11 min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-3 text-[13px] font-semibold leading-tight text-white"
          tabIndex={hidden ? -1 : 0}
        >
          <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{t.mobile.wa}</span>
        </a>
      </div>
      {pickerOpen && IS_HOME && (
        <div className="fixed inset-0 z-[70] flex items-end bg-ink/35">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close city picker"
            onClick={() => setPickerOpen(false)}
          />
          <div className="relative z-10 w-full rounded-t-[1.25rem] bg-white p-4 shadow-float">
            <p className="mb-2 text-sm font-semibold text-ink">{t.cityPicker?.label}</p>
            <div className="grid gap-2">
              {NETWORK_BRANCHES.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onPickCity(b.id)}
                  className="inline-flex min-h-11 items-center justify-between rounded-xl border border-ink/10 px-3.5 text-sm font-semibold text-ink hover:border-brand/30"
                >
                  <span>{branchCityName(b, lang)}</span>
                  {b.status === "coming_soon" ? (
                    <span className="text-xs text-brand">{t.cityPicker?.soon}</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
