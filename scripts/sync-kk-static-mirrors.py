#!/usr/bin/env python3
"""Create /kk/ mirrors for RU static HTML landings (SEO pages, legal, hubs)."""
from __future__ import annotations

import importlib.util
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

spec = importlib.util.spec_from_file_location("build_seo", ROOT / "scripts" / "build-seo.py")
build_seo = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build_seo)

SITE = build_seo.SITE
SKIP_DIRS = build_seo.SKIP_DIRS
inject_hreflang = build_seo.inject_hreflang
is_redirect = build_seo.is_redirect
set_canonical = build_seo.set_canonical
set_lang = build_seo.set_lang

STATIC_SKIP_PREFIXES = (
    "almaty/",
    "aktau/",
    "aqtau/",
    "shymkent/",
    "laser/",
    "doctors/",
    "uslugi/",
    "news/",
    "admin/",
    "assets/",
    "doctor-",
    "kk/",
)

KK_PHRASES: list[tuple[str, str]] = [
    ("Политика конфиденциальности", "Құпиялылық саясаты"),
    ("Пользовательское соглашение", "Пайдаланушы келісімі"),
    ("Главная", "Басты бет"),
    ("Услуги", "Қызметтер"),
    ("Врачи", "Дәрігерлер"),
    ("Контакты", "Байланыс"),
    ("Записаться", "Жазылу"),
    ("О клинике", "Клиника туралы"),
    ("Отзывы", "Пікірлер"),
    ("Наши врачи", "Біздің дәрігерлер"),
    ("Актау", "Ақтау"),
    ("в Алматы", "Алматыда"),
    ("в Актау", "Ақтауда"),
    ("в Шымкенте", "Шымкентте"),
    ("Косоглазие", "Қылилық"),
    ("Лазерная коррекция", "Лазерлік түзету"),
    ("Подробнее", "Толығырақ"),
    ("Часто задаваемые вопросы", "Жиі қойылатын сұрақтар"),
    ("Записаться в WhatsApp", "WhatsApp арқылы жазылу"),
    ("Позвонить", "Қоңырау шалу"),
    ("Последнее обновление", "Соңғы жаңарту"),
]


def should_mirror(rel_s: str, html: str) -> bool:
    if not rel_s or rel_s.startswith("kk/"):
        return False
    kk_path = ROOT / "kk" / rel_s / "index.html"
    if kk_path.exists():
        kk_html = kk_path.read_text(encoding="utf-8", errors="ignore")
        if '"@type": "FAQPage"' in kk_html and 'lang="kk"' in kk_html:
            return False
    if any(rel_s.startswith(p) for p in STATIC_SKIP_PREFIXES):
        return False
    if rel_s in {"almaty", "aktau", "aqtau", "shymkent", "laser", "doctors", "uslugi", "news"}:
        return False
    if is_redirect(html) or "noindex" in html.lower():
        return False
    if 'id="root"' in html:
        return False
    return True


def localize_html(html: str) -> str:
    for ru, kk in sorted(KK_PHRASES, key=lambda x: -len(x[0])):
        html = html.replace(ru, kk)
    return html


def fix_internal_links(html: str) -> str:
    def repl(m: re.Match) -> str:
        path = m.group(1)
        if path.startswith(("kk/", "http", "#", "tel:", "mailto:", "images/", "css/", "js/")):
            return m.group(0)
        return f'href="/kk/{path}"'

    html = re.sub(r'href="/([^"]*)"', repl, html)
    return html.replace('href="/kk/kk/', 'href="/kk/')


def sync_kk_static_mirrors() -> int:
    count = 0
    for path in sorted(ROOT.rglob("index.html")):
        if any(p in SKIP_DIRS for p in path.parts):
            continue
        rel = path.parent.relative_to(ROOT)
        rel_s = str(rel).replace("\\", "/")
        if rel_s == ".":
            continue
        html = path.read_text(encoding="utf-8")
        if not should_mirror(rel_s, html):
            continue
        kk_path = ROOT / "kk" / rel_s / "index.html"
        ru_url = f"{SITE}/{rel_s}/"
        kk_url = f"{SITE}/kk/{rel_s}/"
        kh = localize_html(html)
        kh = set_lang(kh, "kk")
        kh = set_canonical(kh, kk_url)
        kh = inject_hreflang(kh, ru_url, kk_url)
        kh = fix_internal_links(kh)
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
        kk_path.parent.mkdir(parents=True, exist_ok=True)
        kk_path.write_text(kh, encoding="utf-8")
        count += 1
    print(f"kk static mirrors synced: {count}")
    return count


def patch_ru_hreflang() -> int:
    count = 0
    for path in sorted(ROOT.rglob("index.html")):
        if any(p in SKIP_DIRS for p in path.parts):
            continue
        rel = path.parent.relative_to(ROOT)
        rel_s = str(rel).replace("\\", "/")
        if rel_s == "." or rel_s.startswith("kk/"):
            continue
        kk_path = ROOT / "kk" / rel_s / "index.html"
        if not kk_path.exists():
            continue
        html = path.read_text(encoding="utf-8")
        if is_redirect(html) or "noindex" in html.lower():
            continue
        ru_url = f"{SITE}/{rel_s}/"
        kk_url = f"{SITE}/kk/{rel_s}/"
        html = set_lang(html, "ru")
        html = inject_hreflang(html, ru_url, kk_url)
        path.write_text(html, encoding="utf-8")
        count += 1
    print(f"ru hreflang patched: {count}")
    return count


if __name__ == "__main__":
    sync_kk_static_mirrors()
    patch_ru_hreflang()
