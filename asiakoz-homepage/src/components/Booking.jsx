import { useEffect, useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "../i18n/LanguageContext";
import { waBookingUrl } from "../data/contacts";
import { trackEvent } from "../lib/analytics";
import { formatUtmLine, getStoredUtm, captureUtmFromUrl } from "../lib/utm";
import { IS_HOME, IS_LASER } from "../lib/branch";
import { useCity } from "../context/CityContext";
import { branchCityName, formatKzPhoneDisplay } from "../data/branches";
import { getPromoPriceLabel, LASER_PROMO } from "../data/laserPromo";

function digitsOnly(value) {
  return value.replace(/\D/g, "");
}

function normalizeKzPhone(value) {
  const digits = digitsOnly(value);
  if (digits.length === 11 && digits.startsWith("7")) return `+${digits}`;
  if (digits.length === 10 && digits.startsWith("7")) return `+7${digits.slice(1)}`;
  if (digits.length === 10) return `+7${digits}`;
  if (digits.length === 11 && digits.startsWith("8")) return `+7${digits.slice(1)}`;
  return value.trim();
}

function isValidKzPhone(value) {
  return /^\+7\d{10}$/.test(normalizeKzPhone(value));
}

/** Live mask → +7 XXX XXX XX XX */
function maskKzPhoneInput(raw) {
  let d = digitsOnly(raw);
  if (d.startsWith("8")) d = `7${d.slice(1)}`;
  if (!d.startsWith("7")) d = `7${d}`;
  d = d.slice(0, 11);
  const rest = d.slice(1);
  let out = "+7";
  if (rest.length > 0) out += ` ${rest.slice(0, 3)}`;
  if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) out += ` ${rest.slice(6, 8)}`;
  if (rest.length > 8) out += ` ${rest.slice(8, 10)}`;
  return out;
}

