import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "../i18n/LanguageContext";
import { CLINIC, clinicAddress, waBookingUrl } from "../data/contacts";
import { IS_HOME, IS_LASER } from "../lib/branch";
import { showsPhoneCta } from "../lib/contactPolicy";
import { useCity } from "../context/CityContext";
import {
  branchAddress,
  branchCityName,
  branchHours,
  phoneHref,
} from "../data/branches";
import { trackEvent } from "../lib/analytics";

export default function Contacts() {
  const { lang, t } = useLang();
  const { cityId, setCityId, branch, branches } = useCity();

  if (IS_HOME) {
    const address = branchAddress(branch, lang);
    const hours = branchHours(branch, lang);
    const phone = {
      href: phoneHref(branch.phoneTel),
      display: branch.phoneDisplay,
    };
    const showPhone = showsPhoneCta(cityId);

    return (
      <section id="contacts" className="scroll-mt-header bg-surface-muted py-7 pb-8 sm:py-10">
        <div className="section-container">
          <h2 className="section-title mb-4 text-center text-[1.35rem] sm:mb-6 sm:text-3xl">
            {t.contacts.title}
          </h2>

          <div
            className="mb-4 flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide sm:justify-center"
            role="tablist"
            aria-label={t.contacts.title}
          >
            {branches.map((b) => {
              const selected = cityId === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setCityId(b.id)}
                  className={`inline-flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors ${
                    selected
                      ? "border-brand bg-brand text-white"
                      : "border-ink/10 bg-white text-ink-muted hover:border-brand/30"
                  }`}
                >
                  {branchCityName(b, lang)}
                </button>
              );
            })}
          </div>

          <div className="mx-auto max-w-xl">
            <div className="flex flex-col justify-center rounded-[1.5rem] border border-ink/[0.06] bg-white p-5 shadow-soft sm:p-7">
              <ul className="space-y-3.5">
                <li className="flex gap-3">
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
                {showPhone && (
                <li className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <Icon name="phone" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                      {t.contacts.phone}
                    </p>
                    <a
                      href={phone.href}
                      onClick={() =>
                        trackEvent("phone_click", {
                          city: cityId,
                          button_location: "contacts",
                          page_url: window.location.href,
                        })
                      }
                      className="mt-1 block text-[15px] font-semibold text-ink hover:text-brand"
                    >
                      {phone.display}
                    </a>
                  </div>
                </li>
                )}
                {hours && (
                  <li className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                      <Icon name="clipboard" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                        {t.contacts.hours}
                      </p>
                      <p className="mt-1 text-[15px] font-medium text-ink">{hours}</p>
                    </div>
                  </li>
                )}
                <li className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <Icon name="instagram" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                      {t.contacts.instagram}
                    </p>
                    <a
                      href={branch.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-[15px] font-semibold text-brand hover:underline"
                    >
                      {branch.instagram.handle}
                    </a>
                  </div>
                </li>
              </ul>

              <div className="mt-5 flex flex-col gap-2">
                <a
                  href={branch.gis.routeUrl || branch.gis.searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("map_open", {
                      city: cityId,
                      button_location: "contacts_2gis",
                      page_url: window.location.href,
                    })
                  }
                  className="btn-outline min-h-11 w-full !py-3"
                >
                  <Icon name="map" className="h-4 w-4" />
                  {t.contacts.route}
                </a>
                <a
                  href={waBookingUrl(lang, "", { branchId: cityId })}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("whatsapp_click", {
                      city: cityId,
                      button_location: "contacts",
                      page_url: window.location.href,
                    })
                  }
                  className="btn-primary min-h-11 w-full !py-3"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {t.contacts.wa}
                </a>
                {showPhone && (
                  <a
                    href={phone.href}
                    onClick={() =>
                      trackEvent("phone_click", {
                        city: cityId,
                        button_location: "contacts_call",
                        page_url: window.location.href,
                      })
                    }
                    className="btn-outline min-h-11 w-full !py-3"
                  >
                    <Icon name="phone" className="h-4 w-4" />
                    {t.contacts.call}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const address = clinicAddress(lang);
  const showPhone = showsPhoneCta();

  return (
    <section id="contacts" className="scroll-mt-header bg-surface-muted py-7 pb-16 sm:py-10 sm:pb-10">
      <div className="section-container">
        <h2 className="section-title mb-5 text-center text-[1.4rem] sm:mb-8 sm:text-3xl">
          {t.contacts.title}
        </h2>

        <div className="mx-auto max-w-xl">
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
              {showPhone && (
              <li className="flex gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
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
              )}
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
              {!IS_LASER && (
                <a
                  href={CLINIC.gis.routeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline min-h-11 w-full !py-3"
                >
                  <Icon name="map" className="h-4 w-4" />
                  {t.contacts.route}
                </a>
              )}
              <a
                href={waBookingUrl(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary min-h-11 w-full !py-3"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {t.contacts.wa}
              </a>
              {showPhone && (
                <a href={CLINIC.phones[0].href} className="btn-outline min-h-11 w-full !py-3">
                  <Icon name="phone" className="h-4 w-4" />
                  {t.contacts.call}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
