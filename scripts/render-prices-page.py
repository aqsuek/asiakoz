#!/usr/bin/env python3
"""Price list page /prices/ (RU) and /kk/prices/ (KK). Run by build-seo.py.

Prices confirmed by the clinic on 28.11.2026. Edit them here, not in the HTML.
"""

from __future__ import annotations

import html
import importlib.util
import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://asiakoz.com"
TODAY = date.today().isoformat()

_spec = importlib.util.spec_from_file_location("news", ROOT / "scripts" / "render-news-pages.py")
_news = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_news)

# (group, service, price, where, note, link) — RU and KK side by side.
ROWS = [
    {
        "ru": ("Приём и диагностика", "Приём турецкого офтальмолога + полная диагностика", "20 000 ₸", "Алматы, Актау, Шымкент", "Входит: диагностика, приём врача, услуги переводчика", "/diagnostika-almaty/"),
        "kk": ("Қабылдау және диагностика", "Түрік офтальмологының қабылдауы + толық диагностика", "20 000 ₸", "Алматы, Ақтау, Шымкент", "Ішінде: диагностика, дәрігер қабылдауы, аудармашы қызметі", "/kk/diagnostika-almaty/"),
        "price": 20000,
    },
    {
        "ru": ("Приём и диагностика", "Детский приём у турецкого офтальмолога", "20 000 ₸", "Алматы, Актау, Шымкент", "Как у взрослых: диагностика, приём, переводчик", "/deti-almaty/"),
        "kk": ("Қабылдау және диагностика", "Түрік офтальмологының балалар қабылдауы", "20 000 ₸", "Алматы, Ақтау, Шымкент", "Ересектердегідей: диагностика, қабылдау, аудармашы", "/kk/deti-almaty/"),
        "price": 20000,
    },
    {
        "ru": ("Приём и диагностика", "Приём казахстанского офтальмолога", "10 000–15 000 ₸", "Алматы, Актау, Шымкент", "Зависит от врача", "/doctors/"),
        "kk": ("Қабылдау және диагностика", "Қазақстандық офтальмолог қабылдауы", "10 000–15 000 ₸", "Алматы, Ақтау, Шымкент", "Дәрігерге байланысты", "/kk/doctors/"),
        "price": 10000,
    },
    {
        "ru": ("Катаракта", "Операция катаракты (факоэмульсификация + ИОЛ)", "от 450 000 ₸", "Алматы, Актау, Шымкент", "Зависит от линзы: монофокальная, торическая, мультифокальная, трифокальная (Alcon, Rayner)", "/katarakta-almaty/"),
        "kk": ("Катаракта", "Катаракта операциясы (факоэмульсификация + ИОЛ)", "450 000 ₸-дан", "Алматы, Ақтау, Шымкент", "Линзаға байланысты: монофокалды, торикалық, мультифокалды, трифокалды (Alcon, Rayner)", "/kk/katarakta-almaty/"),
        "price": 450000,
    },
    {
        "ru": ("Лазерная коррекция", "ReLEx SMILE, оба глаза", "650 000 ₸", "Алматы, Актау", "В Алматы 1–25 декабря 2026 — 600 000 ₸ (анализы, приём врача и терапевта включены)", "/laser/"),
        "kk": ("Лазерлік түзету", "ReLEx SMILE, екі көзге", "650 000 ₸", "Алматы, Ақтау", "Алматыда 1–25 желтоқсан 2026 — 600 000 ₸ (анализдер, дәрігер мен терапевт қабылдауы кіреді)", "/kk/laser/"),
        "price": 650000,
    },
    {
        "ru": ("Лазерная коррекция", "LASIK, оба глаза", "от 300 000 ₸", "Шымкент", "Точная цена — после диагностики", "/lazer-shymkent/"),
        "kk": ("Лазерлік түзету", "LASIK, екі көзге", "300 000 ₸-дан", "Шымкент", "Нақты баға диагностикадан кейін", "/kk/lazer-shymkent/"),
        "price": 300000,
    },
    {
        "ru": ("Лазерная коррекция", "PRK, оба глаза", "от 200 000 ₸", "Шымкент", "Точная цена — после диагностики", "/lazer-shymkent/"),
        "kk": ("Лазерлік түзету", "PRK, екі көзге", "200 000 ₸-дан", "Шымкент", "Нақты баға диагностикадан кейін", "/kk/lazer-shymkent/"),
        "price": 200000,
    },
    {
        "ru": ("Хирургия", "Операция при глаукоме", "от 500 000 ₸", "Алматы, Актау, Шымкент", "Зависит от стадии и вида операции", "/operatsiya-glaukoma-almaty/"),
        "kk": ("Хирургия", "Глаукома операциясы", "500 000 ₸-дан", "Алматы, Ақтау, Шымкент", "Сатысына және ота түріне байланысты", "/kk/operatsiya-glaukoma-almaty/"),
        "price": 500000,
    },
    {
        "ru": ("Хирургия", "Операция при косоглазии (дети и взрослые)", "от 600 000 ₸", "Алматы, Актау, Шымкент", "Зависит от сложности", "/operatsiya-kosoglazie-almaty/"),
        "kk": ("Хирургия", "Қылилық операциясы (балалар мен ересектер)", "600 000 ₸-дан", "Алматы, Ақтау, Шымкент", "Күрделілігіне байланысты", "/kk/kosoglazie/"),
        "price": 600000,
    },
    {
        "ru": ("Хирургия", "Витрэктомия (операция на сетчатке)", "от 1 000 000 ₸", "Алматы, Актау, Шымкент", "Отслойка сетчатки, гемофтальм, макулярный разрыв", "/vitrektomiya-almaty/"),
        "kk": ("Хирургия", "Витрэктомия (тор қабық операциясы)", "1 000 000 ₸-дан", "Алматы, Ақтау, Шымкент", "Тор қабықтың ажырауы, гемофтальм, макула жыртылуы", "/kk/vitrektomiya-almaty/"),
        "price": 1000000,
    },
]

