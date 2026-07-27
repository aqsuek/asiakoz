import { getStoredUtm } from "./utm";

export function trackEvent(eventName, payload = {}) {
  if (typeof window === "undefined") return;
  const utm = getStoredUtm();
  const data = {
    event: eventName,
    page_path: window.location.pathname,
    ...utm,
    ...payload,
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}
