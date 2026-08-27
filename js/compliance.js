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

      var ctaId = link.getAttribute("data-cta");
      if (ctaId) {
        pushDataLayer("cta_click", {
          cta_id: ctaId,
          link_url: href,
          link_text: (link.textContent || "").trim()
        });
      }
    });

    document.addEventListener("toggle", function (e) {
      var details = e.target;
      if (!details || details.tagName !== "DETAILS") return;
      if (!details.closest("#faq")) return;
      var summary = details.querySelector("summary");
      pushDataLayer("faq_toggle", {
        faq_question: summary ? (summary.textContent || "").trim() : "",
        faq_open: details.open
      });
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


  function enforceWhatsAppOnly() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.remove();
    });
    document.querySelectorAll('body *').forEach(function (node) {
      if (node.childElementCount === 0 && node.textContent.trim() === '+7 700 888 01 80') {
        node.remove();
      }
    });
  }

  function readStoredCityId() {
    var valid = { almaty: 1, aqtau: 1, shymkent: 1 };
    try {
      var ls = localStorage.getItem("asiakoz-home-city");
      if (valid[ls]) return ls;
    } catch (e) {}
    var m = document.cookie.match(/(?:^|; )asiakoz-city=([^;]*)/);
    if (m && valid[m[1]]) return m[1];
    var path = location.pathname;
    if (path.indexOf("/aktau") !== -1 || path.indexOf("/aqtau") !== -1) return "aqtau";
    if (path.indexOf("/shymkent") !== -1) return "shymkent";
    return "almaty";
  }

  var CITY_CONTACTS = {
    almaty: {
      wa: "77003600180",
      tel: "+77008880180",
      display: "+7 700 888 01 80",
      waText: "Здравствуйте! Хочу записаться в клинику Азиякоз Алматы."
    },
    aqtau: {
      wa: "77758630180",
      tel: "+77758630180",
      display: "+7 775 863 01 80",
      waText: "Здравствуйте! Хочу записаться в клинику Азиякоз Актау."
    },
    shymkent: {
      wa: "77080750180",
      tel: "+77080750180",
      display: "+7 708 075 01 80",
      waText: "Здравствуйте! Хочу записаться в клинику Азиякоз Шымкент."
    }
  };

  function applyCityChrome() {
    if (document.getElementById("root")) return;
    var city = readStoredCityId();
    var contact = CITY_CONTACTS[city] || CITY_CONTACTS.almaty;
    document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.indexOf("wa.me") === -1) return;
      var textMatch = href.match(/[?&]text=([^&]*)/);
      var text = textMatch ? textMatch[1] : encodeURIComponent(contact.waText);
      a.setAttribute("href", "https://wa.me/" + contact.wa + "?text=" + text);
    });
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      a.setAttribute("href", "tel:" + contact.tel);
      var label = (a.textContent || "").trim();
      if (label.indexOf("+7") === 0) a.textContent = contact.display;
    });
    var fab = document.getElementById("asiakoz-wa-fixed");
    if (fab) {
      var link = fab.querySelector("a");
      if (link) {
        link.setAttribute(
          "href",
          "https://wa.me/" + contact.wa + "?text=" + encodeURIComponent(contact.waText)
        );
      }
    }
  }

  function initSiteChrome() {
    if (document.getElementById("root")) return;

    document.querySelectorAll(".container > .header, body > .container .header").forEach(function (header) {
      header.classList.add("site-header");
    });

    document.querySelectorAll(".logo-wordmark").forEach(function (el) {
      if (el.parentNode) el.parentNode.removeChild(el);
    });

    if (!document.getElementById("asiakoz-wa-fixed") && !document.querySelector(".sticky-whatsapp")) {
      var city = readStoredCityId();
      var contact = CITY_CONTACTS[city] || CITY_CONTACTS.almaty;
      var waPhone = contact.wa;
      var waText = encodeURIComponent(contact.waText);
      var waSvg =
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
      var bar = document.createElement("div");
      bar.id = "asiakoz-wa-fixed";
      bar.className = "asiakoz-wa-fab";
      bar.innerHTML =
        '<a class="asiakoz-wa-fab__link" href="https://wa.me/' +
        waPhone +
        "?text=" +
        waText +
        '" target="_blank" rel="noopener noreferrer" aria-label="Записаться в WhatsApp" title="Записаться в WhatsApp">' +
        waSvg +
        "</a>";
      document.body.appendChild(bar);
    }
    applyCityChrome();
  }

  window.addEventListener("storage", function (e) {
    if (e.key === "asiakoz-home-city" || e.key === null) applyCityChrome();
  });

  document.addEventListener("DOMContentLoaded", function () {
    enforceWhatsAppOnly();
    new MutationObserver(enforceWhatsAppOnly).observe(document.documentElement, { childList: true, subtree: true });
    initSiteChrome();
    attachConsentToForms();
    injectCookieBanner();
    enrichFooter();
    attachAnalyticsEvents();
  });
})();
