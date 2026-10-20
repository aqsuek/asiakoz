/* Bound to the private AsiaKoz request spreadsheet. Deploy as a Web App.
 * Script property SPREADSHEET_ID points to the destination; never return rows.
 * The public endpoint accepts appointments only. It cannot read patient data.
 */
var LEAD_HEADERS = ["ID заявки", "Дата (Алматы)", "Имя", "Телефон", "Направление", "Город", "Страница", "Язык", "Статус", "Согласие", "Версия согласия", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid"];
var LEAD_SERVICES = {laser: "Лазерная коррекция", kosoglazie: "Косоглазие", katarakta: "Катаракта", vitrektomiya: "Витрэктомия", keratoplastika: "Пересадка роговицы"};
var LEAD_PATHS = {laser: "/laser/", kosoglazie: "/kosoglazie/", katarakta: "/katarakta-almaty/", vitrektomiya: "/vitrektomiya-almaty/", keratoplastika: "/peresadka-rogovitsy-almaty/"};
var LEAD_ORIGINS = ["https://asiakoz.com", "https://www.asiakoz.com"];

function safeCell(value) {
  var text = String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, 300);
  return /^[\s]*[=+\-@]/.test(text) ? "'" + text : text;
}
function leadSheet() {
  var key = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!key) throw new Error("Destination not configured");
  var book = SpreadsheetApp.openById(key);
  var sheet = book.getSheetByName("Заявки с сайта");
  if (!sheet) throw new Error("Request tab not configured");
  var headers = sheet.getRange(1, 1, 1, LEAD_HEADERS.length).getValues()[0];
  if (JSON.stringify(headers) !== JSON.stringify(LEAD_HEADERS)) throw new Error("Header mismatch");
  return sheet;
}
function saveLead(data) {
  if (!data || !/^[a-f0-9-]{36}$/.test(data.request_id || "")) throw new Error("Invalid request");
  if (LEAD_ORIGINS.indexOf(data.parent_origin) < 0) throw new Error("Invalid origin");
  if (data.consent !== true || data.consent_version !== "lead-2026-10-20" || data.website) throw new Error("Invalid consent");
  if (!Object.prototype.hasOwnProperty.call(LEAD_SERVICES, data.service)) throw new Error("Invalid service");
  if (data.lang !== "ru" && data.lang !== "kk") throw new Error("Invalid language");
  var expected = (data.lang === "kk" ? "/kk" : "") + LEAD_PATHS[data.service];
  if (data.page !== expected) throw new Error("Invalid page");
  var name = String(data.name || "").trim();
  if (!name || name.length > 80 || !/^\+7\d{10}$/.test(data.phone || "")) throw new Error("Invalid contact");
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error("Busy");
  try {
    var sheet = leadSheet();
    var count = sheet.getLastRow();
    if (count > 1 && sheet.getRange(2, 1, count - 1, 1).createTextFinder(data.request_id).matchEntireCell(true).findNext()) return;
    // Limit repeated requests from the same telephone without keeping it in cache keys.
    var digest = Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, data.phone));
    var cache = CacheService.getScriptCache();
    if (cache.get("lead:" + digest)) throw new Error("Please wait before another request");
    var row = [data.request_id, Utilities.formatDate(new Date(), "Asia/Almaty", "yyyy-MM-dd HH:mm:ss"), name, data.phone, LEAD_SERVICES[data.service], "Алматы", data.page, data.lang, "Новая", "Да", data.consent_version];
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid"].forEach(function (key) { row.push(data[key] || ""); });
    sheet.appendRow(row.map(safeCell));
    SpreadsheetApp.flush();
    cache.put("lead:" + digest, "1", 60);
  } finally { lock.releaseLock(); }
}
function doPost(e) {
  var data = {}, ok = false;
  try {
    var raw = e && e.parameter && e.parameter.payload;
    if (!raw || raw.length > 8000) throw new Error("Invalid payload");
    data = JSON.parse(raw);
    saveLead(data);
    ok = true;
  } catch (_) {
    // Do not log personal data or return internal errors to public callers.
  }
  var origin = LEAD_ORIGINS.indexOf(data.parent_origin) >= 0 ? data.parent_origin : LEAD_ORIGINS[0];
  var receipt = {type: "asiakoz-lead-receipt", request_id: /^[a-f0-9-]{36}$/.test(data.request_id || "") ? data.request_id : "", ok: ok};
  var json = JSON.stringify(receipt).replace(/</g, "\\u003c");
  return HtmlService.createHtmlOutput('<!doctype html><meta charset="utf-8"><script>window.top.postMessage(' + json + ',' + JSON.stringify(origin) + ');</script>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({service: "AsiaKoz appointment intake", version: "2026-10-20"})).setMimeType(ContentService.MimeType.JSON);
}
