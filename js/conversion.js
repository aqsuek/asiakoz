(function () {
  "use strict";

  var ATTR_KEY = "asiakoz_ad_attribution";
  var ATTR_FIELDS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "gclid",
    "gbraid",
    "wbraid",
  ];

  function readAttr() {
    try {
      var raw = sessionStorage.getItem(ATTR_KEY) || sessionStorage.getItem("asiakoz_laser_utm");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writeAttr(data) {
    try {
      sessionStorage.setItem(ATTR_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function captureAttribution() {
    var params = new URLSearchParams(location.search);
    var stored = readAttr();
    var next = {};
    var k;
    for (k in stored) if (Object.prototype.hasOwnProperty.call(stored, k)) next[k] = stored[k];
    var found = false;
    ATTR_FIELDS.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        next[key] = value;
        found = true;
      }
    });
    if (!next.landing_page) next.landing_page = location.pathname;
    if (found || !stored.landing_page) writeAttr(next);
    return next;
  }

  function attrLine(attr, lang) {
    var parts = [];
    if (attr.utm_source) parts.push("source=" + attr.utm_source);
    if (attr.utm_medium) parts.push("medium=" + attr.utm_medium);
    if (attr.utm_campaign) parts.push("campaign=" + attr.utm_campaign);
    if (attr.gclid) parts.push("gclid=" + String(attr.gclid).slice(0, 12) + "…");
    if (!parts.length) return "";
    return (lang === "kk" ? "Жарнама: " : "Реклама: ") + parts.join(" · ");
  }

  function appendAttrToText(text, lang) {
    var attr = readAttr();
    var lines = [text];
    var line = attrLine(attr, lang);
    if (line) lines.push("", line);
    if (attr.landing_page) {
      lines.push((lang === "kk" ? "Бет: " : "Страница: ") + attr.landing_page);
    }
    return lines.join("\n");
  }

  function pageLang() {
    var l = (document.documentElement.lang || "ru").toLowerCase();
    return l.indexOf("kk") === 0 ? "kk" : "ru";
  }

  function enhanceWaLinks() {
    var lang = pageLang();
    document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.indexOf("wa.me") === -1) return;
      var match = href.match(/[?&]text=([^&]*)/);
      var base = match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : "";
      if (!base) {
        base =
          lang === "kk"
            ? "Сәлеметсіз бе! AsiaKoz клиникасына жазылғым келеді."
            : "Здравствуйте! Хочу записаться в AsiaKoz.";
      }
      if (base.indexOf("Реклама:") !== -1 || base.indexOf("Жарнама:") !== -1) return;
      var text = encodeURIComponent(appendAttrToText(base, lang));
      var phone = href.match(/wa\.me\/(\d+)/);
      if (!phone) return;
      a.setAttribute("href", "https://wa.me/" + phone[1] + "?text=" + text);
    });
  }

  function isAdTraffic() {
    var attr = readAttr();
    if (attr.gclid || attr.gbraid || attr.wbraid) return true;
    if (!attr.utm_source) return false;
    var source = String(attr.utm_source).toLowerCase();
    var medium = String(attr.utm_medium || "").toLowerCase();
    return (
      source.indexOf("google") !== -1 ||
      source.indexOf("gads") !== -1 ||
      medium === "cpc" ||
      medium === "ppc" ||
      medium === "paid"
    );
  }

  function injectAdBar() {
    if (document.getElementById("root") || document.getElementById("asiakoz-ad-bar")) return;
    if (!isAdTraffic()) return;
    var lang = pageLang();
    var copy =
      lang === "kk"
        ? {
            title: "Онлайн · 5 минутта жауап",
            sub: "Тегін WhatsApp кеңес",
            cta: "Жазылу",
          }
        : {
            title: "Онлайн · ответ за 5 минут",
            sub: "Бесплатная консультация в WhatsApp",
            cta: "Записаться",
          };
    var wa = document.querySelector('a[href*="wa.me"]');
    if (!wa) return;
    var bar = document.createElement("div");
    bar.id = "asiakoz-ad-bar";
    bar.className = "asiakoz-ad-bar";
    bar.innerHTML =
      '<div class="asiakoz-ad-bar__inner">' +
      '<div><strong>' +
      copy.title +
      "</strong><span>" +
      copy.sub +
      '</span></div><a href="' +
      wa.getAttribute("href") +
      '" target="_blank" rel="noopener" class="asiakoz-ad-bar__btn">' +
      copy.cta +
      "</a></div>";
    document.body.insertBefore(bar, document.body.firstChild);
  }

  function injectStyles() {
    if (document.getElementById("asiakoz-conversion-style")) return;
    var style = document.createElement("style");
    style.id = "asiakoz-conversion-style";
    style.textContent =
      ".asiakoz-ad-bar{position:sticky;top:0;z-index:9998;background:#e8f9fc;border-bottom:1px solid rgba(0,169,193,.2);font-family:system-ui,sans-serif}" +
      ".asiakoz-ad-bar__inner{max-width:1100px;margin:0 auto;padding:8px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px}" +
      ".asiakoz-ad-bar__inner strong{display:block;font-size:13px;color:#0f172a}" +
      ".asiakoz-ad-bar__inner span{display:block;font-size:11px;color:#64748b}" +
      ".asiakoz-ad-bar__btn{background:#25D366;color:#fff!important;text-decoration:none;padding:8px 14px;border-radius:999px;font-size:13px;font-weight:700;white-space:nowrap}" +
      ".wa-funnel{margin:24px 0;padding:20px 16px;border-radius:16px;background:#f8fafc;border:1px solid rgba(15,23,42,.06)}" +
      ".wa-funnel h2{margin:0 0 8px;font-size:1.25rem}" +
      ".wa-funnel ol{display:grid;gap:10px;list-style:none;padding:0;margin:16px 0 0}" +
      "@media(min-width:768px){.wa-funnel ol{grid-template-columns:repeat(3,1fr)}}" +
      ".wa-funnel li{background:#fff;border-radius:12px;padding:14px;border:1px solid rgba(15,23,42,.06)}" +
      ".wa-funnel .step-num{display:inline-flex;width:28px;height:28px;align-items:center;justify-content:center;border-radius:50%;background:#00A9C1;color:#fff;font-weight:700;font-size:12px;margin-bottom:8px}";
    document.head.appendChild(style);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("root")) return;
    captureAttribution();
    injectStyles();
    enhanceWaLinks();
    injectAdBar();
  });

  window.asiakozCaptureAttribution = captureAttribution;
  window.asiakozEnhanceWaLinks = enhanceWaLinks;
})();
