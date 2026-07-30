#!/usr/bin/env python3
"""Fix technical SEO blockers that keep pages in GSC 'crawled - not indexed'."""

from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TODAY = date.today().isoformat()

BRANCH_SEO = {
    "almaty": {
        "url": "https://asiakoz.com/almaty/",
        "title": "AsiaKoz Алматы — офтальмологическая клиника",
        "description": (
            "Офтальмологическая клиника AsiaKoz в Алматы: диагностика, лазерная коррекция, "
            "катаракта, витрэктомия. Турецкие офтальмохирурги. Запись: +7 700 360 01 80."
        ),
        "og_description": (
            "Глазная клиника AsiaKoz в Алматы. Полная диагностика и хирургия глаза. "
            "Райымбека, 176А. WhatsApp +7 700 360 01 80."
        ),
        "build": "2026-07-30-almaty-seo-v1",
        "ld": {
            "name": "AsiaKoz Алматы",
            "alternateName": ["Азиякөз Алматы", "AsiaKoz Almaty"],
            "description": "Офтальмологическая клиника AsiaKoz в Алматы.",
            "telephone": ["+77003600180"],
            "streetAddress": "проспект Райымбека, 176А",
            "addressLocality": "Алматы",
            "latitude": 43.238,
            "longitude": 76.945,
            "sameAs": ["https://www.instagram.com/asiakoz.clinic/"],
        },
    },
    "aqtau": {
        "url": "https://asiakoz.com/aqtau/",
        "title": "AsiaKoz Актау — офтальмологическая клиника",
        "description": (
            "Офтальмологическая клиника AsiaKoz в Актау: диагностика, лазерная коррекция, "
            "катаракта, косоглазие. Турецкие врачи. Запись: +7 775 863 01 80."
        ),
        "og_description": (
            "Глазная клиника AsiaKoz в Актау. 7А мкр, 11/3. WhatsApp +7 775 863 01 80."
        ),
        "build": "2026-07-30-aqtau-seo-v1",
        "ld": {
            "name": "AsiaKoz Актау",
            "alternateName": ["Азиякөз Ақтау", "AsiaKoz Aktau"],
            "description": "Офтальмологическая клиника AsiaKoz в Актау.",
            "telephone": ["+77758630180"],
            "streetAddress": "7А микрорайон, 11/3",
            "addressLocality": "Актау",
            "latitude": 43.65118,
            "longitude": 51.14388,
            "sameAs": ["https://www.instagram.com/asiakoz.clinic/"],
        },
    },
    "laser": {
        "url": "https://asiakoz.com/laser/",
        "title": "Лазерная коррекция зрения в Алматы — AsiaKoz",
        "description": (
            "Лазерная коррекция зрения в Алматы у турецких офтальмохирургов AsiaKoz. "
            "Диагностика, подбор метода и запись: +7 700 360 01 80."
        ),
        "og_description": (
            "Лазерная коррекция зрения в AsiaKoz Алматы. Райымбека, 176А. WhatsApp +7 700 360 01 80."
        ),
        "build": "2026-07-30-laser-seo-v1",
        "ld": {
            "name": "AsiaKoz — лазерная коррекция",
            "alternateName": ["Азиякөз лазер", "AsiaKoz Laser"],
            "description": "Лазерная коррекция зрения в клинике AsiaKoz в Алматы.",
            "telephone": ["+77003600180"],
            "streetAddress": "проспект Райымбека, 176А",
            "addressLocality": "Алматы",
            "latitude": 43.238,
            "longitude": 76.945,
            "sameAs": ["https://www.instagram.com/asiakoz.clinic/"],
        },
    },
    "shymkent": {
        "url": "https://asiakoz.com/shymkent/",
        "title": "AsiaKoz Шымкент — офтальмологический центр (скоро открытие)",
        "description": (
            "AsiaKoz Шымкент — открытие скоро. Идёт предварительная запись. "
            "Диагностика и хирургия глаза. WhatsApp +7 708 075 01 80."
        ),
        "og_description": (
            "AsiaKoz Шымкент — скоро открытие. Предварительная запись: WhatsApp +7 708 075 01 80."
        ),
        "build": "2026-07-30-shymkent-seo-v1",
        "ld": {
            "name": "AsiaKoz Шымкент",
            "alternateName": ["Азиякөз Шымкент", "AsiaKoz Shymkent"],
            "description": "Офтальмологический центр AsiaKoz в Шымкенте. Скоро открытие.",
            "telephone": ["+77080750180", "+77080760180"],
            "streetAddress": "Байтұрсынов көшесі, 86/7, Тұран",
            "addressLocality": "Шымкент",
            "latitude": 42.341,
            "longitude": 69.597,
            "sameAs": ["https://www.instagram.com/asiakoz.shymkent/"],
        },
    },
}

