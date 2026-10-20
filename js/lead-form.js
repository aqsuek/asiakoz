(function () {
  "use strict";
  var routes = {
    "/laser/": ["laser", "Лазерная коррекция зрения", "Лазерлік көру түзету"],
    "/kosoglazie/": ["kosoglazie", "Лечение косоглазия", "Қылилықты емдеу"],
    "/katarakta-almaty/": ["katarakta", "Лечение катаракты", "Катарактаны емдеу"],
    "/vitrektomiya-almaty/": ["vitrektomiya", "Витрэктомия", "Витрэктомия"],
    "/peresadka-rogovitsy-almaty/": ["keratoplastika", "Пересадка роговицы", "Қасаң қабықты ауыстыру"]
  };
  var path = location.pathname.replace(/^\/kk\//, "/").replace(/\/?$/, "/");
  var service = routes[path];
  var config = window.ASIAKOZ_LEAD_FORM || {};
  var preview = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && config.preview === true;
  if (!service || (!preview && !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(config.endpoint || ""))) return;
  var kk = location.pathname.indexOf("/kk/") === 0;
  var copy = kk ? {
    heading: "Қабылдауға жазылыңыз", intro: "Атыңыз бен телефон нөміріңізді қалдырыңыз. Өтінім сақталған соң WhatsApp-та дайын хабарлама ашылады.",
    name: "Атыңыз", phone: "Телефон нөмірі", button: "Жіберу және WhatsApp ашу", busy: "Өтінім сақталып жатыр…",
    consent: "Қабылдауға жазылу үшін атым мен телефон нөмірімді Google кестесіне сақтауға және WhatsApp-та дайындауға келісемін.",
    policy: "Құпиялылық саясаты", foot: "WhatsApp-та хабарламаны жіберу батырмасын өзіңіз басасыз.",
    success: "Өтінім сақталды. Дайын хабарламаны WhatsApp-та жіберіңіз.", open: "Дайын хабарламаны WhatsApp-та ашу",
    error: "Өтінімді сақтау расталмады. Қайта көріңіз немесе WhatsApp арқылы тікелей жазыңыз.", invalid: "Телефон нөмірін +7 700 000 00 00 түрінде енгізіңіз.",
    demo: "Бұл — алдын ала қарау. Кесте қосылғанша деректер жіберілмейді.", direct: "WhatsApp арқылы жазу"
  } : {
    heading: "Запишитесь на консультацию", intro: "Оставьте имя и телефон. После сохранения заявки откроется WhatsApp с готовым сообщением.",
    name: "Ваше имя", phone: "Номер телефона", button: "Отправить и открыть WhatsApp", busy: "Сохраняем заявку…",
    consent: "Согласен на сохранение имени и телефона в Google Таблице и подготовку сообщения в WhatsApp для записи на приём.",
    policy: "Политика конфиденциальности", foot: "Нажмите «Отправить» в WhatsApp самостоятельно.",
    success: "Заявка сохранена. Отправьте готовое сообщение в WhatsApp.", open: "Открыть готовое сообщение в WhatsApp",
    error: "Сохранение заявки не подтверждено. Повторите попытку или напишите напрямую в WhatsApp.", invalid: "Введите телефон в формате +7 700 000 00 00.",
    demo: "Предварительный просмотр. Данные не отправляются до подключения таблицы.", direct: "Написать в WhatsApp"
  };
  var phone = /^\d{11}$/.test(config.whatsapp || "") ? config.whatsapp : "77003600180";

  function event(name, id) {
    window.dataLayer = window.dataLayer || [];
    // Never send the patient's name, telephone or message to analytics.
    window.dataLayer.push({event: name, form_id: "asiakoz-lead", service_id: service[0], lead_id: id});
  }
  function normalizePhone(raw) {
    var digits = raw.replace(/\D/g, "");
    if (digits.length === 11 && digits[0] === "8") digits = "7" + digits.slice(1);
    return /^7\d{10}$/.test(digits) ? "+" + digits : "";
  }
  function id() { return crypto.randomUUID(); }
  function mount() {
    if (location.pathname.replace(/^\/kk\//, "/").replace(/\/?$/, "/") !== path) {
      var old = document.getElementById("asiakoz-lead");
      if (old) old.remove();
      return;
    }
    if (document.getElementById("asiakoz-lead")) return;
    var hero = document.querySelector(".seo-hero, .lp-hero");
    if (!hero && document.getElementById("root")) {
      var h1 = document.querySelector("#root h1");
      hero = h1 && h1.closest("section");
    }
    if (!hero) return;
    var section = document.createElement("section");
    section.id = "asiakoz-lead";
    section.className = "ak-lead";
    section.setAttribute("aria-labelledby", "ak-lead-title");
    section.innerHTML = '<div class="ak-lead__copy"><p class="ak-lead__eyebrow">ASIAKOZ · '+(kk ? "АЛМАТЫ" : "АЛМАТЫ")+'</p><h2 id="ak-lead-title">'+copy.heading+'</h2><p>'+copy.intro+'</p><p class="ak-lead__service"></p></div>' +
      '<form class="ak-lead__form" data-asiakoz-lead="true"><div class="ak-lead__fields"><label>'+copy.name+'<input name="name" autocomplete="given-name" maxlength="80" required></label><label>'+copy.phone+'<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 700 000 00 00" maxlength="24" required></label></div>'+
      '<div class="ak-lead__trap" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div>'+
      '<label class="consent-row ak-lead__consent"><input type="checkbox" class="consent-checkbox" required><span>'+copy.consent+' <a href="/politika-konfidentsialnosti/" target="_blank" rel="noopener">'+copy.policy+'</a></span></label>'+
      '<button type="submit" class="ak-lead__submit">'+copy.button+'</button><p class="ak-lead__foot">'+copy.foot+'</p><p class="ak-lead__status" role="status" aria-live="polite"></p><a class="ak-lead__continue" hidden target="_blank" rel="noopener">'+copy.open+'</a><a class="ak-lead__direct" href="https://wa.me/'+phone+'" target="_blank" rel="noopener">'+copy.direct+'</a></form>';
    section.querySelector(".ak-lead__service").textContent = service[kk ? 2 : 1];
    hero.insertAdjacentElement("afterend", section);
    wire(section);
  }
  function wire(section) {
    var form = section.querySelector("form"), status = section.querySelector(".ak-lead__status");
    var submit = section.querySelector("button[type=submit]"), continuation = section.querySelector(".ak-lead__continue");
    var pending = false, requestId = "", previousIdentity = "";
    if (preview) status.textContent = copy.demo;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (pending || !form.reportValidity() || form.elements.website.value) return;
      var patientPhone = normalizePhone(form.elements.phone.value);
      form.elements.phone.setCustomValidity(patientPhone ? "" : copy.invalid);
      if (!form.reportValidity()) return;
      var name = form.elements.name.value.trim();
      if (!name) { form.elements.name.setCustomValidity(kk ? "Атыңызды енгізіңіз." : "Введите имя."); form.reportValidity(); return; }
      if (preview) { status.textContent = copy.demo; return; }
      var identity = name + "|" + patientPhone;
      if (!requestId || identity !== previousIdentity) requestId = id();
      previousIdentity = identity;
      var payload = {request_id: requestId, name: name, phone: patientPhone, service: service[0], lang: kk ? "kk" : "ru", page: location.pathname, consent: true, consent_version: "lead-2026-10-20", website: "", parent_origin: location.origin};
      // Attribution remains in the private sheet, not in a patient's WhatsApp message.
      try {
        var attr = JSON.parse(sessionStorage.getItem("asiakoz_ad_attribution") || "{}");
        ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid"].forEach(function (key) { payload[key] = String(attr[key] || new URLSearchParams(location.search).get(key) || "").slice(0, 300); });
      } catch (_) {}
      var message = kk ? "Сәлеметсіз бе! AsiaKoz клиникасына жазылғым келеді.\nАтым: " + name + "\nТелефон: " + patientPhone + "\nБағыт: " + service[2] + "\nҚала: Алматы\nӨтінім: " + requestId : "Здравствуйте! Хочу записаться в AsiaKoz.\nИмя: " + name + "\nТелефон: " + patientPhone + "\nНаправление: " + service[1] + "\nГород: Алматы\nЗаявка: " + requestId;
      var wa = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
      pending = true; submit.disabled = true; submit.textContent = copy.busy; status.textContent = ""; continuation.hidden = true;
      // Reserve the window within the user gesture; navigate only after a save receipt.
      var popup = window.open("about:blank", "_blank");
      if (popup) { popup.opener = null; popup.document.title = copy.busy; popup.document.body.textContent = copy.busy; }
      var frame = document.createElement("iframe");
      frame.name = "ak_lead_" + requestId.replace(/-/g, ""); frame.hidden = true; frame.title = "Save appointment request";
      document.body.appendChild(frame);
      var transport = document.createElement("form");
      transport.setAttribute("data-asiakoz-lead", "true");
      transport.hidden = true; transport.method = "POST"; transport.action = config.endpoint; transport.target = frame.name;
      var input = document.createElement("input"); input.name = "payload"; input.value = JSON.stringify(payload); transport.appendChild(input); document.body.appendChild(transport);
      var timer, settled = false;
      function finish(ok) {
        if (settled) return;
        settled = true;
        clearTimeout(timer); window.removeEventListener("message", receive); transport.remove();
        // Keep the receipt iframe briefly while Google finishes its response.
        setTimeout(function () { frame.remove(); }, 1000);
        pending = false; submit.disabled = false; submit.textContent = copy.button;
        status.textContent = ok ? copy.success : copy.error;
        if (!ok) { if (popup) popup.close(); return; }
        event("lead_saved", requestId);
        if (typeof window.gtag === "function") window.gtag("event", "conversion", {
          send_to: "AW-17817733574/XukTCNOB7Y8cEMaTlLBC", transaction_id: requestId
        });
        continuation.href = wa; continuation.hidden = false;
        if (popup && !popup.closed) popup.location.replace(wa);
        // A saved request is not a sent WhatsApp message or a confirmed appointment.
      }
      function receive(e) {
        if (!/^https:\/\/(?:script\.google\.com|(?:[a-z0-9-]+\.)?script\.googleusercontent\.com|[a-z0-9-]+-script\.googleusercontent\.com)$/.test(e.origin)) return;
        var value = e.data;
        if (!value || value.type !== "asiakoz-lead-receipt" || value.request_id !== requestId || typeof value.ok !== "boolean") return;
        finish(value.ok);
      }
      window.addEventListener("message", receive);
      timer = setTimeout(function () { finish(false); }, 30000);
      HTMLFormElement.prototype.submit.call(transport);
    });
    form.elements.phone.addEventListener("input", function () { this.setCustomValidity(""); });
    form.elements.name.addEventListener("input", function () { this.setCustomValidity(""); });
  }
  function start() {
    var link = document.createElement("link"); link.rel = "stylesheet"; link.href = "/css/lead-form.css?v=20261020"; document.head.appendChild(link);
    mount();
    if (document.getElementById("root")) new MutationObserver(mount).observe(document.getElementById("root"), {childList: true, subtree: true});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
