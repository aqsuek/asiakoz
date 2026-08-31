#!/usr/bin/env python3
"""Static news index + article pages from data/posts.json (RU + KK)."""

from __future__ import annotations

import html
import json
import re
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://asiakoz.com"
POSTS_FILE = ROOT / "data" / "posts.json"

try:
    from site_nav import FOOTER_NAV_KK, FOOTER_NAV_RU, HEADER_NAV_KK, HEADER_NAV_RU
except ImportError:
    HEADER_NAV_RU = HEADER_NAV_KK = FOOTER_NAV_RU = FOOTER_NAV_KK = ""

GTM_HEAD = """<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TJ4QBS3W');</script>
<!-- End Google Tag Manager -->"""

GTM_BODY = """<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TJ4QBS3W"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->"""


def fmt_date(iso: str, lang: str) -> str:
    try:
        dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
        if lang == "kk":
            months = [
                "қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым",
                "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан",
            ]
            return f"{dt.day} {months[dt.month - 1]} {dt.year}"
        months = [
            "января", "февраля", "марта", "апреля", "мая", "июня",
            "июля", "августа", "сентября", "октября", "ноября", "декабря",
        ]
        return f"{dt.day} {months[dt.month - 1]} {dt.year}"
    except ValueError:
        return iso[:10]


def body_html(text: str) -> str:
    paras = [p.strip() for p in text.split("\n") if p.strip()]
    return "".join(f"<p>{html.escape(p)}</p>" for p in paras)


def shell(
    *,
    lang: str,
    title: str,
    desc: str,
    canonical: str,
    ru_url: str,
    kk_url: str,
    breadcrumb: str,
    body: str,
    lang_switch: str,
) -> str:
    home = "/kk/" if lang == "kk" else "/"
    logo_title = "Азиякөз" if lang == "kk" else "Азиякоз"
    header_nav = HEADER_NAV_KK if lang == "kk" else HEADER_NAV_RU
    footer_nav = FOOTER_NAV_KK if lang == "kk" else FOOTER_NAV_RU
    cta_btn = "WhatsApp арқылы жазылу" if lang == "kk" else "Записаться в WhatsApp"
    cta_h = "Кеңеске жазылу" if lang == "kk" else "Записаться на консультацию"
    cta_p = (
        "WhatsApp арқылы жазыңыз — дәрігер мен уақытты таңдаймыз."
        if lang == "kk"
        else "Напишите в WhatsApp — подберём врача и удобное время."
    )
    footer_desc = (
        "Офтальмологиялық клиника. Алматы және Ақтау."
        if lang == "kk"
        else "Офтальмологическая клиника. Алматы и Актау."
    )
    disclaimer = (
        "Қарсы көрсеткіштер бар. Маман кеңесі қажет."
        if lang == "kk"
        else "Имеются противопоказания. Необходима консультация специалиста."
    )
    og_locale = "kk_KZ" if lang == "kk" else "ru_KZ"
    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17817733574"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','AW-17817733574');</script>
{GTM_HEAD}
  <meta charset="UTF-8" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(desc)}" />
  <link rel="canonical" href="{canonical}" />
  <link rel="alternate" hreflang="ru-KZ" href="{ru_url}" />
  <link rel="alternate" hreflang="kk-KZ" href="{kk_url}" />
  <link rel="alternate" hreflang="x-default" href="{ru_url}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="{og_locale}" />
  <meta property="og:title" content="{html.escape(title)}" />
  <meta property="og:description" content="{html.escape(desc)}" />
  <meta property="og:url" content="{canonical}" />
  <meta property="og:image" content="{SITE}/images/logo.png" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="stylesheet" href="/css/style.css" />
</head>
<body>
{GTM_BODY}
  <div class="container">
    <header class="site-header">
      <a href="{home}" class="logo" title="{logo_title}"><img src="/images/logo-asiakoz.png" alt="{logo_title}" class="logo-img" /></a>
{header_nav}
      <div class="header-right">
{lang_switch}
        <a href="https://wa.me/77003600180" target="_blank" rel="noopener" class="btn btn-header">{"Жазылу" if lang == "kk" else "Записаться"}</a>
      </div>
    </header>
    {breadcrumb}
    {body}
    <div class="cta-block">
      <h2>{cta_h}</h2>
      <p>{cta_p}</p>
      <a href="https://wa.me/77003600180" target="_blank" rel="noopener" class="btn">{cta_btn}</a>
    </div>
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-col">
          <div class="footer-logo"><img src="/images/logo-asiakoz.png" alt="{logo_title}" class="logo-img" style="height:36px;" /></div>
          <p class="footer-desc">{footer_desc}</p>
        </div>
        <div class="footer-col">
          <div class="footer-title">{"Навигация" if lang == "ru" else "Навигация"}</div>
{footer_nav}
        </div>
        <div class="footer-col">
          <div class="footer-title">{"Контакты" if lang == "ru" else "Байланыс"}</div>
          <p>{"Алматы" if lang == "ru" else "Алматы"}: <a href="tel:+77008880180" class="link">+7 700 888 01 80</a></p>
          <a href="https://wa.me/77003600180" target="_blank" rel="noopener" class="link">WhatsApp</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-disclaimer">{disclaimer}</p>
        <p class="footer-copy">© {logo_title}. Алматы, {"Актау" if lang == "ru" else "Ақтау"}.</p>
      </div>
    </footer>
  </div>
  <script src="/js/compliance.js"></script>
