#!/usr/bin/env python3
"""Render handcrafted setchatka-almaty hub pages (RU + KK) from vitrektomiya template."""

from __future__ import annotations

import importlib.util
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS))
SITE = "https://asiakoz.com"

RU_REPLACEMENTS: list = [
    ("https://asiakoz.com/vitrektomiya-almaty/", f"{SITE}/setchatka-almaty/"),
    ('href="/vitrektomiya-almaty/" class="is-active"', 'href="/setchatka-almaty/" class="is-active"'),
    (
        "<title>Витрэктомия в Алматы — цена операции | asiakoz</title>",
        "<title>Сетчатка в Алматы — ОКТ, лазер, инъекции, витрэктомия | asiakoz</title>",
    ),
    (
        'content="Витрэктомия в Алматы при отслойке сетчатки, гемофтальме, диабетической ретинопатии и макулярном разрыве. Диагностика и приём витреоретинолога — 20 000 ₸. Операция — ориентировочно 1–1,6 млн ₸."',
        'content="Лечение сетчатки в Алматы: ОКТ, лазерная коагуляция, инъекции, витрэктомия. Диагностика и приём витреоретинолога — 20 000 ₸. Asiakoz, проспект Райымбека, 176а."',
    ),
    (
        '<meta property="og:title" content="Витрэктомия в Алматы — цена операции | asiakoz" />',
        '<meta property="og:title" content="Сетчатка в Алматы — ОКТ, лазер, инъекции | asiakoz" />',
    ),
    (
        '<meta name="twitter:title" content="Витрэктомия в Алматы — цена операции | asiakoz" />',
        '<meta name="twitter:title" content="Сетчатка в Алматы — ОКТ, лазер, инъекции | asiakoz" />',
    ),
    (
        re.compile(r'\s*<nav class="city-switch" aria-label="Филиал">.*?</nav>', re.DOTALL),
        "",
    ),
    ("vitrektomiya-hero", "setchatka-hero"),
    ("vitrektomiya-hero__", "setchatka-hero__"),
    (
        "<h1>Витрэктомия в Алматы: операция на сетчатке глаза</h1>",
        "<h1>Лечение сетчатки в Алматы: диагностика, лазер, инъекции и хирургия</h1>",
    ),
    (
        """        <p>
          Витрэктомия — микрохирургическая операция на стекловидном теле и сетчатке глаза.
          В клинике Asiakoz в Алматы операция проводится при отслойке сетчатки, гемофтальме,
          диабетической ретинопатии, макулярном разрыве и других патологиях.
          Тактику лечения определяет витреоретинальный хирург после полной диагностики.
        </p>""",
        """        <p>
          Сетчатка — светочувствительная ткань на глазном дне. В клинике Asiakoz в Алматы диагностируем и лечим
          разрывы и отслойки, диабетическую ретинопатию, макулярные патологии, гемофтальм и другие заболевания.
          Тактика — наблюдение, лазерная коагуляция, интравитреальные инъекции или
          <a class="link" href="/vitrektomiya-almaty/">витрэктомия</a> — только после ОКТ и осмотра витреоретинолога.
        </p>""",
    ),
    (
        """        <div class="hero-facts" aria-label="Ключевые факты">
          <div class="hero-fact"><b>20 000 ₸</b><span>Полная диагностика и приём витреоретинолога</span></div>
          <div class="hero-fact"><b>1 000 000–1 600 000 ₸</b><span>Ориентировочная стоимость операции</span></div>
          <div class="hero-fact"><b>После диагностики</b><span>Точная стоимость и объём вмешательства</span></div>
        </div>""",
        """        <div class="hero-facts hero-facts--4" aria-label="Ключевые факты">
          <div class="hero-fact"><b>20 000 ₸</b><span>Полная диагностика и приём витреоретинолога</span></div>
          <div class="hero-fact"><b>ОКТ + осмотр дна</b><span>Оценка макулы и периферии сетчатки</span></div>
          <div class="hero-fact"><b>Лазер / инъекции</b><span>По показаниям после диагностики</span></div>
          <div class="hero-fact"><b>1–1,6 млн ₸</b><span>Ориентир витрэктомии при показаниях</span></div>
        </div>""",
    ),
    (
        '<a href="/">Главная</a> / <a href="/uslugi/">Услуги</a> / <a href="/setchatka-almaty/">Сетчатка</a> / Витрэктомия в Алматы',
        '<a href="/">Главная</a> / <a href="/uslugi/">Услуги</a> / Сетчатка в Алматы',
    ),
    (
        "%D0%BF%D0%BE%20%D0%B2%D0%B8%D1%82%D1%80%D1%8D%D0%BA%D1%82%D0%BE%D0%BC%D0%B8%D0%B8%20%D0%B2%20%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B",
        "%D0%BF%D0%BE%20%D1%81%D0%B5%D1%82%D1%87%D0%B0%D1%82%D0%BA%D0%B5%20%D0%B2%20%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B",
    ),
    (
        'alt="Схема глаза: стекловидное тело и сетчатка — визуализация витрэктомии в Asiakoz Алматы"',
        'alt="Схема глаза и сетчатки — лечение заболеваний сетчатки в Asiakoz Алматы"',
    ),
    (
        "<h2 class=\"section-title\">Стоимость диагностики и витрэктомии</h2>",
        "<h2 class=\"section-title\">Стоимость диагностики и лечения сетчатки</h2>",
    ),
    (
        "Ориентировочная стоимость витрэктомии — 1 000 000–1 600 000 ₸.\n        Точная стоимость определяется после полной диагностики и консультации витреоретинолога.",
        "Диагностика — от 20 000 ₸. Лазер и инъекции — после осмотра. Витрэктомия — ориентир 1 000 000–1 600 000 ₸. Точная сумма определяется после ОКТ и консультации витреоретинолога.",
    ),
    (
        "<h2 class=\"section-title\">Что такое витрэктомия</h2>",
        "<h2 class=\"section-title\">Что такое сетчатка и как её лечат</h2>",
    ),
    (
        '<div class="card-title">Суть операции</div>',
        '<div class="card-title">Что такое сетчатка</div>',
    ),
    (
        "Витрэктомия — это хирургическое вмешательство, во время которого врач частично или полностью удаляет изменённое стекловидное тело.",
        "Сетчатка — тонкая нервная ткань на глазном дне, которая преобразует свет в нервный импульс. Повреждение сетчатки может привести к необратимой потере зрения.",
    ),
    (
        '<div class="card-title">Как выбирают метод</div>',
        '<div class="card-title">Методы лечения</div>',
    ),
    (
        "В зависимости от диагноза и объёма операции внутри глаза может использоваться специальный газ, силиконовое масло или другой материал.",
        "Наблюдение, лазер, инъекции Anti-VEGF или витрэктомия — выбор зависит от диагноза, стадии и срочности. Решение принимает витреоретинолог после обследования.",
    ),
    (
        "<h2 class=\"section-title\">При каких заболеваниях проводится витрэктомия</h2>",
        "<h2 class=\"section-title\">Заболевания сетчатки, которые лечим в Алматы</h2>",
    ),
    (
        "<h2 class=\"section-title\">Диагностика перед витрэктомией</h2>",
        "<h2 class=\"section-title\">Диагностика сетчатки в Алматы</h2>",
    ),
    (
        "Перед операцией необходимо определить состояние сетчатки, макулы и стекловидного тела, оценить срочность лечения и возможные риски.",
        "Диагностика определяет диагноз, срочность и план лечения — лазер, инъекции, наблюдение или направление на витрэктомию.",
    ),
    (
        "<h2 class=\"section-title\">Как проходит операция витрэктомии</h2>",
        "<h2 class=\"section-title\">Как проходит лечение сетчатки</h2>",
    ),
    (
        "<h3>Диагностика и консультация</h3><p>Врач уточняет диагноз, оценивает состояние сетчатки и определяет объём лечения.</p>",
        "<h3>Диагностика</h3><p>Осмотр глазного дна, ОКТ, при необходимости УЗИ. Витреоретинолог объясняет результаты.</p>",
    ),
    (
        "<h3>Подготовка</h3><p>Пациент получает список необходимых анализов и индивидуальные рекомендации.</p>",
        "<h3>Выбор тактики</h3><p>Наблюдение, лазер, инъекции или операция — по показаниям.</p>",
    ),
    (
        "<h3>Операция</h3><p>Хирург выполняет вмешательство на стекловидном теле и сетчатке. Методика зависит от диагноза.</p>",
        "<h3>Лечение</h3><p>Лазер амбулаторно, инъекции по схеме или <a class=\"link\" href=\"/vitrektomiya-almaty/\">витрэктомия</a> в операционной.</p>",
    ),
    (
        "<h2 class=\"section-title\">Витреоретинальный хирург в Алматы</h2>",
        "<h2 class=\"section-title\">Врачи по сетчатке в Алматы</h2>",
    ),
    (
        "В филиале Asiakoz в Алматы пациентов по направлению витрэктомии принимает Орел Талип.",
        "Витреоретинальное направление ведёт Орел Талип. Также в филиале работают офтальмохирурги сети Asiakoz.",
    ),
    (
        "Специализируется на витрэктомии и патологиях сетчатки.",
        "Специализируется на патологиях сетчатки и витрэктомии.",
    ),
    (
        "по витрэктомии.",
        "по сетчатке.",
    ),
    (
        "<h2 class=\"section-title\">Восстановление после витрэктомии</h2>",
        "<h2 class=\"section-title\">Восстановление после лечения сетчатки</h2>",
    ),
    (
        "Срок восстановления зависит от диагноза, сложности операции и индивидуального состояния глаза.",
        "Срок восстановления зависит от метода: после лазера — дни, после инъекций — по схеме, после витрэктомии — недели и месяцы.",
    ),
    (
        "Витрэктомия относится к сложным офтальмологическим операциям.",
        "Лечение сетчатки — от амбулаторного лазера до сложной витрэктомии.",
    ),
    (
        "Результат операции индивидуален.",
        "Прогноз индивидуален и обсуждается на приёме.",
    ),
    (
        "<h2 class=\"section-title\">Витреоретинальные хирурги Asiakoz в других городах</h2>",
        "<h2 class=\"section-title\">Офтальмохирурги Asiakoz в других городах</h2>",
    ),
    (
        "После обследования врач объяснит диагноз, возможные варианты лечения и точную стоимость операции.",
        "После обследования врач объяснит диагноз, варианты лечения (лазер, инъекции, операция) и ориентировочную стоимость.",
    ),
    ('"name": "Витрэктомия в Алматы — цена операции | asiakoz"', '"name": "Сетчатка в Алматы — ОКТ, лазер, инъекции | asiakoz"'),
    (
        '"description": "Витрэктомия в Алматы при отслойке сетчатки, гемофтальме, диабетической ретинопатии и макулярном разрыве. Диагностика и приём витреоретинолога — 20 000 ₸. Операция — ориентировочно 1–1,6 млн ₸."',
        '"description": "Лечение сетчатки в Алматы: ОКТ, лазерная коагуляция, инъекции, витрэктомия. Диагностика и приём витреоретинолога — 20 000 ₸. Asiakoz, проспект Райымбека, 176а."',
    ),
    ('"name": "Витрэктомия в Алматы", "item":', '"name": "Сетчатка в Алматы", "item":'),
    ('"@type": "MedicalProcedure"', '"@type": "MedicalTherapy"'),
    (
        '"@id": "https://asiakoz.com/setchatka-almaty/#procedure"',
        '"@id": "https://asiakoz.com/setchatka-almaty/#condition"',
    ),
    ('"name": "Витрэктомия"', '"name": "Лечение заболеваний сетчатки"'),
    (
        '"alternateName": ["Витректомия", "Операция на сетчатке", "Витреоретинальная хирургия"]',
        '"alternateName": ["Сетчатка", "Болезни сетчатки", "Витреоретинология", "Retina"]',
    ),
    (
        "Микрохирургическая операция на стекловидном теле и сетчатке глаза. Ориентировочная стоимость витрэктомии",
        "Диагностика и лечение заболеваний сетчатки: лазер, инъекции, витрэктомия по показаниям. Диагностика от 20 000 ₸. Витрэктомия",
    ),
    ('"procedureType": "Surgical"', '"procedureType": "Therapeutic"'),
    (
        "Частичное или полное удаление изменённого стекловидного тела",
        "Комплексная диагностика и лечение патологий сетчатки",
    ),
    ('"dateModified": "2026-08-24"', '"dateModified": "2026-08-28"'),
]


