import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "../i18n/LanguageContext";
import { CLINIC, waBookingUrl } from "../data/contacts";

export default function Contacts() {
  const { lang, t } = useLang();

  return (
    <section id="contacts" className="scroll-mt-24 bg-surface-muted py-10 sm:py-12">
      <div className="section-container">
        <h2 className="section-title mb-6 text-center text-[1.55rem] sm:mb-8 sm:text-3xl">
          {t.contacts.title}
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
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

          <div className="flex flex-col justify-center rounded-[2rem] border border-ink/[0.06] bg-white p-6 shadow-card sm:p-8">
            <ul className="space-y-5">
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <Icon name="map" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    {t.contacts.location}
                  </p>
                  <p className="mt-1 text-[15px] font-medium leading-snug text-ink">
                    {CLINIC.address}
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <Icon name="phone" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    {t.contacts.phone}
                  </p>
                  <div className="mt-1 flex flex-col gap-1">
                    {CLINIC.phones.map((phone) => (
                      <a
                        key={phone.href}
                        href={phone.href}
                        className="text-[15px] font-semibold text-ink transition-colors hover:text-brand"
                      >
                        {phone.display}
                      </a>
                    ))}
                  </div>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
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

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={CLINIC.gis.routeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full"
              >
                <Icon name="map" className="h-4 w-4" />
                {t.contacts.route}
              </a>
              <a
                href={waBookingUrl(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {t.contacts.wa}
              </a>
              <a href={CLINIC.phones[0].href} className="btn-outline w-full">
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
