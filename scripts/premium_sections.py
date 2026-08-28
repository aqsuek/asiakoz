"""Premium HTML sections for diagnosis landing pages."""

from __future__ import annotations

import urllib.parse
from typing import Any, Callable


def _paras_html(paras: list[str]) -> str:
    out = []
    for i, p in enumerate(paras):
        if i:
            out.append(f'<p style="margin-top:12px;">{p}</p>')
        else:
            out.append(f"<p>{p}</p>")
    return "".join(out)


def premium_hero_html(
    h1: str,
    lead: str,
    hero_facts: list[tuple[str, str]],
    image: str,
    img_alt: str,
    city_name: str,
    address: str,
    branch_href: str,
    wa: str,
    lang: str,
    topic: str,
    doctor_href: str | None = None,
    doctor_img: str | None = None,
    doctor_name: str | None = None,
    doctor_role: str | None = None,
    phone: str | None = None,
    phone_display: str | None = None,
) -> str:
    greet = "Сәлеметсіз бе!" if lang == "kk" else "Здравствуйте!"
    wa_text = urllib.parse.quote(f"{greet} {topic} — {city_name}.")
    wa_link = f"https://wa.me/{wa}?text={wa_text}"
    addr_l = "Мекенжай" if lang == "kk" else "Адрес"
    branch_l = "Филиал" if lang == "kk" else "Филиал"
    wa_l = "WhatsApp-қа жазу" if lang == "kk" else "Записаться в WhatsApp"
    call_l = "Қоңырау" if lang == "kk" else "Позвонить"
    facts_html = "".join(
        f'<div class="hero-fact"><b>{b}</b><span>{t}</span></div>' for b, t in hero_facts
    )
    call_btn = ""
    if phone:
        call_btn = f'<a class="btn btn-outline" data-cta="hero-call" href="tel:{phone}">{call_l} · {phone_display}</a>'
    doctor_block = ""
    if doctor_href and doctor_img and doctor_name:
        doctor_block = f"""      <div class="katarakta-hero__media">
        <img src="{image}" alt="{img_alt}" width="1200" height="800" decoding="async" fetchpriority="high" />
        <a href="{doctor_href}" class="katarakta-hero__doctor">
          <img src="{doctor_img}" alt="" width="56" height="56" />
          <span><strong>{doctor_name}</strong>{doctor_role or ''}</span>
        </a>
      </div>"""
        hero_inner = f"""      <div class="katarakta-hero__text">
        <div class="spa-eyebrow">AsiaKoz · {city_name}</div>
        <h1>{h1}</h1>
        <p>{lead}</p>
        <div class="hero-facts hero-facts--4" aria-label="{'Негізгі фактілер' if lang == 'kk' else 'Ключевые факты'}">{facts_html}</div>
        <div class="spa-actions">
          <a class="btn" data-cta="hero-whatsapp" href="{wa_link}" target="_blank" rel="noopener">{wa_l}</a>
          {call_btn}
        </div>
        <p class="hero-address"><b>{addr_l}:</b> {address} · <a class="link" href="{branch_href}">{branch_l} {city_name}</a></p>
      </div>
{doctor_block}"""
        hero_cls = "seo-hero spa-hero katarakta-hero"
    else:
        hero_inner = f"""      <div class="spa-eyebrow">AsiaKoz · {city_name}</div>
      <h1>{h1}</h1>
      <div class="lp-media-row">
        <img class="lp-hero-photo" src="{image}" alt="{img_alt}" width="1200" height="800" />
      </div>
      <p>{lead}</p>
      <div class="hero-facts hero-facts--4">{facts_html}</div>
      <div class="spa-actions">
        <a class="btn" href="{wa_link}" target="_blank" rel="noopener">{wa_l}</a>
        {call_btn}
      </div>
      <p class="hero-address"><b>{addr_l}:</b> {address}</p>"""
        hero_cls = "seo-hero spa-hero"

    return f"""    <section class="{hero_cls}">
{hero_inner}
    </section>"""


