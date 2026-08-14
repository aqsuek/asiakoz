const fs = require("fs");
const path = require("path");

const FILE = path.join(process.cwd(), "data", "events.json");
const MAX_EVENTS = 20000;

function ensureFile() {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf8");
}

function readEvents() {
  ensureFile();
  try {
    const raw = fs.readFileSync(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEvents(events) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(events.slice(-MAX_EVENTS)), "utf8");
}

function appendEvent(event) {
  const events = readEvents();
  events.push(event);
  writeEvents(events);
  return event;
}

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function summarize(events, days = 7) {
  const now = Date.now();
  const from = now - days * 24 * 60 * 60 * 1000;
  const todayStart = startOfDay();
  const window = events.filter((e) => e.ts >= from);
  const today = events.filter((e) => e.ts >= todayStart);

  const pageViews = window.filter((e) => e.event === "page_view");
  const wa = window.filter((e) => e.event === "whatsapp_click" || e.event === "organic_whatsapp_click");
  const phone = window.filter((e) => e.event === "phone_click" || e.event === "organic_phone_click");

  const pages = {};
  for (const e of pageViews) {
    const key = e.page_path || "/";
    pages[key] = (pages[key] || 0) + 1;
  }
  const topPages = Object.entries(pages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([pathName, views]) => ({ path: pathName, views }));

  const cities = {};
  for (const e of window) {
    const city = e.city || "unknown";
    if (!cities[city]) cities[city] = { city, views: 0, whatsapp: 0, phone: 0 };
    if (e.event === "page_view") cities[city].views += 1;
    if (e.event === "whatsapp_click" || e.event === "organic_whatsapp_click") cities[city].whatsapp += 1;
    if (e.event === "phone_click" || e.event === "organic_phone_click") cities[city].phone += 1;
  }

  const sessions = new Set(window.map((e) => e.session_id).filter(Boolean));
  const todaySessions = new Set(today.map((e) => e.session_id).filter(Boolean));

  const byDay = {};
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    byDay[key] = { date: key, views: 0, whatsapp: 0, phone: 0 };
  }
  for (const e of window) {
    const key = new Date(e.ts).toISOString().slice(0, 10);
    if (!byDay[key]) continue;
    if (e.event === "page_view") byDay[key].views += 1;
    if (e.event === "whatsapp_click" || e.event === "organic_whatsapp_click") byDay[key].whatsapp += 1;
    if (e.event === "phone_click" || e.event === "organic_phone_click") byDay[key].phone += 1;
  }

  return {
    days,
    today: {
      visitors: todaySessions.size,
      pageViews: today.filter((e) => e.event === "page_view").length,
      whatsapp: today.filter((e) => e.event === "whatsapp_click" || e.event === "organic_whatsapp_click").length,
      phone: today.filter((e) => e.event === "phone_click" || e.event === "organic_phone_click").length,
    },
    period: {
      visitors: sessions.size,
      pageViews: pageViews.length,
      whatsapp: wa.length,
      phone: phone.length,
    },
    topPages,
    cities: Object.values(cities).sort((a, b) => b.views - a.views),
    byDay: Object.values(byDay),
    recent: [...events].slice(-80).reverse(),
  };
}

module.exports = { readEvents, appendEvent, summarize };
