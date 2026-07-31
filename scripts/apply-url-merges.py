#!/usr/bin/env python3
"""Apply thin-page merges: hub anchors, soft redirect stubs, emergency hub, short uslugi catalog."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://asiakoz.com"
MERGES_PATH = ROOT / "data" / "url-merges.json"


def load_merges() -> list[dict]:
    data = json.loads(MERGES_PATH.read_text(encoding="utf-8"))
    return data["merges"]


def write_soft_redirect(from_path: str, to_path: str, title: str) -> None:
    """GitHub Pages cannot do server 301 — write noindex + canonical + meta refresh stub."""
    slug = from_path.strip("/")
    path = ROOT / slug / "index.html"
    path.parent.mkdir(parents=True, exist_ok=True)
    target_url = f"{SITE}{to_path}"
    # canonical without hash for SEO
    canon = target_url.split("#", 1)[0]
    if not canon.endswith("/"):
        canon += "/"
    html = f"""<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="robots" content="noindex, follow" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title} — перенаправление | AsiaKoz</title>
  <link rel="canonical" href="{canon}" />
  <meta http-equiv="refresh" content="0; url={to_path}" />
  <script>location.replace({json.dumps(to_path)});</script>
</head>
<body>
  <p>Страница объединена. <a href="{to_path}">Перейти: {title}</a></p>
</body>
</html>
"""
    path.write_text(html, encoding="utf-8")
    print(f"merge stub: {from_path} → {to_path}")


def ensure_id_on_section(html: str, heading_pattern: str, section_id: str) -> str:
    """Add id= to the nearest <section> before a matching h2 if missing."""
    if f'id="{section_id}"' in html:
        return html
    # Prefer: <section class="section"> ... <h2 ...>Heading
    pat = rf'(<section\s+class="section")(>\s*<h2[^>]*>\s*{heading_pattern})'
    if re.search(pat, html, flags=re.I | re.S):
        return re.sub(pat, rf'\1 id="{section_id}"\2', html, count=1, flags=re.I | re.S)
    # Fallback: wrap h2 with id on itself
    pat2 = rf'(<h2[^>]*class="section-title"[^>]*>)({heading_pattern})'
    if re.search(pat2, html, flags=re.I):
        return re.sub(
            pat2,
            rf'<h2 class="section-title" id="{section_id}">\2',
            html,
            count=1,
            flags=re.I,
        )
    return html


def patch_lazer() -> None:
    path = ROOT / "lazer-almaty" / "index.html"
    html = path.read_text(encoding="utf-8")
    # Remove SEO-speak intro
    html = html.replace(
        "Если вы ищете «лазер Алматы», «SMILE / ReLEx SMILE Алматы», «Femto‑LASIK Алматы» или «коррекция зрения Алматы» — в Азиякоз вы проходите диагностику, подбор методики и коррекцию в одном месте. Оперируют офтальмохирурги с опытом работы в клиниках Турции. После обследования врач скажет, подходит ли лазерная коррекция и какой вариант будет безопаснее именно для вас.",
        "В AsiaKoz Алматы после полной диагностики подбираем методику лазерной коррекции и выполняем процедуру с контрольными осмотрами. Решение о возможности коррекции и выборе метода принимает врач по результатам обследования.",
    )
    # Add id metody to methods section
    html = re.sub(
        r'<section class="section">\s*<h2 class="section-title">Методы лазерной коррекции</h2>',
        '<section class="section" id="metody">\n      <h2 class="section-title">Методы лазерной коррекции</h2>',
        html,
        count=1,
    )
    # Replace method cards links to internal anchors + comparison table if missing
    if "methods-compare" not in html:
        table = """
      <div class="methods-compare" style="overflow-x:auto;margin-top:18px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="text-align:left;border-bottom:1px solid rgba(15,23,42,.12);">
              <th style="padding:10px 8px;">Метод</th>
              <th style="padding:10px 8px;">Особенности</th>
              <th style="padding:10px 8px;">Восстановление</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid rgba(15,23,42,.06);"><td style="padding:10px 8px;"><b>ReLEx SMILE</b></td><td style="padding:10px 8px;">Минимальный разрез роговицы; не всем подходит</td><td style="padding:10px 8px;">Часто быстрее, решение после диагностики</td></tr>
            <tr style="border-bottom:1px solid rgba(15,23,42,.06);"><td style="padding:10px 8px;"><b>Femto-LASIK / LASIK</b></td><td style="padding:10px 8px;">Классические методы; есть противопоказания</td><td style="padding:10px 8px;">Часто быстрое улучшение зрения</td></tr>
            <tr><td style="padding:10px 8px;"><b>PRK / LASEK</b></td><td style="padding:10px 8px;">Альтернатива при особенностях роговицы</td><td style="padding:10px 8px;">Может быть дольше</td></tr>
          </tbody>
        </table>
        <p style="margin-top:10px;font-size:13px;color:#64748b;">Подходящий метод выбирается только после диагностики. Цены и точные показания обсуждаются на приёме.</p>
      </div>