# SPA doctor routes → real static doctor pages (avoid duplicate thin shells)
DOCTOR_CANONICAL = {
    "almaty/doctor/aliya": "https://asiakoz.com/doctor-aliya/",
    "almaty/doctor/mehmet-esat-teker": "https://asiakoz.com/doctor-mehmet-esat-teker/",
    "almaty/doctor/orel-talip": "https://asiakoz.com/doctor-orel/",
    "laser/doctor/mehmet-esat-teker": "https://asiakoz.com/doctor-mehmet-esat-teker/",
    "laser/doctor/orel-talip": "https://asiakoz.com/doctor-orel/",
    "aqtau/doctor/ali-keskin": "https://asiakoz.com/doctor-ali-keskin/",
    "aqtau/doctor/erol-joshkun": "https://asiakoz.com/doctor-erol/",
    "aqtau/doctor/nazgul-sagyndykova": "https://asiakoz.com/doctor-nazgul/",
    "shymkent/doctor/ali-keskin": "https://asiakoz.com/doctor-ali-keskin/",
    "shymkent/doctor/mehmet-esat-teker": "https://asiakoz.com/doctor-mehmet-esat-teker/",
}

SKIP_DIRS = {"asiakoz-homepage", ".git", "assets", "node_modules", "dist", "videos"}


def is_redirect(html: str) -> bool:
    low = html.lower()
    return 'http-equiv="refresh"' in low or "location.replace" in low


def ensure_noindex(html: str) -> str:
    if re.search(r'name=["\']robots["\']', html, re.I):
        return re.sub(
            r'(<meta\s+name=["\']robots["\']\s+content=["\'])[^"\']*(["\'])',
            r"\1noindex, follow\2",
            html,
            count=1,
            flags=re.I,
        )
    # Insert after charset or at start of <head>
    if re.search(r"<meta[^>]*charset=", html, re.I):
        return re.sub(
            r"(<meta[^>]*charset=[^>]*>)",
            r'\1\n  <meta name="robots" content="noindex, follow" />',
            html,
            count=1,
            flags=re.I,
        )
    return re.sub(
        r"(<head[^>]*>)",
        r'\1\n  <meta name="robots" content="noindex, follow" />',
        html,
        count=1,
        flags=re.I,
    )


def ensure_index_robots(html: str) -> str:
    if re.search(r'name=["\']robots["\']', html, re.I):
        # Don't override intentional noindex
        if re.search(r'name=["\']robots["\'][^>]*noindex', html, re.I):
            return html
        return re.sub(
            r'(<meta\s+name=["\']robots["\']\s+content=["\'])[^"\']*(["\'])',
            r"\1index, follow, max-image-preview:large\2",
            html,
            count=1,
            flags=re.I,
        )
    if re.search(r"<meta[^>]*charset=", html, re.I):
        return re.sub(
            r"(<meta[^>]*charset=[^>]*>)",
            r'\1\n  <meta name="robots" content="index, follow, max-image-preview:large" />',
            html,
            count=1,
            flags=re.I,
        )
    return re.sub(
        r"(<head[^>]*>)",
        r'\1\n  <meta name="robots" content="index, follow, max-image-preview:large" />',
        html,
        count=1,
        flags=re.I,
    )


def replace_attr(html: str, attr_pattern: str, value: str) -> str:
    return re.sub(attr_pattern, rf"\g<1>{value}\g<2>", html, count=1, flags=re.I | re.DOTALL)


