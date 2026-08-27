#!/usr/bin/env python3
"""Normalize static HTML chrome to unified corporate homepage navigation."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from site_nav import HEADER_NAV_KK, HEADER_NAV_RU  # noqa: E402

SKIP = {
    "asiakoz-homepage",
    "node_modules",
    ".git",
    "assets",
    "aktau",
    "almaty",
    "shymkent",
    "laser",
    "aqtau",
    "videos",
    "data",
    "scripts",
}


def should_skip(path: Path) -> bool:
    return any(p in SKIP for p in path.parts)


def is_kk_page(path: Path) -> bool:
    rel = path.relative_to(ROOT)
    return str(rel).startswith("kk/")


def normalize_header(html: str, kk: bool) -> str:
    html = re.sub(r'<header class="header"', '<header class="site-header"', html)
    html = html.replace('src="../images/logo.png"', 'src="/images/logo.png"')
    html = html.replace('href="../css/style.css"', 'href="/css/style.css"')
    html = html.replace('href="../images/logo.png"', 'href="/images/logo.png"')
    nav = HEADER_NAV_KK if kk else HEADER_NAV_RU
    if 'class="header-nav"' in html:
        html = re.sub(
            r'<nav class="header-nav"[^>]*>[\s\S]*?</nav>',
            nav,
            html,
            count=1,
        )
    if "spa-eyebrow" not in html and 'class="seo-hero"' in html:
        html = html.replace(
            '<section class="seo-hero">',
            '<section class="seo-hero spa-hero">\n      <div class="spa-eyebrow">AsiaKoz</div>',
            1,
        )
    elif 'class="seo-hero"' in html and "spa-hero" not in html:
        html = html.replace('class="seo-hero"', 'class="seo-hero spa-hero"', 1)
    return html


def main() -> None:
    n = 0
    for path in sorted(ROOT.rglob("index.html")):
        if should_skip(path):
            continue
        html = path.read_text(encoding="utf-8", errors="ignore")
        if "noindex" in html.lower() and 'http-equiv="refresh"' in html.lower():
            continue
        if "/css/style.css" not in html and "css/style.css" not in html:
            continue
        new = normalize_header(html, is_kk_page(path))
        if new != html:
            path.write_text(new, encoding="utf-8")
            n += 1
            print("styled:", path.relative_to(ROOT))
    print("normalized pages:", n)


if __name__ == "__main__":
    main()