"""
        html = html.replace(
            '</div>\n    </section>\n\n    <section class="section">\n      <h2 class="section-title">Наши врачи</h2>',
            f'</div>{table}\n    </section>\n\n    <section class="section">\n      <h2 class="section-title">Наши врачи</h2>',
            1,
        )
    # Point "Подробнее" links to #metody instead of thin pages
    html = html.replace('href="/smile-almaty/"', 'href="#metody"')
    html = html.replace('href="/femto-lasik-almaty/"', 'href="#metody"')
    html = html.replace('href="/prk-lasek-almaty/"', 'href="#metody"')
    path.write_text(html, encoding="utf-8")
    print("patched: /lazer-almaty/ #metody")


def patch_katarakta() -> None:
    path = ROOT / "katarakta-almaty" / "index.html"
    html = path.read_text(encoding="utf-8")
    html = re.sub(
        r'<section class="section">\s*<h2 class="section-title">Линзы \(ИОЛ\): какие бывают</h2>',
        '<section class="section" id="iol">\n      <h2 class="section-title">Линзы (ИОЛ): какие бывают</h2>',
        html,
        count=1,
    )
    # Remove SEO-speak if present
    html = re.sub(
        r"Если вы ищете[^<]{20,400}",
        "В AsiaKoz Алматы проводим диагностику катаракты, подбор ИОЛ и операцию факоэмульсификации с контрольными осмотрами.",
        html,
        count=1,
    )
    path.write_text(html, encoding="utf-8")
    print("patched: /katarakta-almaty/ #iol")


def patch_kosoglazie() -> None:
    path = ROOT / "kosoglazie" / "index.html"
    html = path.read_text(encoding="utf-8")
    # Insert sections before "Как проходит лечение" if missing
    if 'id="deti"' not in html:
        block = """
    <section class="section" id="deti">
      <h2 class="section-title">Косоглазие у детей</h2>
      <p class="section-subtitle">Ранняя диагностика важна для сохранения бинокулярного зрения. После осмотра врач определяет тактику: наблюдение, оптика, ортоптика или операция.</p>
    </section>
    <section class="section" id="vzroslye">
      <h2 class="section-title">Косоглазие у взрослых</h2>
      <p class="section-subtitle">У взрослых операция чаще решает эстетическую и функциональную задачу. План лечения — после обследования и оценки угла отклонения.</p>
    </section>
    <section class="section" id="operatsiya">
      <h2 class="section-title">Операция при косоглазии</h2>
      <p class="section-subtitle">Хирургия косоглазия выполняется по показаниям. Перед операцией — диагностика, обсуждение ожидаемого результата и контрольные осмотры после процедуры.</p>
    </section>
