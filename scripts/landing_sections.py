"""Extended HTML sections and copy enrichment for diagnosis landing pages."""

from __future__ import annotations

from typing import Any

# Internal SEO hubs per diagnosis id
RELATED_HUBS: dict[str, list[tuple[str, str, str]]] = {
    # (ru_href, kk_href, ru_label) — kk label derived when needed
    "miopiya": [
        ("/laser/", "/kk/laser/", "Лазерная коррекция"),
        ("/diagnostika-almaty/", "/kk/diagnostika-almaty/", "Диагностика зрения"),
        ("/icl-almaty/", "/kk/icl-almaty/", "Имплантация ICL"),
    ],
    "katarakta": [
        ("/diagnostika-almaty/", "/kk/diagnostika-almaty/", "Диагностика"),
        ("/zamena-hrustalika-almaty/", "/kk/zamena-hrustalika-almaty/", "Замена хрусталика"),
    ],
    "glaukoma": [
        ("/diagnostika-almaty/", "/kk/diagnostika-almaty/", "Диагностика"),
        ("/operatsiya-glaukoma-almaty/", "/kk/operatsiya-glaukoma-almaty/", "Операция при глаукоме"),
    ],
    "vitrektomiya": [
        ("/setchatka-almaty/", "/kk/setchatka-almaty/", "Болезни сетчатки"),
        ("/diagnostika-almaty/", "/kk/diagnostika-almaty/", "Диагностика"),
    ],
    "kosoglazie": [
        ("/deti-almaty/", "/kk/deti-almaty/", "Детская офтальмология"),
        ("/diagnostika-almaty/", "/kk/diagnostika-almaty/", "Диагностика"),
    ],
    "diagnostika": [
        ("/laser/", "/kk/laser/", "Лазерная коррекция"),
        ("/katarakta-almaty/", "/kk/katarakta-almaty/", "Катаракта"),
    ],
    "deti": [
        ("/kosoglazie/", "/kk/kosoglazie/", "Косоглазие"),
        ("/miopiya-u-detey-almaty/", "/kk/miopiya-u-detey-almaty/", "Миопия у детей"),
    ],
    "setchatka": [
        ("/vitrektomiya-almaty/", "/kk/vitrektomiya-almaty/", "Витрэктомия"),
        ("/diagnostika-almaty/", "/kk/diagnostika-almaty/", "Диагностика"),
    ],
    "miopiya-u-detey": [
        ("/deti-almaty/", "/kk/deti-almaty/", "Детская офтальмология"),
        ("/kosoglazie/", "/kk/kosoglazie/", "Косоглазие"),
    ],
    "zamena-hrustalika": [
        ("/katarakta-almaty/", "/kk/katarakta-almaty/", "Катаракта"),
        ("/diagnostika-almaty/", "/kk/diagnostika-almaty/", "Диагностика"),
    ],
}

DEFAULT_HUBS = [
    ("/diagnostika-almaty/", "/kk/diagnostika-almaty/", "Диагностика зрения"),
    ("/uslugi/", "/kk/uslugi/", "Все услуги"),
    ("/doctors/", "/kk/doctors/", "Врачи"),
]

GENERIC_FAQ_RU = [
    (
        "Как записаться в AsiaKoz?",
        "Напишите в WhatsApp филиала {city} — без формы на сайте. Укажите жалобу и удобное время.",
    ),
    (
        "Сколько длится первичный приём?",
        "Зависит от объёма диагностики. Базовый осмотр быстрее, расширенное обследование — дольше.",
    ),
    (
        "Нужно ли направление?",
        "Нет. Можно обратиться напрямую в клинику AsiaKoz в {city}.",
    ),
]

GENERIC_FAQ_KK = [
    (
        "AsiaKoz-қа қалай жазылуға болады?",
        "{city} филиалының WhatsApp-ына жазыңыз — сайтта форма жоқ.",
    ),
    (
        "Алғашқы қабылдау қанша уақыт?",
        "Диагностика көлеміне байланысты.",
    ),
    (
        "Жолдама керек пе?",
        "Жоқ. {city} филиалына тікелей келуге болады.",
    ),
]


