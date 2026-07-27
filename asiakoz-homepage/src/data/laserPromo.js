/**
 * Single source of truth for laser landing promo.
 * Confirm with clinic owner before changing:
 * - PRICE_SCOPE: 'one_eye' | 'both_eyes' | 'unconfirmed'
 * - What is included in the price beyond diagnostics/consult/procedure
 * - Exact methods offered and recovery timelines
 */
export const LASER_PROMO = {
  currentPrice: "650 000 ₸",
  oldPrice: "700 000 ₸",
  diagnosticsPrice: "0 ₸",
  /** Confirmed by clinic: promo price is for both eyes (ReLEx SMILE). */
  PRICE_SCOPE: "both_eyes",
  /** Confirmed promo method */
  PROMO_METHOD: "ReLEx SMILE",
  spotsLeft: 14,
  /** ISO date (local calendar day). After this date promo badge/urgency is hidden. */
  endDate: "2026-07-31",
};

export function isLaserPromoActive(now = new Date()) {
  const end = new Date(`${LASER_PROMO.endDate}T23:59:59`);
  return !Number.isNaN(end.getTime()) && now <= end;
}

export function getPromoSpots() {
  return LASER_PROMO.spotsLeft;
}