COPY = {
    "ru": {
        "title": "Цены глазной клиники AsiaKoz: приём, катаракта, лазер",
        "desc": "Цены AsiaKoz: приём турецкого офтальмолога с диагностикой — 20 000 ₸, катаракта от 450 000 ₸, SMILE 650 000 ₸, LASIK от 300 000 ₸, косоглазие от 600 000 ₸.",
        "h1": "Цены на приём и операции в AsiaKoz",
        "lead": "Цены одинаковые в Алматы, Актау и Шымкенте, если не указано иное. Точную стоимость операции врач называет после диагностики: она зависит от ваших глаз, линзы и сложности.",
        "updated": "Обновлено",
        "cols": ("Услуга", "Цена", "Где", "Что важно знать"),
        "hours_title": "Часы работы",
        "hours": "Все три филиала: понедельник–пятница 9:00–17:00, суббота 9:00–14:00, воскресенье — выходной.",
        "faq_title": "Вопросы о ценах",
        "faq": [
            ("Что входит в приём за 20 000 ₸?", "Полная диагностика зрения, приём турецкого офтальмолога и услуги переводчика. Детский приём у турецкого врача стоит так же."),
            ("Сколько стоит операция катаракты?", "От 450 000 ₸. Цена зависит от искусственного хрусталика: монофокальный, торический, мультифокальный или трифокальный (Alcon, Rayner)."),
            ("Где делают SMILE, а где LASIK и PRK?", "ReLEx SMILE — в Алматы и Актау (650 000 ₸ за оба глаза). LASIK (от 300 000 ₸) и PRK (от 200 000 ₸) — в Шымкенте."),
            ("Есть ли рассрочка?", "На SMILE в Алматы — рассрочка на 12 месяцев через Kaspi Bank и Halyk Bank. Условия уточняйте в WhatsApp."),
        ],
        "crumb": ("Главная", "/", "Цены"),
        "note": "Информация на сайте не является публичной офертой. Имеются противопоказания, необходима консультация специалиста.",
    },
    "kk": {
        "title": "AsiaKoz көз клиникасының бағалары — қабылдау, катаракта, лазер",
        "desc": "AsiaKoz бағалары: түрік офтальмологының қабылдауы мен диагностика — 20 000 ₸, катаракта 450 000 ₸-дан, SMILE 650 000 ₸, LASIK 300 000 ₸-дан, қылилық 600 000 ₸-дан.",
        "h1": "AsiaKoz-тағы қабылдау мен ота бағалары",
        "lead": "Бағалар Алматы, Ақтау және Шымкентте бірдей, басқасы көрсетілмесе. Отаның нақты бағасын дәрігер диагностикадан кейін айтады: ол көзіңізге, линзаға және күрделілігіне байланысты.",
        "updated": "Жаңартылды",
        "cols": ("Қызмет", "Бағасы", "Қайда", "Білу керек"),
        "hours_title": "Жұмыс уақыты",
        "hours": "Үш филиал да: дүйсенбі–жұма 9:00–17:00, сенбі 9:00–14:00, жексенбі — демалыс.",
        "faq_title": "Бағалар туралы сұрақтар",
        "faq": [
            ("20 000 ₸ қабылдауға не кіреді?", "Көрудің толық диагностикасы, түрік офтальмологының қабылдауы және аудармашы қызметі. Түрік дәрігерінің балалар қабылдауы да осы баға."),
            ("Катаракта операциясы қанша тұрады?", "450 000 ₸-дан басталады. Баға жасанды хрусталикке байланысты: монофокалды, торикалық, мультифокалды немесе трифокалды (Alcon, Rayner)."),
            ("SMILE қайда, LASIK пен PRK қайда жасалады?", "ReLEx SMILE — Алматы мен Ақтауда (екі көзге 650 000 ₸). LASIK (300 000 ₸-дан) мен PRK (200 000 ₸-дан) — Шымкентте."),
            ("Бөліп төлеуге бола ма?", "Алматыда SMILE-ге Kaspi Bank және Halyk Bank арқылы 12 айға бөліп төлеуге болады. Шарттарын WhatsApp арқылы нақтылаңыз."),
        ],
        "crumb": ("Басты бет", "/kk/", "Бағалар"),
        "note": "Сайттағы ақпарат жария оферта емес. Қарсы көрсеткіштер бар, маман кеңесі қажет.",
    },
}