"""
        html = html.replace(
            '<section class="section">\n      <h2 class="section-title">Как проходит лечение</h2>',
            block + '\n    <section class="section">\n      <h2 class="section-title">Как проходит лечение</h2>',
            1,
        )
    # Fix related links to hub sections
    for old, new in [
        ("/kosoglazie-u-detey-almaty/", "/kosoglazie/#deti"),
        ("/kosoglazie-u-vzroslyh-almaty/", "/kosoglazie/#vzroslye"),
        ("/operatsiya-kosoglazie-almaty/", "/kosoglazie/#operatsiya"),
    ]:
        html = html.replace(old, new)
    path.write_text(html, encoding="utf-8")
    print("patched: /kosoglazie/ anchors")


def patch_diagnostika() -> None:
    path = ROOT / "diagnostika-almaty" / "index.html"
    html = path.read_text(encoding="utf-8")
    if 'id="proverka"' not in html:
        block = """
    <section class="section" id="proverka">
      <h2 class="section-title">Проверка зрения</h2>
      <p class="section-subtitle">Оцениваем остроту зрения и рефракцию — базовый этап любой офтальмологической диагностики.</p>
    </section>
    <section class="section" id="checkup">
      <h2 class="section-title">Чек-ап зрения</h2>
      <p class="section-subtitle">Расширенное обследование: зрение, давление, глазное дно и дополнительные методы по показаниям.</p>
    </section>
    <section class="section" id="konsultatsiya">
      <h2 class="section-title">Консультация офтальмолога</h2>
      <p class="section-subtitle">Врач собирает жалобы, проводит осмотр и формирует план обследования или лечения.</p>
    </section>
    <section class="section" id="glaznoe-dno">
      <h2 class="section-title">Осмотр глазного дна</h2>
      <p class="section-subtitle">Оцениваем сетчатку и диск зрительного нерва — важно при диабете, близорукости и глаукоме.</p>
    </section>
    <section class="section" id="okt">
      <h2 class="section-title">ОКТ глаза и зрительного нерва</h2>
      <p class="section-subtitle">Оптическая когерентная томография помогает детально оценить сетчатку и зрительный нерв.</p>
    </section>
    <section class="section" id="perimetriya">
      <h2 class="section-title">Периметрия</h2>
      <p class="section-subtitle">Исследование поля зрения — ключевой метод при подозрении на глаукому и неврологические изменения.</p>
    </section>
    <section class="section" id="tonometriya">
      <h2 class="section-title">Тонометрия</h2>
      <p class="section-subtitle">Измерение внутриглазного давления — обязательный этап диагностики глаукомы и предоперационного обследования.</p>
    </section>
    <section class="section" id="gonioskopiya">
      <h2 class="section-title">Гониоскопия</h2>
      <p class="section-subtitle">Осмотр угла передней камеры глаза при глаукоме и уточнении типа заболевания.</p>
    </section>
    <section class="section" id="podbor-optik">
      <h2 class="section-title">Подбор очков и контактных линз</h2>
      <p class="section-subtitle">После рефрактометрии и проверки зрения подбираем оптическую коррекцию по показаниям.</p>
    </section>
"""
        html = html.replace(
            '<section class="section">\n      <h2 class="section-title">Что входит в диагностику</h2>',
            '<section class="section" id="methods">\n      <h2 class="section-title">Что входит в диагностику</h2>',
            1,
        )
        html = html.replace(
            '<section class="section" id="methods">',
            block + '\n    <section class="section" id="methods">',
            1,
        )
    path.write_text(html, encoding="utf-8")
    print("patched: /diagnostika-almaty/ anchors")


def patch_deti() -> None:
    path = ROOT / "deti-almaty" / "index.html"
    html = path.read_text(encoding="utf-8")
    if 'id="astigmatizm"' not in html:
        block = """
    <section class="section" id="astigmatizm">
      <h2 class="section-title">Астигматизм у детей</h2>
      <p class="section-subtitle">После осмотра детский офтальмолог определяет необходимость оптики, наблюдения или дополнительного обследования.</p>
    </section>
    <section class="section" id="profilakticheskiy-osmotr">
      <h2 class="section-title">Профилактический осмотр перед школой</h2>
      <p class="section-subtitle">Проверяем остроту зрения и выявляем скрытые нарушения, которые могут мешать учёбе.</p>
    </section>
