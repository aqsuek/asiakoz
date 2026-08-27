/** Almaty: WhatsApp only. Aktau / Shymkent: WhatsApp + phone. */
export function showsPhoneCta(cityId) {
  if (!cityId) return true;
  return cityId !== "almaty";
}