export default function Booking({ laserMode = false }) {
  const { lang, t } = useLang();
  const { cityId, setCityId, branch, branches, isComingSoon } = useCity();
  const isLaser = laserMode || IS_LASER;
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    time: "",
    diopters: "",
    website: "",
    city: IS_HOME ? cityId : "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!IS_HOME) return;
    setForm((prev) => (prev.city === cityId ? prev : { ...prev, city: cityId }));
  }, [cityId]);

  const fieldClass = IS_HOME ? "field min-h-14 sm:min-h-12" : "field min-h-12";

  const onChange = (e) => {
    const { name, value } = e.target;
    let next = value;
    if (name === "phone" && (isLaser || IS_HOME)) {
      next = maskKzPhoneInput(value);
    }
    if (name === "city" && IS_HOME) {
      setCityId(value);
    }
    setForm((prev) => ({ ...prev, [name]: next }));
    setError("");
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (status === "idle") {
      trackEvent(IS_HOME ? "form_start" : "laser_form_start", {
        language: lang,
        city: IS_HOME ? cityId : undefined,
        button_location: "booking",
        page_url: window.location.href,
      });
      setStatus("editing");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (status === "sending") return;
    captureUtmFromUrl();

    if (form.website) return;

    const nextErrors = {};
    const selectedCity = IS_HOME ? form.city || cityId : "";
    if (IS_HOME && !selectedCity) nextErrors.city = t.booking.required;
    if (!form.name.trim()) nextErrors.name = t.booking.required;
    if (!form.phone.trim()) nextErrors.phone = t.booking.required;
    else if ((isLaser || IS_HOME) && !isValidKzPhone(form.phone)) {
      nextErrors.phone = t.booking.phoneInvalid || t.booking.required;
    }

    if (!isLaser) {
      if (!form.service) nextErrors.service = t.booking.required;
      if (!form.time.trim()) nextErrors.time = t.booking.required;
    }

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      setError(t.booking.required);
      trackEvent(IS_HOME ? "form_error" : "laser_form_error", {
        language: lang,
        city: IS_HOME ? selectedCity : undefined,
        reason: nextErrors.phone && form.phone.trim() ? "phone" : "required",
        page_url: window.location.href,
      });
      return;
    }

    setStatus("sending");
    trackEvent(IS_HOME ? "form_submit" : "laser_form_submit", {
      language: lang,
      city: IS_HOME ? selectedCity : undefined,
      service: form.service || undefined,
      page_url: window.location.href,
    });

    const phone = isLaser || IS_HOME ? normalizeKzPhone(form.phone) : form.phone.trim();
    const phonePretty = formatKzPhoneDisplay(phone);
    const utmLine = formatUtmLine(getStoredUtm());
    const pageUrl = typeof window !== "undefined" ? window.location.href : "";

    let lines;
    if (isLaser) {
      const price = getPromoPriceLabel(lang);
      lines =
        lang === "ru"
          ? [
              `Здравствуйте! Хочу узнать, подходит ли мне ${LASER_PROMO.method} по акции ${price}.`,
              `Имя: ${form.name.trim()}`,
              `Телефон: ${phonePretty}`,
              form.diopters.trim() ? `Диоптрии: ${form.diopters.trim()}` : null,
              form.time.trim() ? `Удобное время: ${form.time.trim()}` : null,
              utmLine ? `Источник: ${utmLine}` : null,
            ]
          : [
              `Сәлеметсіз бе! ${LASER_PROMO.method} маған жасай ала ма — акция ${price}.`,
              `Аты-жөні: ${form.name.trim()}`,
              `Телефон: ${phonePretty}`,
              form.diopters.trim() ? `Диоптрия: ${form.diopters.trim()}` : null,
              form.time.trim() ? `Ыңғайлы уақыт: ${form.time.trim()}` : null,
              utmLine ? `Дереккөз: ${utmLine}` : null,
            ];
      lines = lines.filter(Boolean);
    } else if (IS_HOME) {
      const cityName = branchCityName(
        branches.find((b) => b.id === selectedCity) || branch,
        lang,
      );
      lines =
        lang === "ru"
          ? [
              `Город: ${cityName}`,
              `Услуга: ${form.service}`,
              `Имя: ${form.name.trim()}`,
              `Телефон: ${phonePretty}`,
              `Удобное время: ${form.time.trim()}`,
              pageUrl ? `Страница: ${pageUrl}` : null,
              utmLine ? `Источник: ${utmLine}` : null,
            ]
          : [
              `Қала: ${cityName}`,
              `Қызмет: ${form.service}`,
              `Аты-жөні: ${form.name.trim()}`,
              `Телефон: ${phonePretty}`,
              `Ыңғайлы уақыт: ${form.time.trim()}`,
              pageUrl ? `Бет: ${pageUrl}` : null,
              utmLine ? `Дереккөз: ${utmLine}` : null,
            ];
      lines = lines.filter(Boolean);
    } else {
      lines =
        lang === "ru"
          ? [
              `Имя: ${form.name.trim()}`,
              `Телефон: ${form.phone.trim()}`,
              `Услуга: ${form.service}`,
              `Удобное время: ${form.time.trim()}`,
            ]
          : [
              `Аты-жөні: ${form.name.trim()}`,
              `Телефон: ${form.phone.trim()}`,
              `Қызмет: ${form.service}`,
              `Ыңғайлы уақыт: ${form.time.trim()}`,
            ];
    }

    try {
      window.open(
        waBookingUrl(lang, lines.join("\n"), IS_HOME ? { branchId: selectedCity } : {}),
        "_blank",
        "noopener,noreferrer",
      );
      setStatus("success");
      trackEvent(IS_HOME ? "form_success" : "laser_form_success", {
        language: lang,
        city: IS_HOME ? selectedCity : undefined,
        service: form.service || undefined,
        page_url: window.location.href,
      });
    } catch {
      setStatus("error");
      setError(t.booking.error || t.booking.required);
      trackEvent(IS_HOME ? "form_error" : "laser_form_error", {
        language: lang,
        reason: "open",
        page_url: window.location.href,
      });
    }
  };

  return (
    <section id="booking" className="scroll-mt-header py-7 pb-8 sm:py-12">
      <div className="section-container">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-[1.5rem] border border-ink/[0.06] bg-white p-4 shadow-soft sm:p-8">
          <div className="text-center">
            <h2 className="section-title text-[1.35rem] sm:text-3xl">{t.booking.title}</h2>
            <p className="mt-2 text-sm text-ink-muted sm:text-base">{t.booking.subtitle}</p>
            {IS_HOME && isComingSoon && t.booking.shymkentHint && (
              <p className="mt-2 text-sm font-medium text-brand">{t.booking.shymkentHint}</p>
            )}
          </div>

          <form onSubmit={onSubmit} className="mt-5 space-y-3.5" noValidate>
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={onChange}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {IS_HOME && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">{t.booking.city}</span>
                <select
                  name="city"
                  value={form.city}
                  onChange={onChange}
                  className={fieldClass}
                  required
                  aria-invalid={Boolean(fieldErrors.city)}
                >
                  <option value="">{t.booking.cityPlaceholder}</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {branchCityName(b, lang)}
                      {b.status === "coming_soon"
                        ? ` — ${t.cityPicker?.soon || "Скоро"}`
                        : ""}
                    </option>
                  ))}
                </select>
                {fieldErrors.city && (
                  <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.city}</p>
                )}
              </label>
            )}

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">{t.booking.name}</span>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className={fieldClass}
                autoComplete="name"
                required
                aria-invalid={Boolean(fieldErrors.name)}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.name}</p>
              )}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">{t.booking.phone}</span>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={onChange}
                className={fieldClass}
                placeholder="+7"
                autoComplete="tel"
                inputMode="tel"
                required
                aria-invalid={Boolean(fieldErrors.phone)}
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.phone}</p>
              )}
            </label>

            {!isLaser && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">{t.booking.service}</span>
                <select
                  name="service"
                  value={form.service}
                  onChange={onChange}
                  className={fieldClass}
                  required
                  aria-invalid={Boolean(fieldErrors.service)}
                >
                  <option value="">{t.booking.servicePlaceholder}</option>
                  {t.services.items.map((item) => (
                    <option key={item.id} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
                {fieldErrors.service && (
                  <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.service}</p>
                )}
              </label>
            )}

            {isLaser ? (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">
                    {t.booking.diopters}{" "}
                    <span className="font-normal text-ink-faint">({t.booking.dioptersOptional})</span>
                  </span>
                  <input
                    name="diopters"
                    value={form.diopters}
                    onChange={onChange}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">
                    {t.booking.time}{" "}
                    <span className="font-normal text-ink-faint">({t.booking.timeOptional})</span>
                  </span>
                  <input
                    name="time"
                    value={form.time}
                    onChange={onChange}
                    className={fieldClass}
                    placeholder={t.booking.timePlaceholder}
                  />
                </label>
              </>
            ) : (
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">{t.booking.time}</span>
                <input
                  name="time"
                  value={form.time}
                  onChange={onChange}
                  className={fieldClass}
                  placeholder={t.booking.timePlaceholder}
                  required
                  aria-invalid={Boolean(fieldErrors.time)}
                />
                {fieldErrors.time && (
                  <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.time}</p>
                )}
              </label>
            )}

            {error && (
              <p className="text-sm font-medium text-red-600" role="alert">
                {error}
              </p>
            )}
            {status === "success" && !error && (
              <p className="text-sm font-medium text-brand">{t.booking.success}</p>
            )}

            <button
              type="submit"
              className="btn-primary min-h-14 w-full !py-3.5 sm:min-h-12"
              disabled={status === "sending"}
            >
              <WhatsAppIcon className="h-4 w-4" />
              {status === "sending" ? t.booking.sending : t.booking.submit}
            </button>

            {(isLaser || IS_HOME) && t.booking.privacyLink && (
              <p className="text-center text-xs leading-relaxed text-ink-faint">
                {(t.booking.privacyBefore || "") && <span>{t.booking.privacyBefore} </span>}
                <a
                  href="/politika-konfidentsialnosti/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand underline-offset-2 hover:underline"
                >
                  {t.booking.privacyLink || t.booking.privacy}
                </a>
                {t.booking.privacyAfter ? (
                  <span>
                    {/^[.,!?;:]/.test(t.booking.privacyAfter) ? "" : " "}
                    {t.booking.privacyAfter}
                  </span>
                ) : null}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