def render(lang: str) -> str:
    c = COPY[lang]
    e = html.escape
    ru_url, kk_url = f"{SITE}/prices/", f"{SITE}/kk/prices/"
    canonical = kk_url if lang == "kk" else ru_url
    groups: dict[str, list[str]] = {}
    for r in ROWS:
        g, svc, price, where, note, link = r[lang]
        groups.setdefault(g, []).append(
            f'<tr style="border-top:1px solid rgba(15,23,42,.08);"><td data-label="{e(c["cols"][0])}" style="padding:10px 8px;"><a class="rtable-name" href="{link}">{e(svc)}</a></td>'
            f'<td data-label="{e(c["cols"][1])}" style="padding:10px 8px;white-space:nowrap;"><b>{e(price)}</b></td><td data-label="{e(c["cols"][2])}" style="padding:10px 8px;">{e(where)}</td>'
            f'<td data-label="{e(c["cols"][3])}" style="padding:10px 8px;font-size:13px;color:var(--text-muted);">{e(note)}</td></tr>'
        )
    head = "".join(f'<th style="padding:10px 8px;text-align:left;">{e(x)}</th>' for x in c["cols"])
    tables = "".join(
        f'<h2 class="section-title" style="margin-top:28px;">{e(g)}</h2><div style="overflow-x:auto;"><table class="rtable" style="width:100%;border-collapse:collapse;font-size:14px;"><thead><tr>{head}</tr></thead><tbody>{"".join(rows)}</tbody></table></div>'
        for g, rows in groups.items()
    )
    faq = "".join(f"<details><summary>{e(q)}</summary><p>{e(a)}</p></details>" for q, a in c["faq"])
    h, hh, cur = c["crumb"]
    crumb = f'<nav class="breadcrumb"><a href="{hh}">{e(h)}</a> / {e(cur)}</nav>'
    body = f"""    <article class="section">
      <h1 class="section-title">{e(c["h1"])}</h1>
      <p style="font-size:13px;color:var(--text-muted);">{c["updated"]}: <time datetime="{TODAY}">{TODAY}</time></p>
      <p>{e(c["lead"])}</p>
      {tables}
    </article>
    <section class="section">
      <h2 class="section-title">{e(c["hours_title"])}</h2>
      <p>{e(c["hours"])}</p>
    </section>
    <section class="section" id="faq">
      <h2 class="section-title">{e(c["faq_title"])}</h2>
      <div class="faq">{faq}</div>
      <p class="section-note">{e(c["note"])}</p>
    </section>"""
    offers = []
    for r in ROWS:
        _, svc, _, _, _, link = r[lang]
        offers.append({
            "@type": "Offer",
            "itemOffered": {"@type": "MedicalProcedure", "name": svc},
            "priceSpecification": {"@type": "PriceSpecification", "price": r["price"], "priceCurrency": "KZT", "minPrice": r["price"]},
            "url": f"{SITE}{link}",
        })
    ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": f"{canonical}#webpage",
                "url": canonical,
                "name": c["title"],
                "description": c["desc"],
                "inLanguage": "kk-KZ" if lang == "kk" else "ru-KZ",
                "dateModified": TODAY,
                "publisher": {"@id": f"{SITE}/#organization"},
            },
            {"@type": "OfferCatalog", "name": c["h1"], "itemListElement": offers},
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in c["faq"]
                ],
            },
        ],
    }
    return _news.shell(
        lang=lang,
        title=c["title"],
        desc=c["desc"],
        canonical=canonical,
        ru_url=ru_url,
        kk_url=kk_url,
        breadcrumb=crumb,
        body=body,
        lang_switch=_news.lang_switch_block(lang, "/prices/", "/kk/prices/"),
        extra_head=f'  <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>',
    )


def main() -> None:
    for lang, path in (("ru", ROOT / "prices" / "index.html"), ("kk", ROOT / "kk" / "prices" / "index.html")):
        path.parent.mkdir(parents=True, exist_ok=True)
        marker = "<!-- kk-generated -->" if lang == "kk" else "<!-- prices-generated -->"
        path.write_text(render(lang) + f"\n{marker}\n", encoding="utf-8")
        print(f"write: {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
