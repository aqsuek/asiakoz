import { CITY_STORAGE_KEY, NETWORK_BRANCHES } from "../data/branches";

export const CITY_COOKIE = "asiakoz-city";

export function parseCityId(value) {
  if (!value) return null;
  return NETWORK_BRANCHES.some((b) => b.id === value) ? value : null;
}

export function readStoredCityId() {
  if (typeof window === "undefined") return null;
  try {
    const fromLs = parseCityId(localStorage.getItem(CITY_STORAGE_KEY));
    if (fromLs) return fromLs;
  } catch {
    /* ignore */
  }
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${CITY_COOKIE}=([^;]*)`));
    return parseCityId(match ? decodeURIComponent(match[1]) : null);
  } catch {
    return null;
  }
}

export function writeStoredCityId(cityId) {
  if (!parseCityId(cityId)) return;
  try {
    localStorage.setItem(CITY_STORAGE_KEY, cityId);
  } catch {
    /* ignore */
  }
  try {
    document.cookie = `${CITY_COOKIE}=${encodeURIComponent(cityId)};path=/;max-age=31536000;SameSite=Lax`;
  } catch {
    /* ignore */
  }
}