def why_city_html(city_name: str, name: str, lang: str, fmt: Callable[[str], str]) -> str:
    title = f"Неге AsiaKoz {city_name} қаласында" if lang == "kk" else f"Почему выбирают AsiaKoz в {city_name}"
    sub = (
        f"{city_name} филиалында диагностика алдымен, емдеу — көрсеткіш бойынша."
        if lang == "kk"
        else f"В филиале {city_name} сначала диагностика, лечение — только по показаниям."
    )
    cards_ru = [
        ("Турецкие хирурги", "В сети AsiaKoz работают опытные офтальмохирурги с международной практикой."),
        ("Диагностика перед лечением", "План лечения строится после обследования — без давления и «шаблонных» операций."),
        ("Понятный маршрут", fmt("Адрес, WhatsApp и врачи филиала {city} — на одной странице.")),
        ("Сеть клиник", "Алматы, Актау, Шымкент — единые стандарты диагностики и хирургии."),
    ]
    cards_kk = [
        ("Түрік хирургтер", "AsiaKoz желісінде тәжірибелі офтальмохирургтер."),
        ("Алдымен диагностика", "Ем жоспары тексеруден кейін."),
        ("Түсінікті маршрут", fmt("{city} филиалының мекенжайы мен WhatsApp — бір бетте.")),
        ("Клиника желісі", "Алматы, Ақтау, Шымкент."),
    ]
    cards = cards_kk if lang == "kk" else cards_ru
    items = "".join(
        f"""        <article class="card">
          <h3 class="card-title">{t}</h3>
          <p class="card-text">{p}</p>
        </article>"""
        for t, p in cards
    )
    return f"""    <section class="section" id="why-almaty">
      <h2 class="section-title">{title}</h2>
      <p class="section-subtitle">{sub}</p>
      <div class="why-grid">{items}</div>
    </section>"""


def what_paras_html(paras: list[str], name: str, lang: str) -> str:
    title = f"{name} деген не" if lang == "kk" else f"Что такое {name.lower()}"
    body = _paras_html(paras)
    return f"""    <section class="section" id="what">
      <h2 class="section-title">{title}</h2>
{body}
    </section>"""


def symptoms_premium_html(symptoms: list[str], lang: str) -> str:
    title = "Негізгі белгілер" if lang == "kk" else "Основные симптомы"
    note = (
        "Бұл белгілер басқа ауруларда да болуы мүмкін. Диагноз — тек дәрігерден кейін."
        if lang == "kk"
        else "Эти симптомы могут встречаться и при других заболеваниях. Точный диагноз — после осмотра врача."
    )
    items = "".join(f"<li>{s};</li>" for s in symptoms)
    return f"""    <section class="section" id="symptoms">
      <h2 class="section-title">{title}</h2>
      <ul class="symptom-grid">{items}</ul>
      <p class="section-note">{note}</p>
    </section>"""


def when_premium_html(note: str, lang: str) -> str:
    title = "Қашан дәрігерге жүгіну керек" if lang == "kk" else "Когда обратиться к врачу"
    return f"""    <section class="section" id="when">
      <h2 class="section-title">{title}</h2>
      <p>{note}</p>
    </section>"""


def alt_treatment_html(title: str, paras: list[str], lang: str) -> str:
    if not paras:
        return ""
    body = _paras_html(paras)
    return f"""    <section class="section" id="without-surgery">
      <h2 class="section-title">{title}</h2>
{body}
    </section>"""


