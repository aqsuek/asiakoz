const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const STORAGE_KEY = "asiakoz_laser_utm";

export function captureUtmFromUrl(search = window.location.search) {
  try {
    const params = new URLSearchParams(search);
    const utm = {};
    let found = false;
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) {
        utm[key] = value;
        found = true;
      }
    }
    if (found) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    }
    return getStoredUtm();
  } catch {
    return {};
  }
}

export function getStoredUtm() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function formatUtmLine(utm = getStoredUtm()) {
  const parts = UTM_KEYS.map((k) => (utm[k] ? `${k}=${utm[k]}` : null)).filter(Boolean);
  return parts.length ? parts.join(" / ") : "";
}