</body>
</html>
"""


def lang_switch_block(active: str, ru_href: str, kk_href: str) -> str:
    if active == "kk":
        return (
            f'        <div class="lang-switch" role="group" aria-label="Тіл">\n'
            f'          <a class="is-active" href="{kk_href}" hreflang="kk" aria-current="page">ҚАЗ</a>\n'
            f'          <a href="{ru_href}" hreflang="ru">РУС</a>\n'
            f"        </div>"
        )
    return (
        f'        <div class="lang-switch" role="group" aria-label="Язык">\n'
        f'          <a href="{kk_href}" hreflang="kk">ҚАЗ</a>\n'
        f'          <a class="is-active" href="{ru_href}" hreflang="ru" aria-current="page">РУС</a>\n'
        f"        </div>"
    )


def render_index(posts: list[dict], lang: str) -> str:
    if lang == "kk":
        title = "Жаңалықтар — AsiaKoz"
        desc = "AsiaKoz клиникасының жаңалықтары мен хабарламалары."
        h1 = "Жаңалықтар"
        crumb = '<nav class="breadcrumb"><a href="/kk/">Басты бет</a> / Жаңалықтар</nav>'
        read = "Оқу →"
    else:
        title = "Новости — AsiaKoz"
        desc = "Новости и объявления клиники AsiaKoz."
        h1 = "Новости"
        crumb = '<nav class="breadcrumb"><a href="/">Главная</a> / Новости</nav>'
        read = "Читать →"
    cards = []
    for post in sorted(posts, key=lambda p: p.get("publishedAt", ""), reverse=True):
        slug = post["slug"]
        prefix = "/kk" if lang == "kk" else ""
        href = f"{prefix}/news/{slug}/"
        ptitle = post["titleKz"] if lang == "kk" else post["titleRu"]
        excerpt = post["excerptKz"] if lang == "kk" else post["excerptRu"]
        date = fmt_date(post.get("publishedAt", ""), lang)
        cover = post.get("cover") or "/images/clinic-building.png"
        cards.append(
            f"""        <article class="card">
          <a class="link" href="{href}"><img src="{html.escape(cover)}" alt="" style="width:100%;border-radius:8px;margin-bottom:12px;" loading="lazy" /></a>
          <p style="font-size:13px;color:var(--text-muted);margin-bottom:6px;">{html.escape(date)}</p>
          <h2 class="card-title" style="font-size:18px;"><a class="link" href="{href}">{html.escape(ptitle)}</a></h2>
          <p class="card-text">{html.escape(excerpt)}</p>
          <p><a class="link" href="{href}">{read}</a></p>
        </article>"""
        )
    grid = "\n".join(cards) if cards else "<p>—</p>"
    body = f"""    <section class="section">
      <h1 class="section-title">{h1}</h1>
      <div class="grid-2" style="display:grid;gap:20px;">
{grid}
      </div>
    </section>"""
    ru_url = f"{SITE}/news/"
    kk_url = f"{SITE}/kk/news/"
    canonical = kk_url if lang == "kk" else ru_url
    return shell(
        lang=lang,
        title=title,
        desc=desc,
        canonical=canonical,
        ru_url=ru_url,
        kk_url=kk_url,
        breadcrumb=crumb,
        body=body,
        lang_switch=lang_switch_block(lang, "/news/", "/kk/news/"),
    )


def render_article(post: dict, lang: str) -> str:
    slug = post["slug"]
    ru_url = f"{SITE}/news/{slug}/"
    kk_url = f"{SITE}/kk/news/{slug}/"
    canonical = kk_url if lang == "kk" else ru_url
    ptitle = post["titleKz"] if lang == "kk" else post["titleRu"]
    excerpt = post["excerptKz"] if lang == "kk" else post["excerptRu"]
    body_text = post["bodyKz"] if lang == "kk" else post["bodyRu"]
    date = fmt_date(post.get("publishedAt", ""), lang)
    cover = post.get("cover") or "/images/clinic-building.png"
    if lang == "kk":
        crumb = (
            f'<nav class="breadcrumb"><a href="/kk/">Басты бет</a> / '
            f'<a href="/kk/news/">Жаңалықтар</a> / {html.escape(ptitle)}</nav>'
        )
        back = '<p style="margin-top:24px;"><a class="link" href="/kk/news/">← Барлық жаңалықтар</a></p>'
    else:
        crumb = (
            f'<nav class="breadcrumb"><a href="/">Главная</a> / '
            f'<a href="/news/">Новости</a> / {html.escape(ptitle)}</nav>'
        )
        back = '<p style="margin-top:24px;"><a class="link" href="/news/">← Все новости</a></p>'
    body = f"""    <article class="section">
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:8px;">{html.escape(date)}</p>
      <h1 class="section-title">{html.escape(ptitle)}</h1>
      <img src="{html.escape(cover)}" alt="" style="width:100%;max-width:720px;border-radius:12px;margin:16px 0 24px;" loading="lazy" />
      <div class="article-body">{body_html(body_text)}</div>
      {back}
    </article>"""
    return shell(
        lang=lang,
        title=f"{ptitle} | AsiaKoz",
        desc=excerpt,
        canonical=canonical,
        ru_url=ru_url,
        kk_url=kk_url,
        breadcrumb=crumb,
        body=body,
        lang_switch=lang_switch_block(lang, f"/news/{slug}/", f"/kk/news/{slug}/"),
    )


def main() -> None:
    posts = json.loads(POSTS_FILE.read_text(encoding="utf-8"))
    news = [p for p in posts if p.get("type") == "news"]
    targets = [
        (ROOT / "news" / "index.html", render_index(news, "ru")),
        (ROOT / "kk" / "news" / "index.html", render_index(news, "kk")),
    ]
    for post in news:
        slug = post["slug"]
        targets.append((ROOT / "news" / slug / "index.html", render_article(post, "ru")))
        targets.append((ROOT / "kk" / "news" / slug / "index.html", render_article(post, "kk")))
    for path, content in targets:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content + "\n<!-- news-generated -->\n", encoding="utf-8")
        print(f"write: {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