"""
        html = html.replace(
            '<section class="section">\n      <h2 class="section-title">Что мы делаем для детей</h2>',
            block + '\n    <section class="section">\n      <h2 class="section-title">Что мы делаем для детей</h2>',
            1,
        )
    path.write_text(html, encoding="utf-8")
    print("patched: /deti-almaty/ anchors")


def write_emergency_hub() -> None:
    path = ROOT / "srochnye-simptomy-glaz-almaty" / "index.html"
    path.parent.mkdir(parents=True, exist_ok=True)
    html = """<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Срочные симптомы глаз в Алматы — когда к офтальмологу | AsiaKoz</title>
  <meta name="description" content="Вспышки, мушки, пелена и резкое ухудшение зрения: когда нужна срочная консультация офтальмолога в AsiaKoz Алматы. Адрес: пр. Райымбека, 176А. Тел. +7 700 360 01 80." />
  <link rel="canonical" href="https://asiakoz.com/srochnye-simptomy-glaz-almaty/" />
  <link rel="stylesheet" href="/css/style.css" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "Срочные симптомы глаз — AsiaKoz Алматы",
    "url": "https://asiakoz.com/srochnye-simptomy-glaz-almaty/",
    "about": ["вспышки в глазах", "мушки перед глазами", "пелена перед глазом", "резкое ухудшение зрения"]
  }
  </script>
</head>
<body>
  <div class="container">
    <header class="site-header">
      <a href="/" class="logo" title="AsiaKoz"><img src="/images/logo.png" alt="AsiaKoz" class="logo-img" /></a>
      <nav class="header-nav">
        <a href="/uslugi/">Услуги</a>
        <a href="/diagnostika-almaty/">Диагностика</a>
        <a href="/doctors/">Врачи</a>
        <a href="/almaty/">Алматы</a>
      </nav>
      <a href="https://wa.me/77003600180" class="btn btn-header" target="_blank" rel="noopener">Записаться</a>
    </header>
    <nav class="breadcrumb"><a href="/">Главная</a> / <a href="/uslugi/">Услуги</a> / Срочные симптомы</nav>

    <section class="seo-hero spa-hero">
      <div class="spa-eyebrow">AsiaKoz · Алматы</div>
      <h1>Когда срочно обращаться к офтальмологу</h1>
      <p>Некоторые симптомы требуют осмотра в ближайшее время: вспышки света, внезапные «мушки», пелена или резкое падение зрения. Ниже — ориентиры, когда лучше не ждать. Решение о срочности и тактике принимает врач после осмотра.</p>
      <p><b>AsiaKoz Алматы:</b> пр. Райымбека, 176А · <a href="tel:+77003600180">+7 700 360 01 80</a> · <a href="https://wa.me/77003600180">WhatsApp</a></p>
      <p style="margin-top:12px;"><a class="btn" href="https://wa.me/77003600180?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%9D%D1%83%D0%B6%D0%BD%D0%B0%20%D1%81%D1%80%D0%BE%D1%87%D0%BD%D0%B0%D1%8F%20%D0%BA%D0%BE%D0%BD%D1%81%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BE%D1%84%D1%82%D0%B0%D0%BB%D1%8C%D0%BC%D0%BE%D0%BB%D0%BE%D0%B3%D0%B0">Написать в WhatsApp</a></p>
    </section>

    <section class="section" id="vspyshki">
      <h2 class="section-title">Вспышки в глазах</h2>
      <p>Вспышки света могут быть связаны с изменениями стекловидного тела или сетчатки. Особенно важно обратиться, если вспышки появились внезапно, сопровождаются «занавеской» или снижением зрения.</p>
    </section>
    <section class="section" id="mushki">
      <h2 class="section-title">Мушки перед глазами</h2>
      <p>Плавающие точки и нити часто встречаются, но резкое увеличение «мушек» вместе со вспышками — повод для осмотра глазного дна.</p>
    </section>
    <section class="section" id="pelena">
      <h2 class="section-title">Пелена перед глазом</h2>
      <p>Ощущение пелены или «шторки» может указывать на проблемы сетчатки или другие острые состояния. Не откладывайте осмотр, особенно при одностороннем появлении.</p>
    </section>
    <section class="section" id="rezkoe">
      <h2 class="section-title">Резкое ухудшение зрения</h2>
      <p>Внезапное снижение остроты зрения — сигнал для срочной консультации. Врач определит, нужна ли экстренная диагностика сетчатки, давления или других структур глаза.</p>
    </section>

    <section class="section faq">
      <h2 class="section-title">Частые вопросы</h2>
      <details><summary>Это экстренная помощь 24/7?</summary><p>Клиника работает по расписанию филиала. При угрожающих симптомах вне часов приёма обратитесь в ближайший стационар/скорую помощь.</p></details>
      <details><summary>Что взять на приём?</summary><p>Паспорт, список лекарств, результаты предыдущих обследований при наличии.</p></details>
    </section>

    <p style="margin:24px 0;"><a class="link" href="/diagnostika-almaty/">Диагностика зрения в Алматы →</a> · <a class="link" href="/setchatka-almaty/">Сетчатка →</a></p>
  </div>
  <script src="/js/compliance.js"></script>
