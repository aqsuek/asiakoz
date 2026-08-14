const ALLOWED_EVENTS = new Set([
  "page_view",
  "whatsapp_click",
  "organic_whatsapp_click",
  "phone_click",
  "organic_phone_click",
  "form_submit",
  "appointment_submit",
  "branch_select",
]);

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Track-Secret");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }

  const secret = process.env.TRACK_SECRET;
  const incomingSecret = req.headers["x-track-secret"];
  if (secret && incomingSecret && incomingSecret !== secret) {
    res.status(401).json({ ok: false });
    return;
  }

  const body = req.body || {};
  const eventName = String(body.event || "").slice(0, 80);
  if (!ALLOWED_EVENTS.has(eventName)) {
    res.status(400).json({ ok: false, error: "bad_event" });
    return;
  }

  const { appendEvent } = require("../../lib/store");
  appendEvent({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ts: Date.now(),
    event: eventName,
    page_path: String(body.page_path || "/").slice(0, 300),
    city: String(body.city || "").slice(0, 40) || undefined,
    language: String(body.language || "").slice(0, 12) || undefined,
    session_id: String(body.session_id || "").slice(0, 64) || undefined,
    button_location: String(body.button_location || "").slice(0, 80) || undefined,
    utm_source: String(body.utm_source || "").slice(0, 80) || undefined,
    utm_medium: String(body.utm_medium || "").slice(0, 80) || undefined,
    utm_campaign: String(body.utm_campaign || "").slice(0, 80) || undefined,
    referrer: String(body.referrer || "").slice(0, 300) || undefined,
  });

  res.status(204).end();
}
