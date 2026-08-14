#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const EVENTS = path.join(ROOT, "data", "events.json");
const MAX_EVENTS = 20000;

const payload = JSON.parse(process.argv[2] || "{}");
const event = {
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  ts: Date.now(),
  event: String(payload.event || "").slice(0, 80),
  page_path: String(payload.page_path || "/").slice(0, 300),
  city: payload.city ? String(payload.city).slice(0, 40) : undefined,
  language: payload.language ? String(payload.language).slice(0, 12) : undefined,
  session_id: payload.session_id ? String(payload.session_id).slice(0, 64) : undefined,
  button_location: payload.button_location ? String(payload.button_location).slice(0, 80) : undefined,
  utm_source: payload.utm_source ? String(payload.utm_source).slice(0, 80) : undefined,
  utm_medium: payload.utm_medium ? String(payload.utm_medium).slice(0, 80) : undefined,
  utm_campaign: payload.utm_campaign ? String(payload.utm_campaign).slice(0, 80) : undefined,
  referrer: payload.referrer ? String(payload.referrer).slice(0, 300) : undefined,
};

const allowed = new Set([
  "page_view",
  "whatsapp_click",
  "organic_whatsapp_click",
  "phone_click",
  "organic_phone_click",
  "form_submit",
  "appointment_submit",
  "branch_select",
]);

if (!allowed.has(event.event)) {
  console.error("bad_event");
  process.exit(1);
}

let events = [];
if (fs.existsSync(EVENTS)) {
  events = JSON.parse(fs.readFileSync(EVENTS, "utf8"));
  if (!Array.isArray(events)) events = [];
}
events.push(event);
fs.writeFileSync(EVENTS, JSON.stringify(events.slice(-MAX_EVENTS), null, 2) + "\n");
console.log("event_appended", event.id);
