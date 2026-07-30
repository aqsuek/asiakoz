import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "../i18n/LanguageContext";
import { CLINIC, clinicAddress, waBookingUrl } from "../data/contacts";
import { IS_HOME, IS_LASER } from "../lib/branch";
import { useCity } from "../context/CityContext";
import {
  branchAddress,
  branchCityName,
  branchHours,
  isComingSoon as branchIsComingSoon,
  phoneHref,
} from "../data/branches";
import { trackEvent } from "../lib/analytics";

function LazyMap({ title, embedUrl, fallbackLabel, openLabel, openUrl, onOpen }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-[1.5rem] border border-ink/[0.06] bg-white shadow-soft"
    >
      {visible && embedUrl && !failed ? (
        <iframe
          title={title}
          src={embedUrl}
          className="h-[240px] w-full border-0 sm:h-[320px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-[240px] flex-col items-center justify-center gap-3 bg-gradient-to-b from-brand-soft to-surface-muted px-5 text-center sm:h-[280px]">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand">AsiaKoz</span>
          <p className="max-w-xs text-sm text-ink-muted">{fallbackLabel}</p>
          {openUrl && (
            <a
              href={openUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onOpen}
              className="btn-outline min-h-11 !px-4 !py-2 text-sm"
            >
              <Icon name="map" className="h-4 w-4" />
              {openLabel}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function Contacts() {
  const { lang, t } = useLang();
  const { cityId, setCityId, branch, branches, isComingSoon } = useCity();

  if (IS_HOME) {
    const address = branchAddress(branch, lang);
    const hours = branchHours(branch, lang);
    const phone = {
      href: phoneHref(branch.phoneTel),
      display: branch.phoneDisplay,
    };

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
              const soon = branchIsComingSoon(b);
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

          <div className="grid gap-4 lg:grid-cols-2">
            <LazyMap
              title={t.contacts.mapTitle}
              embedUrl={branch.gis.embedUrl}
              fallbackLabel={t.contacts.mapFallback}
              openLabel={t.contacts.mapOpen}
              openUrl={branch.gis.searchUrl}
              onOpen={() =>
                trackEvent("map_open", {
                  city: cityId,
                  button_location: "contacts_fallback",
                  page_url: window.location.href,
                })
              }
            />

            <div className="flex flex-col justify-center rounded-[1.5rem] border border-ink/[0.06] bg-white p-5 shadow-soft sm:p-7">
              <ul className="space-y-3.5">
                <li className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <Icon name="map" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                      {t.contacts.status}
                    </p>
                    <p className="mt-1 text-[15px] font-semibold text-ink">
                      {isComingSoon ? t.contacts.statusSoon : t.contacts.statusOpen}
                    </p>
                  </div>
                </li>
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
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const address = clinicAddress(lang);
  const showMap = !IS_LASER;

  return (
    <section id="contacts" className="scroll-mt-header bg-surface-muted py-7 pb-16 sm:py-10 sm:pb-10">
      <div className="section-container">
        <h2 className="section-title mb-5 text-center text-[1.4rem] sm:mb-8 sm:text-3xl">
          {t.contacts.title}
        </h2>

        <div className={`grid gap-5 ${showMap ? "lg:grid-cols-2" : "mx-auto max-w-xl"}`}>
          {showMap && (
            <LazyMap
              title={t.contacts.mapTitle}
              embedUrl={CLINIC.gis.embedUrl}
              fallbackLabel={t.contacts.mapFallback || address}
              openLabel={t.contacts.route}
              openUrl={CLINIC.gis.searchUrl}
            />
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
