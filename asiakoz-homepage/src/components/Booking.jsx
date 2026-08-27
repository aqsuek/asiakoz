import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "../i18n/LanguageContext";
import { CLINIC, waBookingUrl } from "../data/contacts";
import { trackEvent } from "../lib/analytics";
import { IS_HOME, IS_LASER } from "../lib/branch";
import { showsPhoneCta } from "../lib/contactPolicy";
import { useCity } from "../context/CityContext";
import {
  branchCityName,
  isComingSoon as branchIsComingSoon,
  phoneHref,
} from "../data/branches";

export default function Booking({ laserMode = false }) {
  const { lang, t } = useLang();
  const { cityId, setCityId, branch, branches } = useCity();
  const isLaser = laserMode || IS_LASER;

  const bookHref = IS_HOME
    ? waBookingUrl(lang, "", { branchId: cityId })
    : waBookingUrl(lang);

  const phone = IS_HOME
    ? { href: phoneHref(branch.phoneTel), display: branch.phoneDisplay }
    : CLINIC.phones[0];
  const showPhone = showsPhoneCta(cityId);

  const onBook = () => {
    trackEvent(isLaser ? "laser_booking_click" : "booking_click", {
      language: lang,
      city: IS_HOME ? cityId : undefined,
      button_location: "booking",
      page_url: window.location.href,
    });
  };

  return (
    <section id="booking" className="scroll-mt-header py-7 pb-8 sm:py-12">
      <div className="section-container">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-[1.5rem] border border-ink/[0.06] bg-white p-4 shadow-soft sm:p-8">
          <div className="text-center">
            <h2 className="section-title text-[1.35rem] sm:text-3xl">{t.booking.title}</h2>
            <p className="mt-2 text-sm text-ink-muted sm:text-base">{t.booking.subtitle}</p>
          </div>

          {IS_HOME && (
            <div
              className="mt-5 flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide sm:justify-center"
              role="group"
              aria-label={t.booking.city}
            >
              {branches.map((b) => {
                const selected = cityId === b.id;
                const soon = branchIsComingSoon(b);
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setCityId(b.id)}
                    className={`inline-flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors ${
                      selected
                        ? "border-brand bg-brand text-white"
                        : "border-ink/10 bg-white text-ink-muted hover:border-brand/30"
                    }`}
                  >
                    {branchCityName(b, lang)}
                    {soon && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          selected ? "bg-white/20 text-white" : "bg-brand/10 text-brand"
                        }`}
                      >
                        {t.cityPicker?.soon || "Скоро"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-2">
            <a
              href={bookHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onBook}
              className="btn-primary min-h-14 w-full !py-3.5 sm:min-h-12"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {t.booking.submit}
            </a>
            {showPhone && (
              <a href={phone.href} className="btn-outline min-h-12 w-full !py-3">
                {t.contacts.call}: {phone.display}
              </a>
            )}
          </div>

          {t.booking.privacyLink && (
            <p className="mt-3 text-center text-xs leading-relaxed text-ink-faint">
              {(t.booking.privacyBefore || "") && <span>{t.booking.privacyBefore} </span>}
              <a
                href="/politika-konfidentsialnosti/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand underline-offset-2 hover:underline"
              >
                {t.booking.privacyLink}
              </a>
              {t.booking.privacyAfter ? (
                <span>
                  {/^[.,!?;:]/.test(t.booking.privacyAfter) ? "" : " "}
                  {t.booking.privacyAfter}
                </span>
              ) : null}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
