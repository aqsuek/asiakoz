#!/usr/bin/env python3
"""Static comparison page: ReLEx SMILE vs LASIK vs PRK (RU + KK), with prices.

Facts confirmed by the clinic (28.11.2026):
- Almaty and Aktau do ReLEx SMILE only; Shymkent does LASIK and PRK only.
- SMILE 650 000 ₸ both eyes (Almaty promo 1–25 Dec 2026: 600 000 ₸).
- LASIK from 300 000 ₸, PRK from 200 000 ₸, both eyes, depends on the eyes.
Run by build-seo.py; edit prices here, not in the HTML.
"""

from __future__ import annotations

import html
import importlib.util
import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://asiakoz.com"
SLUG = "smile-lasik-prk"
TODAY = date.today().isoformat()

_spec = importlib.util.spec_from_file_location("news", ROOT / "scripts" / "render-news-pages.py")
_news = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_news)

COPY = {
    "ru": {
        "title": "SMILE, LASIK или PRK — что выбрать и сколько стоит",
        "desc": "Сравнение лазерной коррекции зрения ReLEx SMILE, LASIK и PRK: как делают, восстановление, кому подходит, цены в AsiaKoz. SMILE — Алматы и Актау, LASIK и PRK — Шымкент.",
        "h1": "SMILE, LASIK или PRK: какую лазерную коррекцию выбрать",
        "lead": "Все три метода исправляют близорукость и астигматизм лазером, но по-разному работают с роговицей. Итоговый метод выбирает врач после диагностики: толщина и форма роговицы важнее рекламы. Ниже — короткое сравнение и цены в клиниках AsiaKoz.",
        "updated": "Обновлено",
        "cols": ["", "ReLEx SMILE", "LASIK", "PRK"],
        "rows": [
            ("Как делают", "Лазер формирует внутри роговицы тонкую линзу и удаляет её через микроразрез 2–4 мм. Лоскута нет.", "Формируют лоскут роговицы, лазер меняет её форму под лоскутом, лоскут укладывают обратно.", "Убирают поверхностный слой (эпителий), лазер работает по поверхности роговицы. Лоскута нет."),
            ("Что исправляет", "Близорукость и астигматизм.", "Близорукость, астигматизм, дальнозоркость.", "Близорукость, астигматизм, дальнозоркость."),
            ("Восстановление", "Обычно зрение хорошее уже через 1–2 дня.", "Обычно хорошее зрение на следующий день.", "Дольше: 3–7 дней дискомфорта, зрение стабилизируется за несколько недель."),
            ("Сухость глаз", "Как правило, меньше, чем после LASIK.", "Возможна в первые месяцы.", "Возможна в первые недели."),
            ("Когда особенно уместен", "Активный образ жизни, работа за компьютером, нежелание иметь лоскут.", "Широкий диапазон коррекции при достаточной толщине роговицы.", "Тонкая роговица, контактные виды спорта, когда лоскут нежелателен."),
            ("Где в AsiaKoz", "Алматы и Актау", "Шымкент", "Шымкент"),
            ("Цена за оба глаза", "650 000 ₸ (в Алматы 1–25 декабря — 600 000 ₸)", "от 300 000 ₸", "от 200 000 ₸"),
        ],
        "price_note": "Цены за оба глаза. Точную стоимость LASIK и PRK врач называет после диагностики: она зависит от ваших глаз. Диагностика — от 20 000 ₸.",
        "who_title": "Кому лазерная коррекция не подходит",
        "who": [
            "до 18 лет и пока рефракция меняется;",
            "при кератоконусе и слишком тонкой роговице (тогда обсуждают ICL);",
            "при некоторых болезнях глаз и общих заболеваниях — решает врач;",
            "при беременности и кормлении грудью — коррекцию откладывают.",
        ],
        "faq_title": "Вопросы и ответы",
        "faq": [
            ("Какой метод лучше: SMILE или LASIK?", "Лучшего для всех нет. SMILE не требует лоскута и обычно даёт меньше сухости, LASIK исправляет и дальнозоркость. Что подходит вашим глазам, врач скажет после диагностики."),
            ("Где в AsiaKoz делают SMILE?", "В Алматы и Актау. В Шымкенте SMILE не делают — там LASIK и PRK."),
            ("Сколько стоит лазерная коррекция в AsiaKoz?", "ReLEx SMILE — 650 000 ₸ за оба глаза (в Алматы с 1 по 25 декабря — 600 000 ₸). LASIK — от 300 000 ₸, PRK — от 200 000 ₸ за оба глаза в Шымкенте."),
            ("Можно ли в рассрочку?", "Да, в Алматы на SMILE — рассрочка на 12 месяцев через Kaspi Bank и Halyk Bank. Условия уточняйте в WhatsApp."),
            ("Больно ли делать лазер?", "Операцию делают под каплями-анестетиками, сама процедура занимает несколько минут на глаз. После PRK несколько дней бывает дискомфорт."),
        ],
        "branches_title": "Записаться",
        "branches": [
            ("Алматы — ReLEx SMILE", "/laser/", "пр. Райымбека, 176А", "77003600180"),
            ("Актау — ReLEx SMILE", "/lazer-aktau/", "7А микрорайон, 11/3", "77758630180"),
            ("Шымкент — LASIK и PRK", "/lazer-shymkent/", "ул. Байтурсынова, 86/7, мкр. Туран", "77080750180"),
        ],
        "crumb": ("Главная", "/", "Услуги", "/uslugi/"),
        "disclaimer": "Информация носит справочный характер и не заменяет консультацию врача. Имеются противопоказания.",
    },
    "kk": {
        "title": "SMILE, LASIK әлде PRK — қайсысын таңдау керек, бағасы",
        "desc": "ReLEx SMILE, LASIK және PRK салыстыруы: қалай жасалады, қалпына келу, кімге сай, бағасы. SMILE — Алматы мен Ақтауда, LASIK пен PRK — Шымкентте.",
        "h1": "SMILE, LASIK әлде PRK: қай лазерлік түзетуді таңдау керек",
        "lead": "Үш әдіс те миопия мен астигматизмді лазермен түзетеді, бірақ мөлдір қабықпен әртүрлі жұмыс істейді. Әдісті дәрігер диагностикадан кейін таңдайды: мөлдір қабықтың қалыңдығы мен пішіні жарнамадан маңыздырақ. Төменде — қысқа салыстыру және AsiaKoz клиникаларындағы бағалар.",
        "updated": "Жаңартылды",
        "cols": ["", "ReLEx SMILE", "LASIK", "PRK"],
        "rows": [
            ("Қалай жасалады", "Лазер мөлдір қабықтың ішінде жұқа линза қалыптастырып, оны 2–4 мм шағын тілік арқылы алады. Қақпақша жоқ.", "Мөлдір қабықтан қақпақша жасалады, лазер оның астында пішінді өзгертеді, қақпақша орнына қойылады.", "Беткі қабат (эпителий) алынады, лазер мөлдір қабықтың бетінде жұмыс істейді. Қақпақша жоқ."),
            ("Нені түзетеді", "Миопия және астигматизм.", "Миопия, астигматизм, гиперметропия.", "Миопия, астигматизм, гиперметропия."),
            ("Қалпына келу", "Әдетте 1–2 күнде жақсы көреді.", "Әдетте келесі күні жақсы көреді.", "Ұзағырақ: 3–7 күн жайсыздық, көру бірнеше аптада тұрақталады."),
            ("Көздің құрғауы", "Әдетте LASIK-тен азырақ.", "Алғашқы айларда болуы мүмкін.", "Алғашқы апталарда болуы мүмкін."),
            ("Қашан ыңғайлы", "Белсенді өмір, компьютерде жұмыс, қақпақша болмағанын қалайтындар.", "Мөлдір қабық жеткілікті қалың болғанда түзетудің кең ауқымы.", "Жұқа мөлдір қабық, контактілі спорт, қақпақша қажет емес кезде."),
            ("AsiaKoz-та қайда", "Алматы және Ақтау", "Шымкент", "Шымкент"),
            ("Екі көзге бағасы", "650 000 ₸ (Алматыда 1–25 желтоқсан — 600 000 ₸)", "300 000 ₸-дан", "200 000 ₸-дан"),
        ],
        "price_note": "Бағалар екі көзге. LASIK пен PRK-ның нақты бағасын дәрігер диагностикадан кейін айтады, ол көзіңізге байланысты. Диагностика — 20 000 ₸-дан.",
        "who_title": "Лазерлік түзету кімге болмайды",
        "who": [
            "18 жасқа дейін және рефракция әлі өзгеріп жатқанда;",
            "кератоконус пен тым жұқа мөлдір қабықта (онда ICL қаралады);",
            "кейбір көз және жалпы аурулар кезінде — дәрігер шешеді;",
            "жүктілік пен емізу кезінде — түзету кейінге қалдырылады.",
        ],
        "faq_title": "Сұрақ-жауап",
        "faq": [
            ("Қайсысы жақсы: SMILE әлде LASIK?", "Барлығына бірдей ең жақсы әдіс жоқ. SMILE-да қақпақша жоқ, құрғау әдетте азырақ, LASIK гиперметропияны да түзетеді. Сіздің көзіңізге қайсысы сай келетінін дәрігер диагностикадан кейін айтады."),
            ("AsiaKoz-та SMILE қайда жасалады?", "Алматы мен Ақтауда. Шымкентте SMILE жасалмайды — онда LASIK пен PRK."),
            ("AsiaKoz-та лазерлік түзету қанша тұрады?", "ReLEx SMILE — екі көзге 650 000 ₸ (Алматыда 1–25 желтоқсан — 600 000 ₸). Шымкентте LASIK — 300 000 ₸-дан, PRK — 200 000 ₸-дан, екі көзге."),
            ("Бөліп төлеуге бола ма?", "Иә, Алматыда SMILE-ге Kaspi Bank және Halyk Bank арқылы 12 айға бөліп төлеуге болады. Шарттарын WhatsApp арқылы нақтылаңыз."),
            ("Лазер ауыра ма?", "Ота жансыздандыратын тамшылармен жасалады, процедура бір көзге бірнеше минут алады. PRK-дан кейін бірнеше күн жайсыздық болуы мүмкін."),
        ],
        "branches_title": "Жазылу",
        "branches": [
            ("Алматы — ReLEx SMILE", "/kk/laser/", "Райымбек даңғылы, 176А", "77003600180"),
            ("Ақтау — ReLEx SMILE", "/kk/lazer-aktau/", "7А шағынауданы, 11/3", "77758630180"),
            ("Шымкент — LASIK және PRK", "/kk/lazer-shymkent/", "Байтұрсынов көшесі, 86/7, Тұран", "77080750180"),
        ],
        "crumb": ("Басты бет", "/kk/", "Қызметтер", "/kk/uslugi/"),
        "disclaimer": "Ақпарат анықтамалық сипатта, дәрігер кеңесін алмастырмайды. Қарсы көрсеткіштер бар.",
    },
}


