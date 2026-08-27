import { trackEvent } from "./analytics";

const CONVERSION_SEND_TO = "AW-17817733574/XukTCNOB7Y8cEMaTlLBC";

/** Fire Google Ads conversion on WhatsApp intent. */
export function reportWhatsAppConversion() {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", { send_to: CONVERSION_SEND_TO });
    return;
  }
  if (typeof window.gtag_report_conversion === "function") {
    window.gtag_report_conversion();
  }
}

/** Track + convert before navigating to WhatsApp. */
export function onWhatsAppClick(buttonLocation, extra = {}) {
  reportWhatsAppConversion();
  trackEvent("whatsapp_click", {
    button_location: buttonLocation,
    page_url: typeof window !== "undefined" ? window.location.href : undefined,
    ...extra,
  });
}
