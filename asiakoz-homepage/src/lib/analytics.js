import { getStoredUtm } from "./utm";

const EVENT_ALIASES = {
  whatsapp_click: "organic_whatsapp_click",
  phone_click: "organic_phone_click",
  form_submit: "appointment_submit",
  form_success: "appointment_submit",
};

/**
 * Push analytics events without PII (no name/phone/diagnosis).
 * Accepts legacy event names and also emits required organic_* aliases.
 */
export function trackEvent(eventName, payload = {}) {
  if (typeof window === "undefined") return;

  const safe = { ...payload };
  // Strip accidental PII keys if callers pass them
  delete safe.name;
  delete safe.phone;
  delete safe.phone_number;
  delete safe.diagnosis;
  delete safe.message;
  delete safe.email;

  const utm = getStoredUtm();
  const base = {
    event: eventName,
    page_path: window.location.pathname,
    language:
      safe.language ||
      (typeof document !== "undefined" ? document.documentElement.lang : undefined),
    ...utm,
    ...safe,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(base);

  const alias = EVENT_ALIASES[eventName];
  if (alias && alias !== eventName) {
    window.dataLayer.push({ ...base, event: alias });
  }
}