def _kk_label(ru_label: str) -> str:
    m = {
        "Лазерная коррекция": "Лазерлік түзету",
        "Диагностика зрения": "Көру диагностикасы",
        "Диагностика": "Диагностика",
        "Имплантация ICL": "ICL имплантациясы",
        "Замена хрусталика": "Хрусталик алмастыру",
        "Операция при глаукоме": "Глаукома операциясы",
        "Болезни сетчатки": "Тор қабық аурулары",
        "Детская офтальмология": "Балалар офтальмологиясы",
        "Косоглазие": "Қылилық",
        "Миопия у детей": "Балалардағы миопия",
        "Катаракта": "Катаракта",
        "Все услуги": "Барлық қызметтер",
        "Врачи": "Дәрігерлер",
    }
    return m.get(ru_label, ru_label)


def enrich_copy(copy: dict[str, Any], dx_id: str, lang: str) -> dict[str, Any]:
    """Add extended SEO sections when not explicitly provided."""
    out = dict(copy)
    name = copy.get("name", "")

    if "symptoms" not in out:
        if lang == "kk":
            out["symptoms"] = [
                "көрудің бұзылуы немесе тұрақсыздығы",
                "көздің шаршауы, қызару немесе құрғақтық",
                "жыпылық, ұшқын немесе «ұшқындар»",
                "бір көзбен қосарланған көру",
                "жарыққа сезімталдық",
            ]
        else:
            out["symptoms"] = [
                f"снижение или изменение зрения при {name.lower()}" if name else "снижение или изменение зрения",
                "усталость, резь, покраснение или сухость глаз",
                "вспышки, мушки или «пыль» перед глазом",
                "двоение изображения одним глазом",
                "повышенная чувствительность к свету",
            ]

    if "when" not in out:
        if lang == "kk":
            out["when"] = (
                "Көз дәрігеріне жүгіну керек, егер белгілер 2–3 күннен астам сақталса, "
                "көру кенет нашарласа немесе бір көздегі өзгеріс ерекше болса. "
                "{city} филиалында шұғыл тексеру қажеттілігін WhatsApp арқылы нақтылаймыз."
            )
        else:
            out["when"] = (
                "Обратиться к офтальмологу стоит, если симптомы сохраняются более 2–3 дней, "
                "зрение ухудшается быстро или изменения заметны в одном глазу. "
                "В филиале {city} уточним срочность осмотра через WhatsApp."
            )

    if "methods" not in out:
        out["methods"] = list(copy.get("facts", []))[:4]

    if "why" not in out:
        if lang == "kk":
            out["why"] = [
                ("Түрік хирургтер", "AsiaKoz желісінде тәжірибелі офтальмохирургтер жұмыс істейді."),
                ("Диагностика алдымен", "Емдеу жоспары тексеруден кейін — қысымсыз."),
                ("Түсінікті маршрут", "Көрсеткіш болмаса операция ұсынбаймыз."),
                ("{city} филиалы", "Мекенжай, WhatsApp және дәрігерлер бір бетте."),
            ]
        else:
            out["why"] = [
                ("Турецкие хирурги", "В сети AsiaKoz работают опытные офтальмохирурги."),
                ("Сначала диагностика", "План лечения — после обследования, без давления."),
                ("Понятный маршрут", "Операцию предлагаем только по показаниям."),
                ("Филиал в {city}", "Адрес, WhatsApp и врачи — на одной странице."),
            ]

    if "what" not in out:
        if lang == "kk":
            out["what"] = (
                f"{name} — көз ауруы/жағдайы, оны тек тексеруден кейін диагноз қойылады. "
                "Интернеттегі жалпы сипаттама нақты емдеу әдісін ауыстырмайды."
            )
        else:
            out["what"] = (
                f"{name} — состояние глаза, диагноз которого ставят только после осмотра. "
                "Общее описание в интернете не заменяет индивидуальный план лечения."
            )

    faq = list(out.get("faq", []))
    generic = GENERIC_FAQ_KK if lang == "kk" else GENERIC_FAQ_RU
    seen = {q for q, _ in faq}
    for q, a in generic:
        if q not in seen and len(faq) < 8:
            faq.append((q, a))
            seen.add(q)
    out["faq"] = faq

    hubs = RELATED_HUBS.get(dx_id, DEFAULT_HUBS)
    out["hubs"] = hubs

    if "prices" not in out and dx_id in {
        "katarakta",
        "glaukoma",
        "vitrektomiya",
        "kosoglazie",
        "diagnostika",
        "deti",
        "zamena-hrustalika",
        "vtorichnaya-katarakta",
        "operatsiya-glaukoma",
        "lazer",
        "peresadka-rogovitsy",
    }:
        if lang == "kk":
            out["prices"] = [
                {
                    "label": "Диагностика",
                    "title": "Көзді тексеру және дәрігер қабылдауы",
                    "value": "20 000 ₸-дан",
                    "text": "Нақты зерттеулер тізімі көрсеткіш бойынша.",
                },
            ]
        else:
            out["prices"] = [
                {
                    "label": "Диагностика",
                    "title": "Осмотр и диагностика зрения",
                    "value": "от 20 000 ₸",
                    "text": "Точный перечень исследований — по показаниям врача.",
                },
            ]
        if dx_id == "katarakta":
            out["prices"].append(
                {
                    "label": "Операция",
                    "title": "Операция катаракты (ФЭК + ИОЛ)" if lang == "ru" else "Катаракта операциясы (ФЭК + ИОЛ)",
                    "value": "350 000–1 200 000 ₸" if lang == "ru" else "350 000–1 200 000 ₸",
                    "text": (
                        "Зависит от типа ИОЛ и клинической ситуации."
                        if lang == "ru"
                        else "ИОЛ түрі мен клиникалық жағдайға байланысты."
                    ),
                }
            )

    return out


