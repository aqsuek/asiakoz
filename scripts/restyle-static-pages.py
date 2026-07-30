#!/usr/bin/env python3
"""Normalize static HTML chrome to SPA-like Almaty/Shymkent header/footer style."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

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
    "kk",
    "videos",
    "data",
    "scripts",
}

HEADER_NAV = """      <nav class="header-nav">
        <a href="/uslugi/">Услуги</a>
        <a href="/almaty/">Алматы</a>
        <a href="/aktau/">Актау</a>
        <a href="/doctors/">Врачи</a>
        <a href="/shymkent/">Шымкент</a>
      </nav>"""


def should_skip(path: Path) -> bool:
    return any(p in SKIP for p in path.parts)


def normalize_header(html: str) -> str:
    # Force sticky site-header class
    html = re.sub(r'<header class="header"', '<header class="site-header"', html)
    # Ensure logo uses absolute /images path when relative ../images
    html = html.replace('src="../images/logo.png"', 'src="/images/logo.png"')
    html = html.replace('href="../css/style.css"', 'href="/css/style.css"')
    html = html.replace('href="../images/logo.png"', 'href="/images/logo.png"')
    # Soft-replace cramped nav blocks with unified nav if classic header-nav present and missing branch links
    if 'class="header-nav"' in html and "/shymkent/" not in html.split('class="header-nav"', 1)[1][:500]:
        html = re.sub(
            r'<nav class="header-nav">[\s\S]*?</nav>',
            HEADER_NAV,
            html,
            count=1,
        )
    # Add spa-eyebrow before first h1 in seo-hero if missing
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
        if "noindex" in html.lower() and "http-equiv=\"refresh\"" in html.lower():
            continue
        if "/css/style.css" not in html and "css/style.css" not in html:
            continue
        new = normalize_header(html)
        if new != html:
            path.write_text(new, encoding="utf-8")
            n += 1
            print("styled:", path.relative_to(ROOT))
    print("normalized pages:", n)


if __name__ == "__main__":
    main()
