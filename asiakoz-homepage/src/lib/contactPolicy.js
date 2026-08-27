import { IS_ALMATY, IS_HOME, IS_LASER } from "./branch";

/** Almaty (and laser landing): WhatsApp only. Aktau / Shymkent: WhatsApp + phone. */
export function showsPhoneCta(cityId) {
  if (IS_ALMATY || IS_LASER) return false;
  if (IS_HOME) return cityId !== "almaty";
  return true;
}
