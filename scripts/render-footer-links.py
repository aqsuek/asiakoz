#!/usr/bin/env python3
"""Adds a "Branches and services" link block above the footer of every static page (RU/KK).

Why: Search Console showed ~85 pages "discovered, not indexed" — mostly Aktau/Shymkent
service pages and Kazakh pages with few internal links. A consistent block of links on
every page gives each of them many internal links. Runs at the end of build-seo.py.
"""

from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
START, END = "<!--city-links:start-->", "<!--city-links:end-->"
SKIP = {"node_modules", "graphify-out", "dist", "asiakoz-homepage", "asiakoz-admin", ".git", "admin"}

# (RU label, KK label, RU path, KK path)
CITIES = [
    ("Алматы", "Алматы", [
        ("Клиника в Алматы", "Алматыдағы клиника", "/almaty/", "/kk/almaty/"),
        ("Лазер SMILE", "SMILE лазері", "/laser/", "/kk/laser/"),
        ("Катаракта", "Катаракта", "/katarakta-almaty/", "/kk/katarakta-almaty/"),
        ("Глаукома", "Глаукома", "/glaukoma-almaty/", "/kk/glaukoma-almaty/"),
        ("Витрэктомия", "Витрэктомия", "/vitrektomiya-almaty/", "/kk/vitrektomiya-almaty/"),
        ("Косоглазие", "Қылилық", "/kosoglazie/", "/kk/kosoglazie/"),
        ("Детский офтальмолог", "Балалар офтальмологы", "/deti-almaty/", "/kk/deti-almaty/"),
        ("Проверка зрения", "Көру тексеру", "/diagnostika-almaty/", "/kk/diagnostika-almaty/"),
    ]),
    ("Актау", "Ақтау", [
        ("Клиника в Актау", "Ақтаудағы клиника", "/aktau/", "/kk/aqtau/"),
        ("Лазер SMILE", "SMILE лазері", "/lazer-aktau/", "/kk/lazer-aktau/"),
        ("Катаракта", "Катаракта", "/katarakta-aktau/", "/kk/katarakta-aktau/"),
        ("Глаукома", "Глаукома", "/glaukoma-aktau/", "/kk/glaukoma-aktau/"),
        ("Витрэктомия", "Витрэктомия", "/vitrektomiya-aktau/", "/kk/vitrektomiya-aktau/"),
        ("Косоглазие", "Қылилық", "/kosoglazie-aktau/", "/kk/kosoglazie-aktau/"),
        ("Детский офтальмолог", "Балалар офтальмологы", "/deti-aktau/", "/kk/deti-aktau/"),
        ("Проверка зрения", "Көру тексеру", "/diagnostika-aktau/", "/kk/diagnostika-aktau/"),
    ]),
    ("Шымкент", "Шымкент", [
        ("Клиника в Шымкенте", "Шымкенттегі клиника", "/shymkent/", "/kk/shymkent/"),
        ("Лазер LASIK и PRK", "LASIK және PRK лазері", "/lazer-shymkent/", "/kk/lazer-shymkent/"),
        ("Катаракта", "Катаракта", "/katarakta-shymkent/", "/kk/katarakta-shymkent/"),
        ("Глаукома", "Глаукома", "/glaukoma-shymkent/", "/kk/glaukoma-shymkent/"),
        ("Витрэктомия", "Витрэктомия", "/vitrektomiya-shymkent/", "/kk/vitrektomiya-shymkent/"),
        ("Косоглазие", "Қылилық", "/kosoglazie-shymkent/", "/kk/kosoglazie-shymkent/"),
        ("Детский офтальмолог", "Балалар офтальмологы", "/deti-shymkent/", "/kk/deti-shymkent/"),
        ("Проверка зрения", "Көру тексеру", "/diagnostika-shymkent/", "/kk/diagnostika-shymkent/"),
    ]),
]
EXTRA = [
    ("Врачи", "Дәрігерлер", "/doctors/", "/kk/doctors/"),
    ("Цены", "Бағалар", "/prices/", "/kk/prices/"),
    ("SMILE, LASIK или PRK", "SMILE, LASIK әлде PRK", "/smile-lasik-prk/", "/kk/smile-lasik-prk/"),
    ("Отзывы", "Пікірлер", "/otzyvy-asiakoz-almaty/", "/kk/otzyvy-asiakoz-almaty/"),
]

CSS = (
    "<style>.city-links{margin:32px 0 8px;padding:20px 0;border-top:1px solid rgba(15,23,42,.08)}"
    ".city-links h2{font-size:18px;margin:0 0 12px}.city-links .cl-grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}"
    ".city-links h3{font-size:15px;margin:0 0 6px}.city-links ul{list-style:none;margin:0;padding:0}"
    ".city-links li a{display:inline-block;padding:5px 0;font-size:14px;color:#33545e}.city-links li a:hover{color:#00839a}</style>"
)


def exists(path: str) -> bool:
    return (ROOT / path.strip("/") / "index.html").exists()


def block(lang: str) -> str:
    e = html.escape
    kk = lang == "kk"
    cols = []
    for ru_city, kk_city, items in CITIES:
        lis = "".join(
            f'<li><a href="{kk_p if kk else ru_p}">{e(kk_l if kk else ru_l)}</a></li>'
            for ru_l, kk_l, ru_p, kk_p in items
            if exists(kk_p if kk else ru_p)
        )
        cols.append(f'<div><h3>{e(kk_city if kk else ru_city)}</h3><ul>{lis}</ul></div>')
    lis = "".join(
        f'<li><a href="{kk_p if kk else ru_p}">{e(kk_l if kk else ru_l)}</a></li>'
        for ru_l, kk_l, ru_p, kk_p in EXTRA
        if exists(kk_p if kk else ru_p)
    )
    cols.append(f'<div><h3>{"AsiaKoz"}</h3><ul>{lis}</ul></div>')
    title = "Филиалдар мен қызметтер" if kk else "Филиалы и услуги"
    return f'{START}{CSS}<nav class="city-links" aria-label="{title}"><h2>{title}</h2><div class="cl-grid">{"".join(cols)}</div></nav>{END}'


def main() -> None:
    blocks = {"ru": block("ru"), "kk": block("kk")}
    n = 0
    for path in ROOT.rglob("index.html"):
        if any(p in SKIP for p in path.parts):
            continue
        t = path.read_text(encoding="utf-8")
        if 'id="root"' in t or "<footer" not in t or 'http-equiv="refresh"' in t or "noindex" in t.lower():
            continue
        lang = "kk" if '<html lang="kk"' in t else "ru"
        t2 = re.sub(re.escape(START) + r".*?" + re.escape(END), "", t, flags=re.S)
        i = t2.find("<footer")
        t2 = t2[:i] + blocks[lang] + "\n    " + t2[i:]
        if t2 != t:
            path.write_text(t2, encoding="utf-8")
            n += 1
    print(f"city links: {n} pages")


if __name__ == "__main__":
    main()
