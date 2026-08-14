import { getStoredUtm } from "./utm";

const EVENT_ALIASES = {
  whatsapp_click: "organic_whatsapp_click",
  phone_click: "organic_phone_click",
  form_submit: "appointment_submit",
  form_success: "appointment_submit",
};

const SESSION_KEY = "asiakoz_session_id";

function sessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

function sendToAdmin(payload) {
  const repo = import.meta.env.VITE_GITHUB_REPO || "aqsuek/asiakoz";
  const token = import.meta.env.VITE_GITHUB_DISPATCH_TOKEN;
  if (token) {
    fetch(`https://api.github.com/repos/${repo}/dispatches`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: "analytics_event",
        client_payload: {
          ...payload,
          session_id: sessionId(),
          referrer: typeof document !== "undefined" ? document.referrer : undefined,
        },
      }),
      keepalive: true,
    }).catch(() => {});
    return;
  }

  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
  if (!endpoint) return;
  const secret = import.meta.env.VITE_ANALYTICS_SECRET;
  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { "X-Track-Secret": secret } : {}),
    },
    body: JSON.stringify({
      ...payload,
      session_id: sessionId(),
      referrer: typeof document !== "undefined" ? document.referrer : undefined,
    }),
    keepalive: true,
  }).catch(() => {});
}

/**
 * Push analytics events without PII (no name/phone/diagnosis).
 * Accepts legacy event names and also emits required organic_* aliases.
 */
export function trackEvent(eventName, payload = {}) {
  if (typeof window === "undefined") return;

  const safe = { ...payload };
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

  sendToAdmin(base);
}

export function trackPageView(extra = {}) {
  trackEvent("page_view", extra);
}