</body>
</html>
"""
    path.write_text(html, encoding="utf-8")
    print("wrote: /srochnye-simptomy-glaz-almaty/")


def write_uslugi_catalog() -> None:
    path = ROOT / "uslugi" / "index.html"
    html = """<!DOCTYPE html>
<html lang="ru">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17817733574"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-17817733574');</script>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TJ4QBS3W');</script>
  <meta charset="UTF-8" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Услуги офтальмологической клиники AsiaKoz</title>
  <meta name="description" content="Каталог услуг AsiaKoz: диагностика, лазерная коррекция, катаракта, витрэктомия, глаукома, косоглазие, детская офтальмология. Алматы и Актау." />
  <link rel="canonical" href="https://asiakoz.com/uslugi/" />
  <link rel="alternate" hreflang="ru-KZ" href="https://asiakoz.com/uslugi/" />
  <link rel="alternate" hreflang="kk-KZ" href="https://asiakoz.com/kk/uslugi/" />
  <link rel="alternate" hreflang="x-default" href="https://asiakoz.com/uslugi/" />
  <meta property="og:site_name" content="AsiaKoz" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Услуги офтальмологической клиники AsiaKoz" />
  <meta property="og:description" content="Каталог направлений AsiaKoz в Алматы и Актау." />
  <meta property="og:url" content="https://asiakoz.com/uslugi/" />
  <meta property="og:image" content="https://asiakoz.com/images/logo.png" />
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"MedicalWebPage","name":"Услуги AsiaKoz","url":"https://asiakoz.com/uslugi/","isPartOf":{"@type":"WebSite","name":"AsiaKoz","url":"https://asiakoz.com/"}}
  </script>
  <link rel="icon" href="/favicon.ico" />
  <link rel="stylesheet" href="/css/style.css" />
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TJ4QBS3W" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <div class="container">
    <header class="site-header">
      <a href="/" class="logo" title="AsiaKoz"><img src="/images/logo-asiakoz.png" alt="AsiaKoz" class="logo-img" /></a>
      <nav class="header-nav">
        <a href="/uslugi/">Услуги</a>
        <a href="/doctors/">Врачи</a>
        <a href="/almaty/">Алматы</a>
        <a href="/aktau/">Актау</a>
        <a href="/shymkent/">Шымкент</a>
      </nav>
      <div class="header-right">
        <div class="lang-switch" role="group" aria-label="Язык">
          <a href="/kk/uslugi/" hrefLang="kk">KZ</a>
          <a class="is-active" hrefLang="ru" aria-current="page">RU</a>
        </div>
        <a href="https://wa.me/77003600180" class="btn btn-header" target="_blank" rel="noopener">Записаться</a>
      </div>
    </header>
    <nav class="breadcrumb"><a href="/">Главная</a> / Услуги</nav>

    <section class="spa-hero">
      <div class="spa-eyebrow">AsiaKoz · Услуги</div>
      <h1>Услуги AsiaKoz</h1>
      <p>Краткий каталог направлений. Подробности, врачи и запись — на странице услуги. Алматы и Актау работают, Шымкент — скоро открытие.</p>
    </section>

    <section class="section">

      <div class="catalog-grid">
        <article class="catalog-card" id="diagnostika">
          <h2>Диагностика зрения</h2>
          <p class="meta">Филиал: Алматы · Актау</p>
          <p>Полный осмотр: острота зрения, давление, глазное дно и дополнительные методы по показаниям. Нужна как перед операцией, так и при жалобах на зрение.</p>
          <a class="btn" href="/diagnostika-almaty/">Подробнее</a>
        </article>
        <article class="catalog-card" id="lazer">
          <h2>Лазерная коррекция</h2>
          <p class="meta">Филиал: Алматы</p>
          <p>SMILE, Femto-LASIK/LASIK и PRK/LASEK — метод выбираем после диагностики. Подходит не всем: решение принимает врач по параметрам роговицы и противопоказаниям.</p>
          <a class="btn" href="/lazer-almaty/">Подробнее</a>
        </article>
        <article class="catalog-card" id="katarakta">
          <h2>Катаракта</h2>
          <p class="meta">Филиал: Алматы · Актау</p>
          <p>Диагностика, подбор ИОЛ и факоэмульсификация. Сравниваем монофокальные, торические и мультифокальные линзы по показаниям пациента.</p>
          <a class="btn" href="/katarakta-almaty/">Подробнее</a>
        </article>
        <article class="catalog-card" id="vitrektomiya">
          <h2>Витрэктомия</h2>
          <p class="meta">Филиал: Алматы</p>
          <p>Хирургия стекловидного тела и сетчатки при отслойке, кровоизлияниях и других показаниях. Тактика — после обследования витреоретинолога.</p>
          <a class="btn" href="/vitrektomiya-almaty/">Подробнее</a>
        </article>
        <article class="catalog-card" id="glaukoma">
          <h2>Глаукома</h2>
          <p class="meta">Филиал: Алматы · Актау</p>
          <p>Контроль внутриглазного давления, поле зрения, ОКТ. Лечение: капли, лазер или операция — по стадии и ответу на терапию.</p>
          <a class="btn" href="/glaukoma-almaty/">Подробнее</a>
        </article>
        <article class="catalog-card" id="kosoglazie">
          <h2>Косоглазие</h2>
          <p class="meta">Филиал: Алматы · Актау</p>
          <p>Диагностика и хирургия косоглазия у детей и взрослых. В Актау — отдельная страница с врачами и записью филиала.</p>
          <a class="btn" href="/kosoglazie/">Алматы</a>
          <a class="btn btn-outline" href="/kosoglazie-aktau/" style="margin-left:6px;">Актау</a>
        </article>
        <article class="catalog-card" id="icl">
          <h2>ICL</h2>
          <p class="meta">Филиал: Алматы</p>
          <p>Имплантация факичных линз — альтернатива лазерной коррекции при высоких степенях нарушения или тонкой роговице, по показаниям.</p>
          <a class="btn" href="/icl-almaty/">Подробнее</a>
        </article>
        <article class="catalog-card" id="deti">
          <h2>Детская офтальмология</h2>
          <p class="meta">Филиал: Алматы</p>
          <p>Осмотр детей, профосмотры, астигматизм и контроль миопии. План наблюдения или лечения — после приёма детского офтальмолога.</p>
          <a class="btn" href="/deti-almaty/">Подробнее</a>
        </article>
        <article class="catalog-card" id="retinopatiya">
          <h2>Диабетическая ретинопатия</h2>
          <p class="meta">Филиал: Алматы</p>
          <p>Осмотр глазного дна, ОКТ и лечение осложнений диабета со стороны сетчатки по результатам обследования.</p>
          <a class="btn" href="/diabeticheskaya-retinopatiya-almaty/">Подробнее</a>
        </article>
        <article class="catalog-card" id="setchatka">
          <h2>Сетчатка / Retina</h2>
          <p class="meta">Филиал: Алматы</p>
          <p>Hub по заболеваниям сетчатки: разрывы, отслойка, макулярные изменения. Отсюда — к профильным страницам и витрэктомии.</p>
          <a class="btn" href="/setchatka-almaty/">Подробнее</a>
        </article>
        <article class="catalog-card" id="srochno">
          <h2>Срочные симптомы</h2>
          <p class="meta">Филиал: Алматы</p>
          <p>Вспышки, мушки, пелена, резкое ухудшение зрения — когда лучше обратиться к офтальмологу без откладывания.</p>
          <a class="btn" href="/srochnye-simptomy-glaz-almaty/">Подробнее</a>
        </article>
        <article class="catalog-card">
          <h2>Врачи</h2>
          <p class="meta">Алматы · Актау</p>
          <p>Каталог офтальмологов и хирургов сети AsiaKoz. Выберите врача и запишитесь через WhatsApp филиала.</p>
          <a class="btn" href="/doctors/">Каталог врачей</a>
        </article>
      </div>
    </section>

    <div class="cta-block" style="margin-top:28px;">
      <h2>Запись на консультацию</h2>
      <p>Алматы: <a href="tel:+77003600180">+7 700 360 01 80</a> · Актау: <a href="tel:+77758630180">+7 775 863 01 80</a></p>
      <a href="https://wa.me/77003600180" class="btn" target="_blank" rel="noopener">WhatsApp Алматы</a>
      <a href="https://wa.me/77758630180" class="btn btn-outline" target="_blank" rel="noopener" style="margin-left:8px;">WhatsApp Актау</a>
    </div>
  </div>
  <script src="/js/compliance.js"></script>
