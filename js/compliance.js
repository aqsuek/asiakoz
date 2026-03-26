(function () {
  "use strict";

  var LEGAL = {
    licenseNumber: "№ ________",
    licenseDate: "__.__.____",
    licenseAuthority: "____________________________",
    legalEntity: "ТОО \"ASIA KOZ\"",
    bin: "231040028960",
    legalAddress: "050016, г. Алматы, Алмалинский район, пр. Райымбека, д. 176А"
  };

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
      }

      if (href.indexOf("tel:") === 0) {
        pushDataLayer("phone_click", {
          phone_number: href.replace("tel:", ""),
          link_text: (link.textContent || "").trim()
        });
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
    var footers = document.querySelectorAll(".site-footer");
    footers.forEach(function (footer) {
      if (footer.querySelector(".footer-legal-links")) return;
      var bottom = footer.querySelector(".footer-bottom");
      if (!bottom) return;
      var legal = document.createElement("p");
      legal.className = "footer-legal-links";
      legal.innerHTML =
        '<a href="/politika-konfidentsialnosti/">Политика конфиденциальности</a> · ' +
        '<a href="/polzovatelskoe-soglashenie/">Пользовательское соглашение</a> · ' +
        '<a href="/prices/">Прейскурант</a>';
      var req = document.createElement("p");
      req.className = "footer-requisites";
      req.textContent =
        "Лицензия: " +
        LEGAL.licenseNumber +
        " от " +
        LEGAL.licenseDate +
        ", выдана: " +
        LEGAL.licenseAuthority +
        ". " +
        LEGAL.legalEntity +
        ", БИН " +
        LEGAL.bin +
        ", юр. адрес: " +
        LEGAL.legalAddress +
        ".";
      bottom.insertBefore(legal, bottom.firstChild);
      bottom.insertBefore(req, bottom.firstChild.nextSibling);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    attachConsentToForms();
    injectCookieBanner();
    enrichFooter();
    attachAnalyticsEvents();
  });
})();