def apply(html: str, rules: list) -> str:
    for old, new in rules:
        if isinstance(old, re.Pattern):
            html = old.sub(new, html, count=1)
        else:
            html = html.replace(old, new)
    return html


def post_process_ru(html: str) -> str:
    html = html.replace(
        'hreflang="kk-KZ" href="https://asiakoz.com/kk/vitrektomiya-almaty/"',
        'hreflang="kk-KZ" href="https://asiakoz.com/kk/setchatka-almaty/"',
    )
    html = html.replace(
        'content="Витрэктомия в Алматы при отслойке сетчатки, гемофтальме, диабетической ретинопатии и макулярном разрыве. Диагностика — 20 000 ₸. Операция — ориентировочно 1–1,6 млн ₸."',
        'content="Лечение сетчатки в Алматы: ОКТ, лазерная коагуляция, инъекции, витрэктомия. Диагностика — 20 000 ₸. Asiakoz, проспект Райымбека, 176а."',
    )
    html = html.replace(
        'property="og:description"\n    content="Витрэктомия в Алматы при отслойке сетчатки',
        'property="og:description"\n    content="Лечение сетчатки в Алматы: ОКТ, лазерная коагуляция, инъекции, витрэктомия. Диагностика',
    )
    if 'lang-switch' not in html:
        html = html.replace(
            '      <div class="header-right">\n        <div class="header-schedule">',
            '      <div class="header-right">\n        <div class="lang-switch" role="group" aria-label="Язык">\n'
            '          <a href="/kk/setchatka-almaty/" hreflang="kk">ҚАЗ</a>\n'
            '          <a class="is-active" hreflang="ru" aria-current="page">РУС</a>\n'
            "        </div>\n        <div class=\"header-schedule\">",
        )
    html = html.replace(
        '<li><a class="link" href="/vitrektomiya-almaty/">витрэктомия</a> и лечение заболеваний сетчатки;</li>',
        '<li><a class="link" href="/vitrektomiya-almaty/">витрэктомия</a> и '
        '<a class="link" href="/setchatka-almaty/">лечение заболеваний сетчатки</a>;</li>',
    )
    html = html.replace(
        '<a class="link" href="/setchatka-almaty/">Сетчатка</a> ·\n        <a class="link" href="/otsloyka-setchatki-almaty/">',
        '<a class="link" href="/vitrektomiya-almaty/">Витрэктомия</a> ·\n'
        '        <a class="link" href="/setchatka-almaty/">Сетчатка</a> ·\n'
        '        <a class="link" href="/otsloyka-setchatki-almaty/">',
    )
    html = html.replace("Дата обновления: 24.08.2026", "Дата обновления: 28.08.2026")
    return html


