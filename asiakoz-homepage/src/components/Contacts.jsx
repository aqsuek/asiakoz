import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "../i18n/LanguageContext";
import { CLINIC, clinicAddress, waBookingUrl } from "../data/contacts";
import { IS_LASER } from "../lib/branch";
import { trackEvent } from "../lib/analytics";

export default function Contacts() {
  const { lang, t } = useLang();
  const address = clinicAddress(lang);
  const showMap = !IS_LASER;

  return (
    <section id="contacts" className="scroll-mt-24 scroll-mb-28 bg-surface-muted py-7 pb-16 sm:py-10 sm:pb-10">
      <div className="section-container">
        <h2 className="section-title mb-5 text-center text-[1.4rem] sm:mb-8 sm:text-3xl">
          {t.contacts.title}
        </h2>

        <div className={`grid gap-5 ${showMap ? "lg:grid-cols-2" : "mx-auto max-w-xl"}`}>
          {showMap && (
            <div className="overflow-hidden rounded-[2rem] border border-ink/[0.06] bg-white shadow-card">
              <iframe
                title={t.contacts.mapTitle}
                src={CLINIC.gis.embedUrl}
                className="h-[320px] w-full border-0 sm:h-[400px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          )}

          <div className="flex flex-col justify-center rounded-[1.75rem] border border-ink/[0.06] bg-white p-5 pb-6 shadow-card sm:p-8">
            <ul className="space-y-4">
              <li className="flex gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <Icon name="map" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    {t.contacts.location}
                  </p>
                  <p className="mt-1 text-[15px] font-medium leading-snug text-ink">{address}</p>
                </div>
              </li>

              <li className="flex gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <Icon name="phone" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    {t.contacts.phone}
                  </p>
                  <div className="mt-1 flex flex-col gap-1">
                    {CLINIC.phones.map((phone) => {
                      const label =
                        lang === "ru"
                          ? phone.labelRu || phone.label
                          : phone.labelKz || phone.label;
                      return (
                      <a
                        key={phone.href}
                        href={phone.href}
                        onClick={() =>
                          IS_LASER &&
                          trackEvent("laser_phone_click", {
                            language: lang,
                            button_location: "contacts",
                          })
                        }
                        className="text-[15px] font-semibold text-ink transition-colors hover:text-brand"
                      >
                        {label ? (
                          <span className="block">
                            <span className="text-xs font-medium text-ink-faint">{label}</span>
                            <span className="block">{phone.display}</span>
                          </span>
                        ) : (
                          phone.display
                        )}
                      </a>
                      );
                    })}
                  </div>
                </div>
              </li>

              <li className="flex gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <Icon name="instagram" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    {t.contacts.instagram}
                  </p>
                  <a
                    href={CLINIC.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-[15px] font-semibold text-brand hover:underline"
                  >
                    {CLINIC.instagram.handle}
                  </a>
                </div>
              </li>
            </ul>

            <div className="mt-6 flex flex-col gap-2.5">
              <a
                href={CLINIC.gis.routeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline min-h-11 w-full !py-3"
              >
                <Icon name="map" className="h-4 w-4" />
                {t.contacts.route}
              </a>
              <a
                href={waBookingUrl(lang)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  IS_LASER &&
                  trackEvent("laser_whatsapp_click", {
                    language: lang,
                    button_location: "contacts",
                  })
                }
                className="btn-primary min-h-11 w-full !py-3"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {t.contacts.wa}
              </a>
              <a href={CLINIC.phones[0].href} className="btn-outline min-h-11 w-full !py-3">
                <Icon name="phone" className="h-4 w-4" />
                {t.contacts.call}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
