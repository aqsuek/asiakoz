#!/usr/bin/env python3
"""Render indexable /kk/doctor-*/ pages from data/doctors-ui.json (Kazakh copy)."""

from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://asiakoz.com"
UI_FILE = ROOT / "data" / "doctors-ui.json"
DOCTORS_FILE = ROOT / "data" / "doctors.json"

WA = {
    "almaty": ("77003600180", "+7 700 360 01 80"),
    "aqtau": ("77758630180", "+7 775 863 01 80"),
    "shymkent": ("77080750180", "+7 708 075 01 80"),
}

GTM_HEAD = """<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TJ4QBS3W');</script>"""

GTM_BODY = """<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TJ4QBS3W" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>"""

INLINE_CSS = """
    .container { max-width: 960px; }
    .doctor-hero { display: grid; grid-template-columns: 300px 1fr; gap: 40px; margin-bottom: 44px; }
    .doctor-photo-wrap { border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); aspect-ratio: 3/4; background: linear-gradient(145deg, #e8f8fc, #f0fafd); }
    .doctor-photo-wrap img { width: 100%; height: 100%; object-fit: contain; object-position: center bottom; }
    .doctor-info h1 { font-size: clamp(26px, 3.2vw, 32px); font-weight: 750; margin-bottom: 8px; }
    .doctor-role { font-size: 14px; font-weight: 500; color: var(--accent); margin-bottom: 10px; }
    .doctor-exp { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; }
    .doctor-lead { font-size: 15px; color: #334155; line-height: 1.65; margin-bottom: 24px; }
    .branch-badge { display: inline-block; background: rgba(18, 183, 213, 0.12); color: #0e9bb5; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; margin-bottom: 12px; }
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 32px; }
    .stat-card { background: var(--card); border-radius: var(--radius-sm); padding: 18px 16px; text-align: center; box-shadow: var(--shadow); }
    .stat-card .num { font-size: 22px; font-weight: 750; color: var(--accent); margin-bottom: 4px; }
    .stat-card .label { font-size: 12px; color: var(--text-muted); }
    .intro-text { font-size: 14px; color: #475569; line-height: 1.65; margin-bottom: 28px; }
    .section-title { font-size: 18px; margin-bottom: 16px; }
    .card { margin-bottom: 14px; }
    .tags-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
    .tag { background: var(--accent-soft); color: #0e9bb5; padding: 8px 14px; border-radius: 999px; font-size: 13px; font-weight: 500; }
    @media (max-width: 768px) { .doctor-hero { grid-template-columns: 1fr; } .stats-row { grid-template-columns: 1fr; } }
"""


def primary_city(doc: dict) -> str:
    cities = doc.get("cities") or ["almaty"]
    return cities[0]