</body>
</html>
"""
    path.write_text(html, encoding="utf-8")
    print("rewrote: /uslugi/ short catalog")


def update_htaccess(merges: list[dict]) -> None:
    path = ROOT / ".htaccess"
    text = path.read_text(encoding="utf-8") if path.exists() else "RewriteEngine On\n"
    marker = "# Thin page merges → hub pages"
    if marker in text:
        # replace block
        text = re.sub(
            rf"{re.escape(marker)}[\s\S]*?(?=\n# |\Z)",
            "",
            text,
        )
    lines = [marker]
    for m in merges:
        src = m["from"].strip("/")
        dest = m["to"]
        # Apache Location without hash is fine; browser keeps hash from client if needed
        dest_path = dest.split("#", 1)[0]
        lines.append(f"RewriteRule ^{re.escape(src)}/?$ {dest_path} [L,R=301]")
    block = "\n".join(lines) + "\n"
    if not text.endswith("\n"):
        text += "\n"
    text += "\n" + block
    path.write_text(text, encoding="utf-8")
    print("updated: .htaccess merge rules")


def main() -> None:
    merges = load_merges()
    write_uslugi_catalog()
    write_emergency_hub()
    patch_lazer()
    patch_katarakta()
    patch_kosoglazie()
    patch_diagnostika()
    patch_deti()
    for m in merges:
        write_soft_redirect(m["from"], m["to"], m["title"])
    update_htaccess(merges)
    print("url merges applied:", len(merges))


if __name__ == "__main__":
    main()