def diagnostics_list_html(items: list[str], lang: str, link_html: str = "") -> str:
    title = "Емдеу алдындағы диагностика" if lang == "kk" else "Диагностика перед лечением"
    intro = (
        "Зерттеулер тізімін дәрігер көрсеткіш бойынша анықтайды."
        if lang == "kk"
        else "Состав обследований врач определяет индивидуально по показаниям."
    )
    lis = "".join(f"<li>{it};</li>" for it in items)
    note = f'<p class="section-note">{link_html}</p>' if link_html else ""
    return f"""    <section class="section" id="diagnostics">
      <h2 class="section-title">{title}</h2>
      <p>{intro}</p>
      <p style="margin-top:12px;">{'Мүмкін зерттеулер:' if lang == 'kk' else 'По показаниям могут проводиться:'}</p>
      <ul class="plain-list">{lis}</ul>
      {note}
    </section>"""


def indications_grid_html(
    indications: list[tuple[str, str, str]],
    lang: str,
    prefix: str = "/kk" if False else "",
) -> str:
    if not indications:
        return ""
    title = "Қай ауруларда емдеу" if lang == "kk" else "При каких заболеваниях проводится лечение"
    cards = []
    for t, text, href in indications:
        kk_href = href if href.startswith("/kk") else f"/kk{href}" if not href.startswith("http") else href
        use_href = kk_href if lang == "kk" else href
        cards.append(
            f"""        <div class="card">
          <div class="card-title">{t}</div>
          <p class="card-text">{text} <a class="link" href="{use_href}">{t} →</a></p>
        </div>"""
        )
    note = (
        "Диагноз болса да, әр пациентке операция қажет емес."
        if lang == "kk"
        else "Наличие диагноза не означает, что лечение одинаково для каждого пациента. Решение — после осмотра."
    )
    return f"""    <section class="section" id="indications">
      <h2 class="section-title">{title}</h2>
      <div class="grid-2">{''.join(cards)}</div>
      <p class="section-note">{note}</p>
    </section>"""


def how_steps_html(steps: list[tuple[str, str]], lang: str) -> str:
    title = "Емдеу қалай өтеді" if lang == "kk" else "Как проходит лечение"
    cards = "".join(
        f'<div class="step-card"><div class="step-num">{i}</div><h3>{t}</h3><p>{p}</p></div>'
        for i, (t, p) in enumerate(steps, 1)
    )
    return f"""    <section class="section" id="how">
      <h2 class="section-title">{title}</h2>
      <div class="steps-grid">{cards}</div>
    </section>"""


def preparation_html(items: list[str], lang: str) -> str:
    title = "Дайындық" if lang == "kk" else "Подготовка к лечению"
    intro = (
        "Дәрігер жеке тапсырмалар береді."
        if lang == "kk"
        else "Врач выдаёт индивидуальный список рекомендаций."
    )
    lis = "".join(f"<li>{it};</li>" for it in items)
    return f"""    <section class="section" id="preparation">
      <h2 class="section-title">{title}</h2>
      <p>{intro}</p>
      <ul class="plain-list">{lis}</ul>
    </section>"""


def recovery_html(cards: list[tuple[str, str]], lang: str) -> str:
    title = "Оңалу" if lang == "kk" else "Восстановление после лечения"
    intro = (
        "Мерзімдер жеке — дәрігердің нұсқауын сақтаңыз."
        if lang == "kk"
        else "Сроки индивидуальны — соблюдайте назначения врача."
    )
    grid = "".join(
        f'<div class="card"><div class="card-title">{t}</div><p class="card-text">{p}</p></div>'
        for t, p in cards
    )
    urgent = (
        "Ауыру немесе көру күрт нашарласа — клиникаға хабарласыңыз."
        if lang == "kk"
        else "При резкой боли или внезапном снижении зрения — срочно свяжитесь с клиникой."
    )
    return f"""    <section class="section" id="recovery">
      <h2 class="section-title">{title}</h2>
      <p>{intro}</p>
      <div class="grid-2" style="margin-top:16px;">{grid}</div>
      <p class="section-note">{urgent}</p>
    </section>"""


