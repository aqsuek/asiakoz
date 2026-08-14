import { getStoredUtm } from "./utm";

const EVENT_ALIASES = {
  whatsapp_click: "organic_whatsapp_click",
  phone_click: "organic_phone_click",
  form_submit: "appointment_submit",
  form_success: "appointment_submit",
};

const SESSION_KEY = "asiakoz_session_id";
const TOKEN_KEY = "asiakoz_github_token";
const GITHUB_REPO = "aqsuek/asiakoz";

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

async function githubToken() {
  try {
    const cached = sessionStorage.getItem(TOKEN_KEY);
    if (cached) return cached;
  } catch {
    /* ignore */
  }
  try {
    const res = await fetch("/admin/config.json", { cache: "no-store" });
    if (!res.ok) return "";
    const data = await res.json();
    let token = String(data.githubToken || "").trim();
    if (!token && Array.isArray(data.p)) {
      token = data.p.map((part) => String(part).split("").reverse().join("")).join("");
    }
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    return token;
  } catch {
    return "";
  }
}

function sendToAdmin(payload) {
  const body = {
    ...payload,
    session_id: sessionId(),
    referrer: typeof document !== "undefined" ? document.referrer : undefined,
  };

  githubToken().then((token) => {
    if (!token) return;
    fetch(`https://api.github.com/repos/${GITHUB_REPO}/dispatches`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: "analytics_event",
        client_payload: body,
      }),
      keepalive: true,
    }).catch(() => {});
  });

  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
  if (!endpoint) return;
  const secret = import.meta.env.VITE_ANALYTICS_SECRET;
  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { "X-Track-Secret": secret } : {}),
    },
    body: JSON.stringify(body),
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