def render_page(ui: dict, meta: dict | None) -> str:
    city = primary_city(ui)
    wa_num, wa_disp = WA.get(city, WA["almaty"])
    kk_href = ui.get("profileUrlKz") or f"/kk/doctor-{ui['id']}/"
    ru_href = ui.get("profileUrl") or f"/doctor-{ui['id']}/"
    if not ru_href.startswith("/"):
        ru_href = "/" + ru_href
    if not kk_href.startswith("/"):
        kk_href = "/" + kk_href
    ru_slug = ru_href.strip("/")
    kk_url = f"{SITE}{kk_href}"
    ru_url = f"{SITE}{ru_href}"
    name = ui["nameKz"]
    role = ui["roleKz"]
    title = f"{name} — офтальмолог-дәрігер | AsiaKoz"
    desc = f"{name} — {role}. AsiaKoz клиникасында қабылдау. Байланыс және жазылу."
    img = ui.get("image", "images/doctors/placeholder.png")
    if not img.startswith("/"):
        img = "/" + img
    stats_html = ""
    for st in ui.get("stats") or []:
        stats_html += (
            f'<div class="stat-card"><div class="num">{html.escape(st.get("valueKz", ""))}</div>'
            f'<div class="label">{html.escape(st.get("labelKz", ""))}</div></div>'
        )
    if not stats_html:
        stats_html = (
            '<div class="stat-card"><div class="num">AsiaKoz</div><div class="label">клиника</div></div>'
        )
    specs = ""
    for sp in ui.get("specialties") or []:
        specs += (
            f'<div class="card"><div class="card-title">{html.escape(sp.get("titleKz", ""))}</div>'
            f'<p class="card-text">{html.escape(sp.get("textKz", ""))}</p></div>'
        )
    tags = "".join(
        f'<span class="tag">{html.escape(t)}</span>' for t in (ui.get("tagsKz") or [])
    )
    city_label = {"almaty": "Алматы", "aqtau": "Ақтау", "shymkent": "Шымкент"}.get(city, "Алматы")
    try:
        from site_nav import FOOTER_NAV_KK, HEADER_NAV_KK
    except ImportError:
        HEADER_NAV_KK = FOOTER_NAV_KK = ""

    return f"""<!DOCTYPE html>
<html lang="kk">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17817733574"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','AW-17817733574');</script>
{GTM_HEAD}
  <meta charset="UTF-8" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(desc)}" />
  <link rel="canonical" href="{kk_url}" />
  <link rel="alternate" hreflang="ru-KZ" href="{ru_url}" />
  <link rel="alternate" hreflang="kk-KZ" href="{kk_url}" />
  <link rel="alternate" hreflang="x-default" href="{ru_url}" />
  <meta property="og:locale" content="kk_KZ" />
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="{html.escape(title)}" />
  <meta property="og:description" content="{html.escape(desc)}" />
  <meta property="og:url" content="{kk_url}" />
  <meta property="og:image" content="{SITE}{img}" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="stylesheet" href="/css/style.css" />
  <style>{INLINE_CSS}</style>
</head>
<body>
{GTM_BODY}
  <div class="container">
    <header class="site-header">
      <a href="/kk/" class="logo" title="Азиякөз"><img src="/images/logo-asiakoz.png" alt="Азиякөз" class="logo-img" /></a>
{HEADER_NAV_KK}
      <div class="header-right">
        <div class="lang-switch" role="group" aria-label="Тіл">
          <a class="is-active" href="{kk_href}" hreflang="kk" aria-current="page">ҚАЗ</a>
          <a href="{ru_href}" hreflang="ru">РУС</a>
        </div>
        <a href="https://wa.me/{wa_num}" target="_blank" rel="noopener" class="btn btn-header">Жазылу</a>
      </div>
    </header>
    <nav class="breadcrumb"><a href="/kk/">Басты бет</a> / <a href="/kk/doctors/">Дәрігерлер</a> / {html.escape(name)}</nav>
    <div class="doctor-hero">
      <div class="doctor-photo-wrap"><img src="{html.escape(img)}" alt="{html.escape(name)}" loading="lazy" /></div>
      <div class="doctor-info">
        <span class="branch-badge">{html.escape(ui.get("branchKz", city_label))}</span>
        <h1>{html.escape(name)}</h1>
        <div class="doctor-role">{html.escape(role)}</div>
        <div class="doctor-exp"><strong>Тәжірибе:</strong> {html.escape(ui.get("experienceKz", ""))}</div>
        <p class="doctor-lead">{html.escape(ui.get("leadKz", ""))}</p>
        <a href="https://wa.me/{wa_num}" target="_blank" rel="noopener" class="btn">Дәрігерге жазылу ({city_label})</a>
      </div>
    </div>
    <div class="stats-row">{stats_html}</div>
    <p class="intro-text">{html.escape(ui.get("bioKz", ""))}</p>
    <section class="section">
      <h2 class="section-title">Мамандану</h2>
      {specs}
    </section>
    <section class="section">
      <h2 class="section-title">Бағыттар</h2>
      <div class="tags-row">{tags}</div>
    </section>
    <div class="cta-block">
      <h2>{html.escape(name)} қабылдауына жазылу</h2>
      <p><strong>Мекенжай:</strong> {city_label}. <strong>Жазылу:</strong> <a href="tel:+77008880180" style="color:rgba(255,255,255,0.95);text-decoration:underline;">+7 700 888 01 80</a>, WhatsApp <a href="https://wa.me/{wa_num}" style="color:rgba(255,255,255,0.95);text-decoration:underline;">{wa_disp}</a></p>
      <a href="https://wa.me/{wa_num}" target="_blank" rel="noopener" class="btn">WhatsApp арқылы жазылу</a>
    </div>
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-col"><div class="footer-logo"><img src="/images/logo-asiakoz.png" alt="Азиякөз" class="logo-img" style="height:36px;" /></div><p class="footer-desc">Офтальмологиялық клиника. Алматы және Ақтау.</p></div>
        <div class="footer-col"><div class="footer-title">Навигация</div>
{FOOTER_NAV_KK}
        </div>
        <div class="footer-col"><div class="footer-title">Байланыс</div><p>Алматы: +7 700 888 01 80</p><a href="https://wa.me/{wa_num}" target="_blank" rel="noopener" class="link">WhatsApp</a></div>
      </div>
      <div class="footer-bottom"><p class="footer-disclaimer">Қарсы көрсеткіштер бар. Маман кеңесі қажет.</p><p class="footer-copy">© Азиякөз. Алматы, Ақтау.</p></div>
    </footer>
  </div>
  <script src="/js/compliance.js"></script>
</body>
</html>
<!-- kk-doctor-generated -->
"""


def main() -> None:
    ui_docs = json.loads(UI_FILE.read_text(encoding="utf-8"))
    meta_by_id = {}
    if DOCTORS_FILE.exists():
        data = json.loads(DOCTORS_FILE.read_text(encoding="utf-8"))
        meta_by_id = {d["id"]: d for d in data.get("doctors", [])}
    for ui in ui_docs:
        href = ui.get("profileUrlKz") or ui.get("profileUrl", "")
        if not href:
            continue
        path = ROOT / href.strip("/") / "index.html"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(render_page(ui, meta_by_id.get(ui["id"])), encoding="utf-8")
        print(f"write: {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