def risks_html(paras: list[str], lang: str) -> str:
    title = "Тәуекелдер мен шектеулер" if lang == "kk" else "Возможные риски и ограничения"
    body = _paras_html(paras)
    return f"""    <section class="section" id="risks">
      <h2 class="section-title">{title}</h2>
{body}
    </section>"""


def surgeon_grid_html(
    doc_ids: list,
    doctors_db: dict,
    bios: dict,
    city_name: str,
    lang: str,
    wa: str,
    topic: str,
) -> str:
    title = f"AsiaKoz дәрігерлері — {city_name}" if lang == "kk" else f"Врачи AsiaKoz в {city_name}"
    sub = (
        "Конкретті дәрігерді тексеруден кейін таңдаймыз."
        if lang == "kk"
        else "Конкретного врача подбираем после записи и обследования."
    )
    cards = []
    for did in doc_ids:
        d = doctors_db[did]
        spec = d["spec_kk"] if lang == "kk" else d["spec_ru"]
        bio = bios.get(did, {}).get(lang, spec)
        branch = f"AsiaKoz · {city_name}"
        cards.append(
            f"""        <a href="{d['href']}" class="lp-doctor-card surgeon-featured">
          <div class="lp-doctor-photo">
            <img src="{d['img']}" alt="{d['name']}" width="400" height="500" loading="lazy" decoding="async" />
          </div>
          <div class="lp-doctor-body">
            <h3>{d['name']}</h3>
            <p class="spec">{spec}</p>
            <p class="city">{branch}</p>
            <p class="card-text" style="margin-top:8px;">{bio} <span class="link">{'Дәрігер беті' if lang == 'kk' else 'Страница врача'} →</span></p>
          </div>
        </a>"""
        )
    greet = "Сәлеметсіз бе!" if lang == "kk" else "Здравствуйте!"
    wa_link = f"https://wa.me/{wa}?text=" + urllib.parse.quote(f"{greet} {topic} — {city_name}.")
    cta = "WhatsApp-қа жазу" if lang == "kk" else "Записаться на приём"
    return f"""    <section class="section" id="surgeon">
      <h2 class="section-title">{title}</h2>
      <p class="section-subtitle">{sub}</p>
      <div class="surgeon-grid">{''.join(cards)}</div>
      <div class="spa-actions" style="margin-top:16px;">
        <a class="btn" data-cta="doctor-wa" href="{wa_link}" target="_blank" rel="noopener">{cta}</a>
      </div>
    </section>"""


def reviews_section_html(city_name: str, lang: str, ig: str) -> str:
    title = "Пациенттер видео пікірлері" if lang == "kk" else "Видеоотзывы пациентов"
    if lang == "kk":
        body = (
            f"Нақты видео пікірлер "
            f'<a class="link" href="/kk/otzyvy-asiakoz-almaty/">AsiaKoz {city_name} пікірлері</a> '
            f"бөлімінде. Instagram: "
            f'<a href="{ig}" target="_blank" rel="noopener" class="link">видео пікірлер →</a>'
        )
    else:
        body = (
            f"Реальные видеоотзывы собраны в разделе "
            f'<a class="link" href="/otzyvy-asiakoz-almaty/">отзывы о клинике {city_name}</a>. '
            f'<a href="{ig}" target="_blank" rel="noopener" class="link">Ещё видео в Instagram →</a>'
        )
    return f"""    <section class="section" id="reviews">
      <h2 class="section-title">{title}</h2>
      <p>{body}</p>
    </section>"""