def patch_branch_seo(path: Path, branch: str) -> None:
    seo = BRANCH_SEO[branch]
    ld = seo["ld"]
    html = path.read_text(encoding="utf-8")
    url = seo["url"]

    html = re.sub(r"<title>[^<]*</title>", f"<title>{seo['title']}</title>", html, count=1)
    html = replace_attr(
        html,
        r'(name="description"\s*\n?\s*content=")[^"]*(")',
        seo["description"],
    )
    html = replace_attr(html, r'(rel="canonical" href=")[^"]*(")', url)
    html = replace_attr(html, r'(property="og:title" content=")[^"]*(")', seo["title"])
    html = replace_attr(
        html,
        r'(property="og:description"\s*\n?\s*content=")[^"]*(")',
        seo["og_description"],
    )
    html = replace_attr(html, r'(property="og:url" content=")[^"]*(")', url)
    html = replace_attr(html, r'(name="twitter:title" content=")[^"]*(")', seo["title"])
    html = replace_attr(
        html,
        r'(name="twitter:description"\s*\n?\s*content=")[^"]*(")',
        seo["description"],
    )
    html = replace_attr(html, r'(name="asiakoz-build" content=")[^"]*(")', seo["build"])
    html = ensure_index_robots(html)

    ld_obj = {
        "@context": "https://schema.org",
        "@type": "MedicalClinic",
        "name": ld["name"],
        "alternateName": ld["alternateName"],
        "description": ld["description"],
        "url": url,
        "logo": "https://asiakoz.com/images/logo.png",
        "image": "https://asiakoz.com/images/logo.png",
        "telephone": ld["telephone"],
        "medicalSpecialty": "Ophthalmology",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": ld["streetAddress"],
            "addressLocality": ld["addressLocality"],
            "addressCountry": "KZ",
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": ld["latitude"],
            "longitude": ld["longitude"],
        },
        "sameAs": ld["sameAs"],
        "areaServed": {"@type": "City", "name": ld["addressLocality"]},
    }
    ld_block = json.dumps(ld_obj, ensure_ascii=False, indent=2)
    # indent for <head> readability
    ld_block = "\n".join(("      " + line if line else line) for line in ld_block.splitlines())
    html = re.sub(
        r'<script type="application/ld\+json">\s*\{.*?\}\s*</script>',
        f'<script type="application/ld+json">\n{ld_block}\n    </script>',
        html,
        count=1,
        flags=re.DOTALL,
    )

    # Lightweight crawlable content for SPA shells
    if 'id="root"' in html and "seo-static" not in html:
        city = ld["addressLocality"]
        phone = ld["telephone"][0]
        noscript = f"""
    <noscript class="seo-static">
      <h1>{seo['title']}</h1>
      <p>{seo['description']}</p>
      <p>Адрес: {ld['streetAddress']}, {city}</p>
      <p>Телефон: <a href="tel:{phone}">{phone}</a></p>
      <p><a href="https://asiakoz.com/">AsiaKoz</a> · <a href="https://asiakoz.com/uslugi/">Услуги</a> · <a href="https://asiakoz.com/doctors/">Врачи</a></p>
    </noscript>"""
        html = html.replace('<div id="root"></div>', f'<div id="root"></div>{noscript}')

    path.write_text(html, encoding="utf-8")


def patch_doctor_spa(path: Path, canonical: str) -> None:
    html = path.read_text(encoding="utf-8")
    html = ensure_noindex(html)
    html = replace_attr(html, r'(rel="canonical" href=")[^"]*(")', canonical)
    html = replace_attr(html, r'(property="og:url" content=")[^"]*(")', canonical)
    path.write_text(html, encoding="utf-8")