def symptoms_html(symptoms: list[str], lang: str) -> str:
    title = "Негізгі белгілер" if lang == "kk" else "Основные симптомы"
    note = (
        "Бұл белгілер басқа көз ауруларында да болуы мүмкін. Диагноз — тек дәрігер тексеруінен кейін."
        if lang == "kk"
        else "Эти симптомы могут встречаться и при других заболеваниях. Точный диагноз — после осмотра врача."
    )
    items = "".join(f"<li>{s}</li>" for s in symptoms)
    return f"""    <section class="section" id="symptoms">
      <h2 class="section-title">{title}</h2>
      <ul class="symptom-grid">{items}</ul>
      <p class="section-note">{note}</p>
    </section>"""


def what_html(text: str, name: str, lang: str) -> str:
    title = f"{name} деген не" if lang == "kk" else f"Что такое {name.lower()}"
    return f"""    <section class="section" id="what">
      <h2 class="section-title">{title}</h2>
      <p>{text}</p>
    </section>"""


def when_html(text: str, lang: str) -> str:
    title = "Қашан дәрігерге жүгіну керек" if lang == "kk" else "Когда обратиться к врачу"
    return f"""    <section class="section" id="when">
      <h2 class="section-title">{title}</h2>
      <p>{text}</p>
    </section>"""


def methods_html(methods: list[tuple[str, str]], lang: str, fmt) -> str:
    title = "Емдеу әдістері" if lang == "kk" else "Методы лечения"
    sub = (
        "Таңдалған әдіс тексеру нәтижесіне байланысты — барлық опция бәріне көрсетілмейді."
        if lang == "kk"
        else "Метод выбирается по результатам обследования — не все варианты показаны каждому пациенту."
    )
    cards = "".join(
        f"""        <article class="card">
          <h3 class="card-title">{fmt(t)}</h3>
          <p class="card-text">{fmt(p)}</p>
        </article>"""
        for t, p in methods
    )
    return f"""    <section class="section" id="methods">
      <h2 class="section-title">{title}</h2>
      <p class="section-subtitle">{sub}</p>
      <div class="why-grid">{cards}</div>
    </section>"""


