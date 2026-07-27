/**
 * Single source of truth for laser landing promo.
 * Change values here only — UI reads formatters below.
 */
export const LASER_PROMO = {
  currentPrice: 650000,
  oldPrice: 700000,
  endDate: "2026-07-31",
  spotsLeft: 14,
  method: "ReLEx SMILE",
  /** 'oneEye' | 'bothEyes' | 'unconfirmed' */
  priceScope: "bothEyes",
  currency: "₸",
};

/** @deprecated use LASER_PROMO.priceScope */
export const PRICE_SCOPE_LEGACY =
  LASER_PROMO.priceScope === "bothEyes"
    ? "both_eyes"
    : LASER_PROMO.priceScope === "oneEye"
      ? "one_eye"
      : "unconfirmed";

export function formatPromoPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return `${n.toLocaleString("ru-RU").replace(/\u00A0/g, "\u00A0")} ${LASER_PROMO.currency}`;
}

export function getPromoPriceLabel(lang = "ru") {
  const price = formatPromoPrice(LASER_PROMO.currentPrice);
  if (LASER_PROMO.priceScope === "bothEyes") {
    return lang === "ru" ? `${price} за оба глаза` : `${price} — екі көзге`;
  }
  if (LASER_PROMO.priceScope === "oneEye") {
    return lang === "ru" ? `${price} за один глаз` : `${price} — бір көзге`;
  }
  return price;
}

export function getPromoOldPriceLabel() {
  return formatPromoPrice(LASER_PROMO.oldPrice);
}

export function isLaserPromoActive(now = new Date()) {
  const end = new Date(`${LASER_PROMO.endDate}T23:59:59`);
  return !Number.isNaN(end.getTime()) && now <= end;
}

export function getPromoSpots() {
  const n = Number(LASER_PROMO.spotsLeft);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function getPromoEndMonthName(lang = "ru") {
  const d = new Date(`${LASER_PROMO.endDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  const monthsRu = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  // Genitive forms for badge: «АКЦИЯ ШІЛДЕНІҢ СОҢЫНА ДЕЙІН»
  const monthsKz = [
    "қаңтардың", "ақпанның", "наурыздың", "сәуірдің", "мамырдың", "маусымның",
    "шілденің", "тамыздың", "қыркүйектің", "қазанның", "қарашаның", "желтоқсанның",
  ];
  return lang === "ru" ? monthsRu[d.getMonth()] : monthsKz[d.getMonth()];
}

/** Back-compat aliases used by existing components */
export const getFormattedCurrentPrice = () => formatPromoPrice(LASER_PROMO.currentPrice);
export const getFormattedOldPrice = () => formatPromoPrice(LASER_PROMO.oldPrice);
