#!/usr/bin/env python3
"""Ensure static pages have correct RU ↔ KK header language switch."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SKIP_PARTS = {
    "asiakoz-homepage",
    "node_modules",
    ".git",
    "assets",
    "videos",
    "data",
    "scripts",
}

SPA_SHELL_SLUGS = frozenset({"almaty", "aktau", "aqtau", "shymkent", "laser"})


def paired_paths(rel_s: str) -> tuple[str, str]:
    rel_s = rel_s.replace("\\", "/").strip("/")
    if not rel_s:
        return "/", "/kk/"
    if rel_s.startswith("kk/"):
        slug = rel_s[3:]
        ru = f"/{slug}/" if slug else "/"
        kk = f"/kk/{slug}/" if slug else "/kk/"
        return ru, kk
    return f"/{rel_s}/", f"/kk/{rel_s}/"


def lang_switch_block(ru_href: str, kk_href: str, *, active: str) -> str:
    label = "Тіл" if active == "kk" else "Язык"
    if active == "kk":
        return (
            f'<div class="lang-switch" role="group" aria-label="{label}">\n'
            f'          <a class="is-active" href="{kk_href}" hreflang="kk" aria-current="page">ҚАЗ</a>\n'
            f'          <a href="{ru_href}" hreflang="ru">РУС</a>\n'
            f"        </div>"
        )
    return (
        f'<div class="lang-switch" role="group" aria-label="{label}">\n'
        f'          <a href="{kk_href}" hreflang="kk">ҚАЗ</a>\n'
        f'          <a class="is-active" href="{ru_href}" hreflang="ru" aria-current="page">РУС</a>\n'
        f"        </div>"
    )


def should_patch(rel_s: str, html: str) -> bool:
    if 'id="root"' in html:
        return False
    if not re.search(r'hreflang=["\']kk-KZ["\']', html, re.I):
        return False
    rel = rel_s.replace("\\", "/").strip("/")
    if rel in SPA_SHELL_SLUGS:
        return False
    return True


def patch_lang_switch(html: str, rel_s: str) -> str:
    if not should_patch(rel_s, html):
        return html

    ru_href, kk_href = paired_paths(rel_s)
    rel = rel_s.replace("\\", "/").strip("/")
    active = "kk" if rel == "kk" or rel.startswith("kk/") else "ru"
    block = lang_switch_block(ru_href, kk_href, active=active)

    if 'class="lang-switch"' in html:
        return re.sub(
            r'<div class="lang-switch"[^>]*>.*?</div>',
            block,
            html,
            count=1,
            flags=re.DOTALL,
        )

    if 'class="header-right"' not in html:
        if 'class="site-header"' in html:
            return re.sub(r"(</header>)", rf"      {block}\n    \1", html, count=1)
        return html

    return re.sub(
        r'(<div class="header-right">\s*)',
        rf"\1{block}\n        ",
        html,
        count=1,
    )


STATIC_ROOT_ASSETS = frozenset({
    "favicon.ico",
    "favicon.png",
    "apple-touch-icon.png",
    "site.webmanifest",
})


def patch_kk_static_chrome(html: str, rel_s: str) -> str:
    """KK static pages: /kk/ nav, root assets, logo home."""
    rel = rel_s.replace("\\", "/").strip("/")
    if rel != "kk" and not rel.startswith("kk/"):
        return html
    if 'id="root"' in html:
        return html

    try:
        from site_nav import FOOTER_NAV_KK, HEADER_NAV_KK
    except ImportError:
        return html

    if 'class="header-nav"' in html:
        html = re.sub(
            r'<nav class="header-nav"[^>]*>.*?</nav>',
            HEADER_NAV_KK,
            html,
            count=1,
            flags=re.DOTALL,
        )

    if 'class="footer-nav"' in html or 'class="footer-links"' in html:
        html = re.sub(
            r'(<(?:div|nav) class="footer-(?:nav|links)"[^>]*>)(.*?)(</(?:div|nav)>)',
            lambda m: m.group(1) + "\n" + FOOTER_NAV_KK + "\n        " + m.group(3),
            html,
            count=1,
            flags=re.DOTALL,
        )

    html = html.replace('href="/kk/favicon', 'href="/favicon')
    html = html.replace('href="/kk/apple-touch-icon', 'href="/apple-touch-icon')
    html = html.replace('href="/kk/site.webmanifest', 'href="/site.webmanifest')
    html = re.sub(r'(<a href=")/(" class="logo")', r'\1/kk/\2', html, count=1)
    html = re.sub(r'href="/#', 'href="/kk/#', html)
    return html


def patch_ru_url_consistency(html: str, rel_s: str) -> str:
    """RU pages must not use /kk/ in canonical, og:url, or active language href."""
    rel = rel_s.replace("\\", "/").strip("/")
    if not rel or rel == "kk" or rel.startswith("kk/"):
        return html
    if 'id="root"' in html:
        return html

    site = "https://asiakoz.com"
    ru_url = f"{site}/{rel}/" if rel else f"{site}/"

    html = re.sub(
        r'(<link[^>]+rel=["\']canonical["\'][^>]+href=["\'])[^"\']+(["\'])',
        rf"\1{ru_url}\2",
        html,
        count=1,
        flags=re.I,
    )
    if re.search(r'property=["\']og:url["\']', html, re.I):
        html = re.sub(
            r'(property=["\']og:url["\'][^>]+content=["\'])[^"\']+(["\'])',
            rf"\1{ru_url}\2",
            html,
            count=1,
            flags=re.I,
        )
    return html


def patch_page_urls(html: str, rel_s: str) -> str:
    html = patch_lang_switch(html, rel_s)
    html = patch_kk_static_chrome(html, rel_s)
    html = patch_ru_url_consistency(html, rel_s)
    return html


def patch_all_lang_switches(root: Path | None = None) -> int:
    base = root or ROOT
    count = 0
    for path in sorted(base.rglob("index.html")):
        if any(p in SKIP_PARTS for p in path.parts):
            continue
        rel = path.parent.relative_to(base)
        rel_s = "" if str(rel) == "." else str(rel).replace("\\", "/")
        html = path.read_text(encoding="utf-8", errors="ignore")
        new = patch_page_urls(html, rel_s)
        if new != html:
            path.write_text(new, encoding="utf-8")
            count += 1
    if count:
        print(f"lang-switch patched: {count}")
    return count


if __name__ == "__main__":
    patch_all_lang_switches()