def why_html(items: list[tuple[str, str]], lang: str, fmt) -> str:
    title = "Неге AsiaKoz" if lang == "kk" else "Почему AsiaKoz"
    cards = "".join(
        f"""        <article class="card">
          <h3 class="card-title">{fmt(t)}</h3>
          <p class="card-text">{fmt(p)}</p>
        </article>"""
        for t, p in items
    )
    return f"""    <section class="section" id="why">
      <h2 class="section-title">{title}</h2>
      <div class="why-grid">{cards}</div>
    </section>"""


def hubs_html(hubs: list[tuple[str, str, str]], lang: str) -> str:
    title = "Байланысты қызметтер" if lang == "kk" else "Связанные услуги"
    links = []
    for ru_href, kk_href, ru_label in hubs:
        href = kk_href if lang == "kk" else ru_href
        label = _kk_label(ru_label) if lang == "kk" else ru_label
        links.append(f'<a class="link" href="{href}">{label}</a>')
    return f"""    <section class="section" id="related-services">
      <h2 class="section-title">{title}</h2>
      <p>{' · '.join(links)}</p>
    </section>"""


def prices_html(prices: list[dict[str, str]], lang: str, wa: str, topic: str) -> str:
    if not prices:
        return ""
    title = "Бағалар" if lang == "kk" else "Стоимость"
    sub = (
        "Баға ориентирлік. Нақты сома диагностикадан кейін."
        if lang == "kk"
        else "Цены ориентировочные. Точная сумма — после диагностики."
    )
    note = (
        "Көрсетілген баға жария оферта емес."
        if lang == "kk"
        else "Указанная стоимость не является публичной офертой."
    )
    cards = []
    for i, p in enumerate(prices):
        accent = " price-card--accent" if i == len(prices) - 1 and len(prices) > 1 else ""
        cards.append(
            f"""        <article class="price-card{accent}">
          <p class="price-card__label">{p.get('label', '')}</p>
          <h3 class="price-card__title">{p.get('title', '')}</h3>
          <p class="price-card__value">{p.get('value', '')}</p>
          <p class="price-card__text">{p.get('text', '')}</p>
        </article>"""
        )
    cta_label = "WhatsApp-қа жазу" if lang == "kk" else "Записаться в WhatsApp"
    import urllib.parse

    wa_link = f"https://wa.me/{wa}?text=" + urllib.parse.quote(
        f"{'Сәлеметсіз бе!' if lang == 'kk' else 'Здравствуйте!'} {topic}"
    )
    return f"""    <section class="section" id="price">
      <h2 class="section-title">{title}</h2>
      <p class="section-subtitle">{sub}</p>
      <div class="price-grid">{''.join(cards)}</div>
      <p class="price-note">{note}</p>
      <p style="margin-top:12px"><a class="btn" href="{wa_link}" target="_blank" rel="noopener">{cta_label}</a></p>
    </section>"""


def med_trust_html(lang: str) -> str:
    if lang == "kk":
        return """    <section class="med-trust">
      <p><b>Медициналық ескерту:</b> Сайттағы ақпарат таныстыру үшін. Диагноз және емдеу жоспарын тек дәрігер белгілейді.</p>
      <p>Қарсы көрсеткіштер бар. Маман кеңесін алмай операцияға жазылмаңыз.</p>
    </section>"""
    return """    <section class="med-trust">
      <p><b>Медицинское уведомление:</b> Информация на сайте носит ознакомительный характер. Диагноз и план лечения определяет только врач.</p>
      <p>Имеются противопоказания. Не записывайтесь на операцию без консультации специалиста.</p>
    </section>"""


def extended_body_html(
    copy: dict[str, Any],
    lang: str,
    fmt,
    city: dict,
    dx_id: str,
) -> str:
    enriched = enrich_copy(copy, dx_id, lang)
    parts = [
        what_html(fmt(enriched["what"]), enriched["name"], lang),
        symptoms_html([fmt(s) for s in enriched["symptoms"]], lang),
        when_html(fmt(enriched["when"]), lang),
        methods_html(enriched["methods"], lang, fmt),
        prices_html(enriched.get("prices") or [], lang, city["wa"], enriched["name"]),
        why_html(enriched["why"], lang, fmt),
        hubs_html(enriched["hubs"], lang),
        med_trust_html(lang),
    ]
    return "\n".join(parts)