def other_cities_html(dx_id: str, current_city: str, cities: list[str], cities_db: dict, lang: str) -> str:
    others = [c for c in cities if c != current_city]
    if not others:
        return ""
    title = "Басқа қалалардағы филиалдар" if lang == "kk" else "Другие филиалы AsiaKoz"
    sub = (
        "Қабылдау кестесі филиалға байланысты."
        if lang == "kk"
        else "График приёма зависит от филиала — уточняйте в WhatsApp."
    )
    cards = []
    for oc in others:
        cd = cities_db[oc]
        label = cd["kk"] if lang == "kk" else cd["ru"]
        href = cd["kk_href"] if lang == "kk" else cd["href"]
        cards.append(
            f"""        <div class="card">
          <div class="card-title">{label}</div>
          <p class="card-text"><a class="link" href="{href}">AsiaKoz {label} →</a></p>
        </div>"""
        )
    return f"""    <section class="section" id="other-cities">
      <h2 class="section-title">{title}</h2>
      <p class="section-subtitle">{sub}</p>
      <div class="grid-2">{''.join(cards)}</div>
    </section>"""


def premium_faq_html(faq: list[tuple[str, str]], lang: str) -> str:
    title = "Сұрақ-жауап" if lang == "kk" else "Вопросы и ответы"
    items = "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in faq)
    return f"""    <section class="section faq" id="faq">
      <h2 class="section-title">{title}</h2>
      {items}
    </section>"""


def related_services_grid_html(links: list[tuple[str, str]], lang: str) -> str:
    if not links:
        return ""
    title = "AsiaKoz басқа қызметтері" if lang == "kk" else "Другие направления AsiaKoz"
    sub = (
        "Толық каталог — "
        f'<a class="link" href="{"/kk/uslugi/" if lang == "kk" else "/uslugi/"}">'
        f'{"қызметтер" if lang == "kk" else "услуги"}</a>.'
    )
    cards = "".join(
        f"""        <div class="card">
          <div class="card-title">{t}</div>
          <p class="card-text"><a class="link" href="{h}">{t} →</a></p>
        </div>"""
        for t, h in links
    )
    return f"""    <section class="section" id="other-services">
      <h2 class="section-title">{title}</h2>
      <p class="section-subtitle">{sub}</p>
      <div class="grid-2">{cards}</div>
    </section>"""


from premium_deep import deep_section_html


def premium_body_html(
    premium: dict[str, Any],
    copy: dict[str, Any],
    lang: str,
    fmt: Callable[[str], str],
    city: dict,
    dx_id: str,
    prices_html_fn,
    hubs_html_fn,
    med_trust_html_fn,
    methods_html_fn,
) -> str:
    city_name = city["kk"] if lang == "kk" else city["ru"]
    diag_link = ""
    if lang == "kk":
        diag_link = 'Толығырақ: <a class="link" href="/kk/diagnostika-almaty/">көру диагностикасы</a>.'
    else:
        diag_link = 'Подробнее: <a class="link" href="/diagnostika-almaty/">диагностика зрения</a>.'

    symptoms = premium.get("symptoms") or []
    enriched = copy
    parts = [
        prices_html_fn(enriched.get("prices") or [], lang, city["wa"], premium["name"]),
        why_city_html(city_name, premium["name"], lang, fmt),
        what_paras_html(premium.get("what_paras", []), premium["name"], lang),
    ]
    if symptoms:
        parts.append(symptoms_premium_html(symptoms, lang))
    parts.extend(
        [
            when_premium_html(premium.get("when_note", ""), lang),
            alt_treatment_html(premium.get("alt_title", ""), premium.get("alt_paras", []), lang),
            diagnostics_list_html(premium.get("diagnostics", []), lang, diag_link),
            methods_html_fn(enriched.get("methods") or enriched.get("facts", []), lang, fmt),
            deep_section_html(premium.get("deep")),
            indications_grid_html(premium.get("indications", []), lang),
            how_steps_html(premium.get("how_steps", []), lang),
            preparation_html(premium.get("preparation", []), lang),
            recovery_html(premium.get("recovery", []), lang),
            risks_html(premium.get("risks", []), lang),
            hubs_html_fn(enriched.get("hubs", []), lang),
            related_services_grid_html(premium.get("related_services", []), lang),
            med_trust_html_fn(lang),
        ]
    )
    return "\n".join(p for p in parts if p)
