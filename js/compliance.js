(function () {
  "use strict";

  if (location.protocol === "http:" && location.hostname !== "localhost") {
    location.replace("https://" + location.host + location.pathname + location.search + location.hash);
    return;
  }

  var consentText =
    'Я даю согласие на обработку моих персональных данных и принимаю условия <a href="/politika-konfidentsialnosti/" target="_blank" rel="noopener">Политики конфиденциальности</a>';

  function createConsentRow() {
    var row = document.createElement("label");
    row.className = "consent-row";
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "consent-checkbox";
    checkbox.required = true;
    var text = document.createElement("span");
    text.className = "consent-text";
    text.innerHTML = consentText;
    row.appendChild(checkbox);
    row.appendChild(text);
    return row;
  }

  function attachConsentToForms() {
    var forms = document.querySelectorAll("form");
    forms.forEach(function (form) {
      var submit = form.querySelector('button[type="submit"], input[type="submit"], .btn[type="submit"]');
      if (!submit || form.querySelector(".consent-row")) return;
      var row = createConsentRow();
      submit.parentNode.insertBefore(row, submit);
      form.addEventListener("submit", function (e) {
        var checked = row.querySelector(".consent-checkbox").checked;
        if (!checked) {
          e.preventDefault();
          alert("Для продолжения подтвердите согласие на обработку персональных данных.");
          return;
        }
        sendConsentLog("form_submit", { page: location.pathname });
      });
    });
  }

  function sendConsentLog(eventType, payload) {
    var body = {
      event: eventType,
      ts: new Date().toISOString(),
      page: payload.page || location.pathname,
      referrer: document.referrer || "",
      target: payload.target || ""
    };
    if (navigator.sendBeacon) {
      var blob = new Blob([JSON.stringify(body)], { type: "application/json" });
      navigator.sendBeacon("/api/consent-log", blob);
      return;
    }
    fetch("/api/consent-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true
    }).catch(function () {});
  }

  function pushDataLayer(eventName, payload) {
    window.dataLayer = window.dataLayer || [];
    var eventData = {
      event: eventName,
      page_path: location.pathname,
      page_url: location.href
    };
    if (payload) {
      Object.keys(payload).forEach(function (key) {
        eventData[key] = payload[key];
      });
    }
    window.dataLayer.push(eventData);
  }

  // Google Ads conversion event helper
  window.gtag_report_conversion = function (url) {
    var callback = function () {
      if (typeof url !== "undefined" && url) {
        window.location = url;
      }
    };
    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: "AW-17817733574/XukTCNOB7Y8cEMaTlLBC",
        event_callback: callback
      });
    } else {
      callback();
    }
    return false;
  };

  function attachAnalyticsEvents() {
    document.addEventListener(
      "submit",
      function (e) {
        var form = e.target;
        if (!form || form.tagName !== "FORM") return;
        var formId = form.id || "";
        var formName = form.getAttribute("name") || "";
        var formAction = form.getAttribute("action") || "";
        pushDataLayer("form_submit", {
          form_id: formId,
          form_name: formName,
          form_action: formAction
        });
        if (typeof window.gtag_report_conversion === "function") {
          window.gtag_report_conversion();
        }
      },
      true
    );

    document.addEventListener("click", function (e) {
      var link = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!link) return;
      var href = link.getAttribute("href") || "";

      if (href.indexOf("wa.me") !== -1) {
        pushDataLayer("whatsapp_click", {
          link_url: href,
          link_text: (link.textContent || "").trim()
        });
        if (typeof window.gtag_report_conversion === "function") {
          window.gtag_report_conversion();
        }
      }

      if (href.indexOf("tel:") === 0) {
        pushDataLayer("phone_click", {
          phone_number: href.replace("tel:", ""),
          link_text: (link.textContent || "").trim()
        });
        if (typeof window.gtag_report_conversion === "function") {
          window.gtag_report_conversion();
        }
      }
    });
  }

  function injectCookieBanner() {
    if (localStorage.getItem("asiakoz_cookie_accepted") === "1") return;
    var banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.innerHTML =
      '<div class="cookie-banner__text">Мы используем cookie для корректной работы сайта и улучшения сервиса.</div>' +
      '<button class="btn cookie-banner__btn" type="button">Принять</button>';
    document.body.appendChild(banner);
    var btn = banner.querySelector("button");
    btn.addEventListener("click", function () {
      localStorage.setItem("asiakoz_cookie_accepted", "1");
      banner.remove();
    });
  }

  function enrichFooter() {
    var legalHtml =
      '<a href="/politika-konfidentsialnosti/">Политика конфиденциальности</a> · ' +
      '<a href="/polzovatelskoe-soglashenie/">Пользовательское соглашение</a> · ' +
      '<a href="/glaznaya-klinika-almaty/#rekvizity">Лицензия и реквизиты</a>';
    document.querySelectorAll(".site-footer").forEach(function (footer) {
      var bottom = footer.querySelector(".footer-bottom");
      if (!bottom) return;
      var row = footer.querySelector(".footer-legal-links");
      if (row) {
        row.innerHTML = legalHtml;
        return;
      }
      var legal = document.createElement("p");
      legal.className = "footer-legal-links";
      legal.innerHTML = legalHtml;
      bottom.insertBefore(legal, bottom.firstChild);
    });
    document.querySelectorAll(".site-footer a[href]").forEach(function (a) {
      if (!a || !a.parentNode) return;
      var href = (a.getAttribute("href") || "").toLowerCase();
      var text = (a.textContent || "").toLowerCase().trim();
      var isLegacyPriceLink =
        href === "/prices" ||
        href === "/prices/" ||
        href.indexOf("/prices/") === 0 ||
        href === "/price" ||
        href === "/price/" ||
        href.indexOf("/price/") === 0 ||
        href.indexOf("pricelist") !== -1 ||
        text.indexOf("прейскурант") !== -1 ||
        text.indexOf("прайс") !== -1 ||
        text.indexOf("прайс-лист") !== -1 ||
        text.indexOf("price list") !== -1 ||
        text === "цены" ||
        text === "цена";
      if (isLegacyPriceLink) {
        a.parentNode.removeChild(a);
      }
    });
  }

  function initSiteChrome() {
    if (document.getElementById("root")) return;

    document.querySelectorAll(".container > .header, body > .container .header").forEach(function (header) {
      header.classList.add("site-header");
    });

    document.querySelectorAll("a.logo").forEach(function (logo) {
      if (logo.querySelector(".logo-wordmark")) return;
      var img = logo.querySelector(".logo-img");
      if (!img) return;
      var wrap = document.createElement("span");
      wrap.className = "logo-wordmark";
      wrap.innerHTML =
        '<span class="logo-text-title">ASIAKOZ</span>' +
        '<span class="logo-text-sub">Түрік көз клиникасы</span>' +
        '<span class="logo-text-sub logo-text-sub--ru">Турецкая глазная клиника</span>';
      logo.appendChild(wrap);
    });

    if (!document.getElementById("asiakoz-wa-fixed")) {
      var waText = encodeURIComponent("Здравствуйте! Хочу записаться в клинику AsiaKoz.");
      var bar = document.createElement("div");
      bar.id = "asiakoz-wa-fixed";
      bar.className = "asiakoz-wa-bar";
      bar.innerHTML =
        '<a class="asiakoz-wa-bar__link" href="https://wa.me/77003600180?text=' +
        waText +
        '" target="_blank" rel="noopener noreferrer">' +
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.197.15-.417.347-.386.667l1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>' +
        "<span>Записаться в WhatsApp</span></a>";
      document.body.appendChild(bar);
      document.body.classList.add("has-wa-bar");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSiteChrome();
    attachConsentToForms();
    injectCookieBanner();
    enrichFooter();
    attachAnalyticsEvents();
  });
})();