def insert_treatment_table(html: str, lang: str) -> str:
    from premium_deep import deep_section_html, get_deep_section

    block = deep_section_html(get_deep_section("setchatka", lang))
    if not block or 'id="treatment-methods"' in html:
        return html
    marker = '    <section class="section" id="indications">'
    return html.replace(marker, block + "\n" + marker, 1)


def make_kk_from_ru(ru_html: str) -> str:
    spec = importlib.util.spec_from_file_location("sync_kk", SCRIPTS / "sync-kk-static-mirrors.py")
    sync = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(sync)

    spec2 = importlib.util.spec_from_file_location("build_seo", SCRIPTS / "build-seo.py")
    build = importlib.util.module_from_spec(spec2)
    spec2.loader.exec_module(build)

    ru_url = f"{SITE}/setchatka-almaty/"
    kk_url = f"{SITE}/kk/setchatka-almaty/"
    kh = sync.localize_html(ru_html)
    kh = build.set_lang(kh, "kk")
    kh = build.set_canonical(kh, kk_url)
    kh = build.inject_hreflang(kh, ru_url, kk_url)
    kh = sync.fix_internal_links(kh)
    kh = re.sub(
        r'(property="og:url" content=")[^"]*(")',
        rf"\1{kk_url}\2",
        kh,
        count=1,
        flags=re.I,
    )
    kh = re.sub(
        r'(property="og:locale" content=")[^"]*(")',
        r"\1kk_KZ\2",
        kh,
        count=1,
        flags=re.I,
    )
    kh = kh.replace("/kk/kk/", "/kk/")
    kh = re.sub(
        r'<div class="lang-switch" role="group" aria-label="[^"]*">.*?</div>',
        '<div class="lang-switch" role="group" aria-label="Тіл">\n'
        '          <a class="is-active" href="/kk/setchatka-almaty/" hreflang="kk" aria-current="page">ҚАЗ</a>\n'
        '          <a href="/setchatka-almaty/" hreflang="ru">РУС</a>\n'
        "        </div>",
        kh,
        count=1,
        flags=re.DOTALL,
    )
    return kh


def main() -> None:
    ru_src = (ROOT / "vitrektomiya-almaty" / "index.html").read_text(encoding="utf-8")
    ru_out = apply(ru_src, RU_REPLACEMENTS)
    ru_out = post_process_ru(ru_out)
    ru_out = insert_treatment_table(ru_out, "ru")
    (ROOT / "setchatka-almaty" / "index.html").write_text(ru_out, encoding="utf-8")

    print(f"RU: {len(ru_out.splitlines())} lines -> setchatka-almaty/index.html")
    print("KK: skipped (generate-city-diagnosis-pages)")


if __name__ == "__main__":
    main()
