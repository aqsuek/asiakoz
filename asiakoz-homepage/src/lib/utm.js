const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const AD_KEYS = [...UTM_KEYS, "gclid", "gbraid", "wbraid"];
const STORAGE_KEY = "asiakoz_ad_attribution";
const LEGACY_KEY = "asiakoz_laser_utm";

function readStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(LEGACY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStorage(data) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function captureUtmFromUrl(search = window.location.search) {
  if (typeof window === "undefined") return {};
  try {
    const params = new URLSearchParams(search);
    const stored = readStorage();
    const next = { ...stored };
    let found = false;
    for (const key of AD_KEYS) {
      const value = params.get(key);
      if (value) {
        next[key] = value;
        found = true;
      }
    }
    if (!next.landing_page) {
      next.landing_page = window.location.pathname;
    }
    if (found || !stored.landing_page) {
      writeStorage(next);
    }
    return getStoredAttribution();
  } catch {
    return {};
  }
}

export function getStoredUtm() {
  const attr = getStoredAttribution();
  const utm = {};
  for (const key of UTM_KEYS) {
    if (attr[key]) utm[key] = attr[key];
  }
  return utm;
}

export function getStoredAttribution() {
  return readStorage();
}

export function formatUtmLine(utm = getStoredUtm()) {
  const parts = UTM_KEYS.map((k) => (utm[k] ? `${k}=${utm[k]}` : null)).filter(Boolean);
  return parts.length ? parts.join(" / ") : "";
}

export function formatAttributionLine(attr = getStoredAttribution(), lang = "ru") {
  const parts = [];
  if (attr.utm_source) parts.push(`source=${attr.utm_source}`);
  if (attr.utm_medium) parts.push(`medium=${attr.utm_medium}`);
  if (attr.utm_campaign) parts.push(`campaign=${attr.utm_campaign}`);
  if (attr.gclid) parts.push(`gclid=${attr.gclid.slice(0, 12)}…`);
  if (!parts.length) return "";
  const label = lang === "kz" ? "Жарнама" : "Реклама";
  return `${label}: ${parts.join(" · ")}`;
}

export function appendAttributionToMessage(text, lang = "ru") {
  const attr = getStoredAttribution();
  const lines = [text];
  const attrLine = formatAttributionLine(attr, lang);
  if (attrLine) lines.push("", attrLine);
  if (attr.landing_page) {
    lines.push(
      lang === "kz" ? `Бет: ${attr.landing_page}` : `Страница: ${attr.landing_page}`,
    );
  }
  return lines.join("\n");
}

export function isAdTraffic() {
  const attr = getStoredAttribution();
  if (attr.gclid || attr.gbraid || attr.wbraid) return true;
  if (!attr.utm_source) return false;
  const source = String(attr.utm_source).toLowerCase();
  const medium = String(attr.utm_medium || "").toLowerCase();
  return (
    source.includes("google") ||
    source.includes("gads") ||
    medium === "cpc" ||
    medium === "ppc" ||
    medium === "paid"
  );
}