def fix_redirects() -> int:
    changed = 0
    for path in ROOT.rglob("*.html"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        html = path.read_text(encoding="utf-8")
        if not is_redirect(html):
            continue
        new_html = ensure_noindex(html)
        if new_html != html:
            path.write_text(new_html, encoding="utf-8")
            changed += 1
            print(f"noindex redirect: {path.relative_to(ROOT)}")
    return changed


def collect_indexable_urls() -> list[tuple[str, float]]:
    """Return (url, priority) for real indexable pages."""
    urls: list[tuple[str, float]] = [("https://asiakoz.com/", 1.0)]

    # Branch landings
    for branch, seo in BRANCH_SEO.items():
        if (ROOT / branch / "index.html").exists():
            urls.append((seo["url"], 0.95))

    # Static folder pages with real content (not redirects, not SPA doctor shells)
    for path in sorted(ROOT.rglob("index.html")):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        rel = path.parent.relative_to(ROOT)
        if str(rel) == ".":
            continue
        rel_s = str(rel).replace("\\", "/")
        # Skip SPA doctor shells
        if rel_s in DOCTOR_CANONICAL:
            continue
        # Skip branch roots already added
        if rel_s in BRANCH_SEO:
            continue
        html = path.read_text(encoding="utf-8")
        if is_redirect(html) or "noindex" in html.lower():
            continue
        # Skip nested SPA asset copies under branch that are not landings
        if any(rel_s.startswith(f"{b}/") for b in BRANCH_SEO):
            continue
        urls.append((f"https://asiakoz.com/{rel_s}/", 0.85 if "-almaty" in rel_s or rel_s.startswith("doctor-") else 0.8))

    # Deduplicate preserving order
    seen = set()
    out = []
    for url, pri in urls:
        if url in seen:
            continue
        seen.add(url)
        out.append((url, pri))
    return out


def write_sitemap(urls: list[tuple[str, float]]) -> None:
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for url, pri in urls:
        freq = "weekly" if pri >= 0.95 else "monthly"
        lines.extend(
            [
                "  <url>",
                f"    <loc>{url}</loc>",
                f"    <lastmod>{TODAY}</lastmod>",
                f"    <changefreq>{freq}</changefreq>",
                f"    <priority>{pri:.2f}</priority>",
                "  </url>",
            ]
        )
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"sitemap.xml: {len(urls)} URLs")


def patch_homepage_robots() -> None:
    path = ROOT / "index.html"
    if not path.exists():
        return
    html = path.read_text(encoding="utf-8")
    html = ensure_index_robots(html)
    if 'id="root"' in html and "seo-static" not in html:
        noscript = """
    <noscript class="seo-static">
      <h1>AsiaKoz — офтальмологические клиники · Алматы, Актау</h1>
      <p>Глазные клиники с турецкими офтальмохирургами. Работаем в Алматы и Актау. Шымкент — открытие скоро.</p>
      <p><a href="https://asiakoz.com/almaty/">Алматы</a> · <a href="https://asiakoz.com/aqtau/">Актау</a> · <a href="https://asiakoz.com/shymkent/">Шымкент</a></p>
      <p><a href="https://asiakoz.com/uslugi/">Услуги</a> · <a href="https://asiakoz.com/doctors/">Врачи</a></p>
    </noscript>"""
        html = html.replace('<div id="root"></div>', f'<div id="root"></div>{noscript}')
    path.write_text(html, encoding="utf-8")
    print("patched homepage robots + noscript")


def patch_static_indexables() -> int:
    """Add index robots meta to static landing pages missing it."""
    changed = 0
    for path in ROOT.rglob("index.html"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        rel = str(path.parent.relative_to(ROOT)).replace("\\", "/")
        if rel in BRANCH_SEO or rel in DOCTOR_CANONICAL or rel == ".":
            continue
        html = path.read_text(encoding="utf-8")
        if is_redirect(html) or "noindex" in html.lower():
            continue
        if any(rel.startswith(f"{b}/") for b in BRANCH_SEO):
            continue
        new_html = ensure_index_robots(html)
        if new_html != html:
            path.write_text(new_html, encoding="utf-8")
            changed += 1
    print(f"index robots on static pages: {changed}")
    return changed


def update_robots_txt() -> None:
    robots = ROOT / "robots.txt"
    text = robots.read_text(encoding="utf-8")
    block = """
# Soft-redirect / legacy stubs — keep crawlable for link equity, but prefer sitemap URLs
# Canonical + noindex are set on the HTML stubs themselves.
"""
    if "Soft-redirect" not in text:
        text = text.rstrip() + "\n" + block
    if "Sitemap:" not in text:
        text += "\nSitemap: https://asiakoz.com/sitemap.xml\n"
    robots.write_text(text, encoding="utf-8")
    print("updated robots.txt")


def main() -> None:
    print("=== SEO indexing fix ===")
    fix_redirects()

    for branch in BRANCH_SEO:
        index = ROOT / branch / "index.html"
        if index.exists():
            patch_branch_seo(index, branch)
            print(f"patched branch SEO: /{branch}/")

    for rel, canonical in DOCTOR_CANONICAL.items():
        path = ROOT / rel / "index.html"
        if path.exists():
            patch_doctor_spa(path, canonical)
            print(f"doctor SPA noindex → {canonical}: /{rel}/")

    patch_homepage_robots()
    patch_static_indexables()
    urls = collect_indexable_urls()
    write_sitemap(urls)
    update_robots_txt()
    print("done")


if __name__ == "__main__":
    main()
