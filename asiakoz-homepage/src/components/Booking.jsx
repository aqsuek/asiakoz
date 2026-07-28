import { useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "../i18n/LanguageContext";
import { waBookingUrl } from "../data/contacts";
import { trackEvent } from "../lib/analytics";
import { formatUtmLine, getStoredUtm, captureUtmFromUrl } from "../lib/utm";
import { IS_LASER } from "../lib/branch";
import { getPromoPriceLabel, LASER_PROMO } from "../data/laserPromo";

function normalizeKzPhone(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("7")) return `+${digits}`;
  if (digits.length === 10 && digits.startsWith("7")) return `+7${digits.slice(1)}`;
  if (digits.length === 10) return `+7${digits}`;
  if (digits.length === 11 && digits.startsWith("8")) return `+7${digits.slice(1)}`;
  return value.trim();
}

function isValidKzPhone(value) {
  return /^\+7\d{10}$/.test(normalizeKzPhone(value));
}

export default function Booking({ laserMode = false }) {
  const { lang, t } = useLang();
  const isLaser = laserMode || IS_LASER;
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    time: "",
    diopters: "",
    website: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (status === "idle") {
      trackEvent("laser_form_start", { language: lang, button_location: "booking" });
      setStatus("editing");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    captureUtmFromUrl();

    if (form.website) {
      return;
    }

    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = t.booking.required;
    if (!form.phone.trim()) nextErrors.phone = t.booking.required;
    else if (isLaser && !isValidKzPhone(form.phone)) {
      nextErrors.phone = t.booking.phoneInvalid || t.booking.required;
    }

    if (!isLaser && (!form.service || !form.time.trim())) {
      setError(t.booking.required);
      return;
    }

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      setError("");
      trackEvent("laser_form_error", {
        language: lang,
        reason: nextErrors.phone && form.phone.trim() ? "phone" : "required",
      });
      return;
    }

    setStatus("sending");
    trackEvent("laser_form_submit", { language: lang });

    const phone = isLaser ? normalizeKzPhone(form.phone) : form.phone.trim();
    const utmLine = formatUtmLine(getStoredUtm());

    let lines;
    if (isLaser) {
      const price = getPromoPriceLabel(lang);
      lines =
        lang === "ru"
          ? [
              `Здравствуйте! Хочу узнать, подходит ли мне ${LASER_PROMO.method} по акции ${price}.`,
              `Имя: ${form.name.trim()}`,
              `Телефон: ${phone}`,
              form.diopters.trim() ? `Диоптрии: ${form.diopters.trim()}` : null,
              form.time.trim() ? `Удобное время: ${form.time.trim()}` : null,
              utmLine ? `Источник: ${utmLine}` : null,
            ]
          : [
              `Сәлеметсіз бе! ${LASER_PROMO.method} маған жасай ала ма — акция ${price}.`,
              `Аты-жөні: ${form.name.trim()}`,
              `Телефон: ${phone}`,
              form.diopters.trim() ? `Диоптрия: ${form.diopters.trim()}` : null,
              form.time.trim() ? `Ыңғайлы уақыт: ${form.time.trim()}` : null,
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
      window.open(waBookingUrl(lang, lines.join("\n")), "_blank", "noopener,noreferrer");
      setStatus("success");
      trackEvent("laser_form_success", { language: lang });
    } catch {
      setStatus("error");
      setError(t.booking.error || t.booking.required);
      trackEvent("laser_form_error", { language: lang, reason: "open" });
    }
  };

  return (
    <section id="booking" className="scroll-mt-24 scroll-mb-28 py-7 pb-20 sm:py-12 sm:pb-12">
      <div className="section-container">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-[1.5rem] border border-ink/[0.06] bg-white p-4 shadow-card sm:p-8">
          <div className="text-center">
            <h2 className="section-title text-[1.4rem] sm:text-3xl">{t.booking.title}</h2>
            <p className="mt-2 text-sm text-ink-muted sm:text-base">{t.booking.subtitle}</p>
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

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">{t.booking.name}</span>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="field min-h-12"
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
                className="field min-h-12"
                placeholder="+7"
                autoComplete="tel"
                required
                aria-invalid={Boolean(fieldErrors.phone)}
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors.phone}</p>
              )}
            </label>

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
                    className="field min-h-12"
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
                    className="field min-h-12"
                    placeholder={t.booking.timePlaceholder}
                  />
                </label>
              </>
            ) : (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">{t.booking.service}</span>
                  <select
                    name="service"
                    value={form.service}
                    onChange={onChange}
                    className="field min-h-12"
                    required
                  >
                    <option value="">{t.booking.servicePlaceholder}</option>
                    {t.services.items.map((item) => (
                      <option key={item.id} value={item.title}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">{t.booking.time}</span>
                  <input
                    name="time"
                    value={form.time}
                    onChange={onChange}
                    className="field min-h-12"
                    placeholder={t.booking.timePlaceholder}
                    required
                  />
                </label>
              </>
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
              className="btn-primary min-h-12 w-full !py-3.5"
              disabled={status === "sending"}
            >
              <WhatsAppIcon className="h-4 w-4" />
              {status === "sending" ? t.booking.sending : t.booking.submit}
            </button>

            {isLaser && t.booking.privacy && (
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