def render(lang: str) -> str:
    c = COPY[lang]
    e = html.escape
    ru_url = f"{SITE}/{SLUG}/"
    kk_url = f"{SITE}/kk/{SLUG}/"
    canonical = kk_url if lang == "kk" else ru_url
    head_cells = "".join(f'<th style="padding:10px 8px;text-align:left;">{e(h)}</th>' for h in c["cols"])
    rows = "".join(
        "<tr style=\"border-top:1px solid rgba(15,23,42,.08);\">"
        + f'<th scope="row" style="padding:10px 8px;text-align:left;vertical-align:top;">{e(r[0])}</th>'
        + "".join(f'<td style="padding:10px 8px;vertical-align:top;">{e(x)}</td>' for x in r[1:])
        + "</tr>"
        for r in c["rows"]
    )
    who = "".join(f"<li>{e(x)}</li>" for x in c["who"])
    faq = "".join(f"<details><summary>{e(q)}</summary><p>{e(a)}</p></details>" for q, a in c["faq"])
    branches = "".join(
        f'<article class="card"><h3 class="card-title"><a class="link" href="{href}">{e(name)}</a></h3>'
        f'<p class="card-text">{e(addr)} · <a class="link" href="https://wa.me/{wa}" target="_blank" rel="noopener">WhatsApp</a></p></article>'
        for name, href, addr, wa in c["branches"]
    )
    h, hh, u, uh = c["crumb"]
    crumb = f'<nav class="breadcrumb"><a href="{hh}">{e(h)}</a> / <a href="{uh}">{e(u)}</a> / {e(c["h1"])}</nav>'
    body = f"""    <article class="section">
      <h1 class="section-title">{e(c["h1"])}</h1>
      <p style="font-size:13px;color:var(--text-muted);">{c["updated"]}: <time datetime="{TODAY}">{TODAY}</time></p>
      <p>{e(c["lead"])}</p>
      <div style="overflow-x:auto;margin:20px 0;">
        <table style="width:100%;min-width:640px;border-collapse:collapse;font-size:14px;">
          <thead><tr>{head_cells}</tr></thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
      <p class="section-note">{e(c["price_note"])}</p>
    </article>
    <section class="section">
      <h2 class="section-title">{e(c["who_title"])}</h2>
      <ul>{who}</ul>
    </section>
    <section class="section" id="faq">
      <h2 class="section-title">{e(c["faq_title"])}</h2>
      <div class="faq">{faq}</div>
    </section>
    <section class="section">
      <h2 class="section-title">{e(c["branches_title"])}</h2>
      <div class="cards-grid">{branches}</div>
      <p class="section-note">{e(c["disclaimer"])}</p>
    </section>"""
    ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "MedicalWebPage",
                "@id": f"{canonical}#webpage",
                "url": canonical,
                "name": c["title"],
                "description": c["desc"],
                "inLanguage": "kk-KZ" if lang == "kk" else "ru-KZ",
                "dateModified": TODAY,
                "about": [
                    {"@type": "MedicalProcedure", "name": "ReLEx SMILE"},
                    {"@type": "MedicalProcedure", "name": "LASIK"},
                    {"@type": "MedicalProcedure", "name": "PRK"},
                ],
                "publisher": {"@id": f"{SITE}/#organization"},
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
                    for q, a in c["faq"]
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
        lang_switch=_news.lang_switch_block(lang, f"/{SLUG}/", f"/kk/{SLUG}/"),
        extra_head=f'  <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>',
    )


def main() -> None:
    for lang, path in (("ru", ROOT / SLUG / "index.html"), ("kk", ROOT / "kk" / SLUG / "index.html")):
        path.parent.mkdir(parents=True, exist_ok=True)
        marker = "<!-- kk-generated -->" if lang == "kk" else "<!-- compare-generated -->"
        path.write_text(render(lang) + f"\n{marker}\n", encoding="utf-8")
        print(f"write: {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
