#!/usr/bin/env python3
"""AsiaKoz technical SEO builder: sitemap, llms, hreflang, KK hubs, schema shells."""

from __future__ import annotations

import hashlib
import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://asiakoz.com"
TODAY = date.today().isoformat()
LASTMOD_CACHE = ROOT / "data" / "sitemap-lastmod.json"

SKIP_DIRS = {
    "asiakoz-homepage",
    ".git",
    "assets",
    "node_modules",
    "dist",
    "videos",
    "scripts",
    "data",
}

with (ROOT / "data" / "branches.json").open(encoding="utf-8") as f:
    BRANCHES_DATA = json.load(f)
BRANCHES = BRANCHES_DATA["branches"]
ORG = BRANCHES_DATA["organization"]

with (ROOT / "data" / "doctors.json").open(encoding="utf-8") as f:
    DOCTORS_DATA = json.load(f)
DOCTORS = DOCTORS_DATA["doctors"]

PAGE_META = {
    "home": {
        "ru": {
            "title": "AsiaKoz — турецкая глазная клиника в Алматы и Актау",
            "description": (
                "Диагностика и лечение зрения, лазерная коррекция и офтальмохирургия "
                "в клиниках AsiaKoz в Алматы и Актау. Шымкент — скоро открытие."
            ),
            "h1": "AsiaKoz — офтальмологические клиники",
            "lead": "Алматы и Актау — работают. Шымкент — скоро открытие.",
        },
        "kk": {
            "title": "AsiaKoz — Алматы мен Ақтаудағы түрік көз клиникасы",
            "description": (
                "AsiaKoz клиникаларында көру диагностикасы, лазерлік түзету және "
                "офтальмохирургия. Алматы мен Ақтау жұмыс істейді. Шымкент — жақында ашылады."
            ),
            "h1": "AsiaKoz — офтальмологиялық клиникалар",
            "lead": "Алматы мен Ақтау — жұмыс істейді. Шымкент — жақында ашылады.",
        },
    },
    "almaty": {
        "ru": {
            "title": "AsiaKoz Алматы — офтальмологическая клиника",
            "description": (
                "Глазная клиника AsiaKoz в Алматы: диагностика, лазерная коррекция, катаракта. "
                "Адрес: проспект Райымбека, 176А. Запись: +7 700 360 01 80."
            ),
            "h1": "AsiaKoz Алматы",
            "lead": "Офтальмологическая клиника. Лазерная коррекция, катаракта, диагностика.",
        },
        "kk": {
            "title": "AsiaKoz Алматы — офтальмологиялық клиника",
            "description": (
                "AsiaKoz Алматы көз клиникасы: диагностика, лазерлік түзету, катаракта. "
                "Мекенжайы: Райымбек даңғылы, 176А. Жазылу: +7 700 360 01 80."
            ),
            "h1": "AsiaKoz Алматы",
            "lead": "Офтальмологиялық клиника. Лазерлік түзету, катаракта, диагностика.",
        },
    },
    "aqtau": {
        "ru": {
            "title": "AsiaKoz Актау — офтальмологическая клиника",
            "description": (
                "Глазная клиника AsiaKoz в Актау: диагностика, катаракта, косоглазие. "
                "Адрес: 7А микрорайон, 11/3. Запись: +7 775 863 01 80."
            ),
            "h1": "AsiaKoz Актау",
            "lead": "Офтальмологическая клиника. Катаракта, сетчатка, детская офтальмология.",
        },
        "kk": {
            "title": "AsiaKoz Ақтау — офтальмологиялық клиника",
            "description": (
                "AsiaKoz Ақтау көз клиникасы: диагностика, катаракта, қылилық. "
                "Мекенжайы: 7А шағынауданы, 11/3. Жазылу: +7 775 863 01 80."
            ),
            "h1": "AsiaKoz Ақтау",
            "lead": "Офтальмологиялық клиника. Катаракта, тор қабық, балалар офтальмологиясы.",
        },
    },
    "shymkent": {
        "ru": {
            "title": "AsiaKoz Шымкент — скоро открытие | Предварительная запись",
            "description": (
                "Новый филиал AsiaKoz в Шымкенте. Адрес, контакты и предварительная запись в WhatsApp."
            ),
            "h1": "AsiaKoz Шымкент — скоро открытие",
            "lead": "Скоро открытие. Идёт предварительная запись.",
        },
        "kk": {
            "title": "AsiaKoz Шымкент — жақында ашылады | Алдын ала жазылу",
            "description": (
                "AsiaKoz-тың Шымкенттегі жаңа филиалы. Мекенжай, байланыс және WhatsApp арқылы алдын ала жазылу."
            ),
            "h1": "AsiaKoz Шымкент — жақында ашылады",
            "lead": "Жақында ашылады. Алдын ала жазылу жүріп жатыр.",
        },
    },
    "doctors": {
        "ru": {
            "title": "Врачи-офтальмологи AsiaKoz — Алматы и Актау",
            "description": (
                "Офтальмологи и офтальмохирурги клиники AsiaKoz в Алматы и Актау. "
                "Выберите врача и запишитесь через WhatsApp."
            ),
            "h1": "Врачи AsiaKoz",
            "lead": "Приём в Алматы и Актау. Шымкент — скоро открытие.",
        },
        "kk": {
            "title": "AsiaKoz дәрігер-офтальмологтары — Алматы және Ақтау",
            "description": (
                "AsiaKoz клиникасының офтальмологтары мен офтальмохирургтері Алматы мен Ақтауда. "
                "Дәрігерді таңдап, WhatsApp арқылы жазылыңыз."
            ),
            "h1": "AsiaKoz дәрігерлері",
            "lead": "Қабылдау Алматы мен Ақтауда. Шымкент — жақында ашылады.",
        },
    },
    "uslugi": {
        "ru": {
            "title": "Услуги офтальмологической клиники AsiaKoz",
            "description": (
                "Диагностика, лазерная коррекция, катаракта, глаукома, витрэктомия и другие услуги AsiaKoz."
            ),
            "h1": "Услуги AsiaKoz",
            "lead": "Основные направления диагностики и лечения зрения.",
        },
        "kk": {
            "title": "AsiaKoz офтальмологиялық клиникасының қызметтері",
            "description": (
                "Диагностика, лазерлік түзету, катаракта, глаукома, витрэктомия және AsiaKoz-тың басқа қызметтері."
            ),
            "h1": "AsiaKoz қызметтері",
            "lead": "Көру диагностикасы мен емдеудің негізгі бағыттары.",
        },
    },
}


def load_lastmod() -> dict:
    if LASTMOD_CACHE.exists():
        return json.loads(LASTMOD_CACHE.read_text(encoding="utf-8"))
    return {}


def save_lastmod(data: dict) -> None:
    LASTMOD_CACHE.parent.mkdir(parents=True, exist_ok=True)
    LASTMOD_CACHE.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def content_hash(text: str) -> str:
    # Ignore volatile build ids / asset hashes in lastmod fingerprint
    cleaned = re.sub(r'asiakoz-build" content="[^"]*"', "", text)
    cleaned = re.sub(r"/assets/[^\"'\s]+", "", cleaned)
    cleaned = re.sub(r"index-[A-Za-z0-9_-]+\.(js|css)", "", cleaned)
    return hashlib.sha1(cleaned.encode("utf-8")).hexdigest()[:16]


def lastmod_for(url: str, html: str, cache: dict) -> str:
    h = content_hash(html)
    prev = cache.get(url)
    if prev and prev.get("hash") == h:
        return prev["lastmod"]
    cache[url] = {"hash": h, "lastmod": TODAY}
    return TODAY


def is_redirect(html: str) -> bool:
    low = html.lower()
    return 'http-equiv="refresh"' in low or "location.replace" in low


def ensure_robots(html: str, value: str) -> str:
    if re.search(r'name=["\']robots["\']', html, re.I):
        return re.sub(
            r'(<meta\s+name=["\']robots["\']\s+content=["\'])[^"\']*(["\'])',
            rf"\1{value}\2",
            html,
            count=1,
            flags=re.I,
        )
    return re.sub(
        r"(<meta[^>]*charset=[^>]*>)",
        rf'\1\n  <meta name="robots" content="{value}" />',
        html,
        count=1,
        flags=re.I,
    )


def upsert_link(html: str, rel: str, href: str, hreflang: str | None = None) -> str:
    if hreflang:
        pattern = rf'<link[^>]+hreflang=["\']{re.escape(hreflang)}["\'][^>]*>'
        tag = f'<link rel="{rel}" hreflang="{hreflang}" href="{href}" />'
    else:
        pattern = rf'<link[^>]+rel=["\']{re.escape(rel)}["\'][^>]*>'
        tag = f'<link rel="{rel}" href="{href}" />'
    if re.search(pattern, html, re.I):
        return re.sub(pattern, tag, html, count=1, flags=re.I)
    return re.sub(r"(<link rel=[\"']canonical[\"'][^>]*>)", rf"\1\n    {tag}", html, count=1, flags=re.I)


def set_canonical(html: str, url: str) -> str:
    if re.search(r'rel=["\']canonical["\']', html, re.I):
        return re.sub(
            r'(rel=["\']canonical["\']\s+href=["\'])[^"\']*(["\'])',
            rf"\1{url}\2",
            html,
            count=1,
            flags=re.I,
        )
    return re.sub(
        r"(<title>[^<]*</title>)",
        rf'\1\n  <link rel="canonical" href="{url}" />',
        html,
        count=1,
        flags=re.I,
    )


def set_lang(html: str, lang: str) -> str:
    return re.sub(r'(<html[^>]*lang=["\'])[^"\']*(["\'])', rf"\1{lang}\2", html, count=1, flags=re.I)


def replace_title_desc(html: str, title: str, description: str) -> str:
    html = re.sub(r"<title>[^<]*</title>", f"<title>{title}</title>", html, count=1)
    html = re.sub(
        r'(name="description"\s*\n?\s*content=")[^"]*(")',
        rf"\1{description}\2",
        html,
        count=1,
        flags=re.I | re.DOTALL,
    )
    html = re.sub(
        r'(property="og:title" content=")[^"]*(")',
        rf"\1{title}\2",
        html,
        count=1,
        flags=re.I,
    )
    html = re.sub(
        r'(property="og:description"\s*\n?\s*content=")[^"]*(")',
        rf"\1{description}\2",
        html,
        count=1,
        flags=re.I | re.DOTALL,
    )
    html = re.sub(
        r'(name="twitter:title" content=")[^"]*(")',
        rf"\1{title}\2",
        html,
        count=1,
        flags=re.I,
    )
    html = re.sub(
        r'(name="twitter:description"\s*\n?\s*content=")[^"]*(")',
        rf"\1{description}\2",
        html,
        count=1,
        flags=re.I | re.DOTALL,
    )
    return html


def hreflang_block(ru_url: str, kk_url: str) -> str:
    return "\n".join(
        [
            f'    <link rel="alternate" hreflang="ru-KZ" href="{ru_url}" />',
            f'    <link rel="alternate" hreflang="kk-KZ" href="{kk_url}" />',
            f'    <link rel="alternate" hreflang="x-default" href="{ru_url}" />',
        ]
    )


def inject_hreflang(html: str, ru_url: str, kk_url: str) -> str:
    # remove old alternate hreflang
    html = re.sub(r'\s*<link[^>]+hreflang=["\'][^"\']+["\'][^>]*>', "", html, flags=re.I)
    block = hreflang_block(ru_url, kk_url)
    if re.search(r'rel=["\']canonical["\']', html, re.I):
        return re.sub(
            r'(<link[^>]+rel=["\']canonical["\'][^>]*>)',
            rf"\1\n{block}",
            html,
            count=1,
            flags=re.I,
        )
    return re.sub(r"(</head>)", rf"{block}\n  \1", html, count=1, flags=re.I)


def branch_by_id(bid: str) -> dict:
    return next(b for b in BRANCHES if b["id"] == bid)


def branch_dir_name(branch_id: str) -> str:
    return "aktau" if branch_id == "aqtau" else branch_id



def schema_organization() -> dict:
    active = [b for b in BRANCHES if b["status"] == "active"]
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": f"{SITE}/#organization",
                "name": ORG["name"],
                "alternateName": ORG["alternateName"],
                "url": f"{SITE}/",
                "logo": ORG["logo"],
                "sameAs": ORG["sameAs"],
                "contactPoint": [
                    {
                        "@type": "ContactPoint",
                        "telephone": f"+{b['phoneRaw']}",
                        "contactType": "customer service",
                        "areaServed": b["cityRu"],
                        "availableLanguage": ["ru", "kk"],
                    }
                    for b in active
                ],
                "department": [
                    {"@id": f"{SITE}{b['pageHref']}#clinic"} for b in active
                ],
            },
            {
                "@type": "WebSite",
                "@id": f"{SITE}/#website",
                "url": f"{SITE}/",
                "name": ORG["name"],
                "publisher": {"@id": f"{SITE}/#organization"},
                "inLanguage": ["ru-KZ", "kk-KZ"],
            },
        ],
    }


def schema_clinic(branch: dict, lang: str) -> dict:
    name = branch["nameRu"] if lang == "ru" else branch["nameKz"]
    address = branch["addressRu"] if lang == "ru" else branch["addressKz"]
    url = f"{SITE}{branch['pageHref']}" if lang == "ru" else f"{SITE}{branch['kkHref']}"
    node: dict = {
        "@type": ["MedicalClinic", "LocalBusiness"],
        "@id": f"{SITE}{branch['pageHref']}#clinic",
        "name": name,
        "url": url,
        "telephone": f"+{branch['phoneRaw']}",
        "image": ORG["logo"],
        "parentOrganization": {"@id": f"{SITE}/#organization"},
        "address": {
            "@type": "PostalAddress",
            "streetAddress": address,
            "addressLocality": branch["cityRu"] if lang == "ru" else branch["cityKz"],
            "addressCountry": "KZ",
        },
        "medicalSpecialty": "https://schema.org/Ophthalmology",
        "sameAs": [branch["instagram"]["url"]],
    }
    if branch.get("geo"):
        node["geo"] = {
            "@type": "GeoCoordinates",
            "latitude": branch["geo"]["latitude"],
            "longitude": branch["geo"]["longitude"],
        }
    hours = branch.get("hoursRu") if lang == "ru" else branch.get("hoursKz")
    if hours:
        # Keep textual hours only — structured openingHoursSpecification needs confirmed split days
        node["openingHours"] = hours
    return {
        "@context": "https://schema.org",
        "@graph": [
            node,
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "AsiaKoz", "item": f"{SITE}/"},
                    {"@type": "ListItem", "position": 2, "name": name, "item": url},
                ],
            },
        ],
    }


def schema_shymkent(lang: str) -> dict:
    b = branch_by_id("shymkent")
    name = b["nameRu"] if lang == "ru" else b["nameKz"]
    url = f"{SITE}{b['pageHref']}" if lang == "ru" else f"{SITE}{b['kkHref']}"
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": f"{url}#webpage",
                "name": name,
                "url": url,
                "description": b["statusTextRu"] if lang == "ru" else b["statusTextKz"],
                "isPartOf": {"@id": f"{SITE}/#website"},
                "about": {
                    "@type": "Place",
                    "name": name,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": b["addressRu"] if lang == "ru" else b["addressKz"],
                        "addressLocality": b["cityRu"],
                        "addressCountry": "KZ",
                    },
                },
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "AsiaKoz", "item": f"{SITE}/"},
                    {"@type": "ListItem", "position": 2, "name": name, "item": url},
                ],
            },
        ],
    }


def put_jsonld(html: str, data: dict) -> str:
    block = json.dumps(data, ensure_ascii=False, indent=2)
    indented = "\n".join(("      " + line if line else line) for line in block.splitlines())
    script = f'<script type="application/ld+json">\n{indented}\n    </script>'
    if re.search(r'<script type="application/ld\+json">', html, re.I):
        return re.sub(
            r'<script type="application/ld\+json">\s*[\s\S]*?</script>',
            script,
            html,
            count=1,
            flags=re.I,
        )
    return re.sub(r"(</head>)", rf"    {script}\n  \1", html, count=1, flags=re.I)


def crawlable_block(branch_id: str | None, lang: str, page_key: str) -> str:
    meta = PAGE_META[page_key][lang]
    lines = [
        f'<section class="seo-static" data-seo-static="1">',
        f"  <h1>{meta['h1']}</h1>",
        f"  <p>{meta['lead']}</p>",
    ]
    if branch_id:
        b = branch_by_id(branch_id)
        addr = b["addressRu"] if lang == "ru" else b["addressKz"]
        phone = b["phone"]
        wa = b["whatsapp"]
        status = b.get("statusTextRu" if lang == "ru" else "statusTextKz") if b["status"] != "active" else None
        if status:
            lines.append(f"  <p><strong>{status}</strong></p>")
        lines.append(f"  <p>{addr}</p>")
        lines.append(f'  <p><a href="tel:+{b["phoneRaw"]}">{phone}</a> · <a href="{wa}">WhatsApp</a></p>')
        if b.get("gis", {}).get("searchUrl"):
            map_label = "Карта" if lang == "ru" else "Карта"
            lines.append(f'  <p><a href="{b["gis"]["searchUrl"]}">{map_label}</a></p>')
        # doctors for city
        docs = [d for d in DOCTORS if branch_id in d.get("cities", [])]
        if docs:
            label = "Врачи" if lang == "ru" else "Дәрігерлер"
            lines.append(f"  <h2>{label}</h2><ul>")
            for d in docs:
                name = d["nameRu"] if lang == "ru" else d["nameKz"]
                href = d["href"] if lang == "ru" else d.get("kkHref", d["href"])
                lines.append(f'    <li><a href="{href}">{name}</a></li>')
            lines.append("  </ul>")
        elif b["status"] != "active":
            msg = (
                "Приём врачей откроется вместе с филиалом."
                if lang == "ru"
                else "Дәрігерлер қабылдауы филиал ашылғанда басталады."
            )
            lines.append(f"  <p>{msg}</p>")
    # nav
    if lang == "ru":
        lines.append(
            '  <p><a href="/almaty/">Алматы</a> · <a href="/aktau/">Актау</a> · '
            '<a href="/shymkent/">Шымкент</a> · <a href="/uslugi/">Услуги</a> · '
            '<a href="/doctors/">Врачи</a></p>'
        )
    else:
        lines.append(
            '  <p><a href="/kk/almaty/">Алматы</a> · <a href="/kk/aqtau/">Ақтау</a> · '
            '<a href="/kk/shymkent/">Шымкент</a> · <a href="/kk/uslugi/">Қызметтер</a> · '
            '<a href="/kk/doctors/">Дәрігерлер</a></p>'
        )
    lines.append("</section>")
    return "\n    ".join(lines)


def inject_seo_static(html: str, block: str) -> str:
    html = re.sub(
        r'\s*<noscript class="seo-static">[\s\S]*?</noscript>',
        "",
        html,
        flags=re.I,
    )
    html = re.sub(
        r'\s*<section class="seo-static"[^>]*>[\s\S]*?</section>',
        "",
        html,
        flags=re.I,
    )
    # Prefer visible crawlable section before #root for non-JS crawlers that skip noscript quirks
    if 'id="root"' in html:
        return html.replace(
            '<div id="root"></div>',
            f'<div id="root"></div>\n    <noscript>\n    {block}\n    </noscript>',
        )
    if "<body" in html.lower():
        return re.sub(r"(<body[^>]*>)", rf"\1\n    {block}", html, count=1, flags=re.I)
    return html + block


def patch_spa_shell(path: Path, page_key: str, lang: str, branch_id: str | None, ru_url: str, kk_url: str) -> None:
    html = path.read_text(encoding="utf-8")
    meta = PAGE_META[page_key][lang]
    canonical = ru_url if lang == "ru" else kk_url
    html = set_lang(html, "ru" if lang == "ru" else "kk")
    html = ensure_robots(html, "index, follow, max-image-preview:large")
    html = replace_title_desc(html, meta["title"], meta["description"])
    html = set_canonical(html, canonical)
    html = inject_hreflang(html, ru_url, kk_url)
    html = re.sub(
        r'(property="og:url" content=")[^"]*(")',
        rf"\1{canonical}\2",
        html,
        count=1,
        flags=re.I,
    )
    if page_key == "home":
        html = put_jsonld(html, schema_organization())
    elif page_key == "shymkent":
        html = put_jsonld(html, schema_shymkent(lang))
    elif branch_id in ("almaty", "aqtau"):
        html = put_jsonld(html, schema_clinic(branch_by_id(branch_id), lang))
    html = inject_seo_static(html, crawlable_block(branch_id, lang, page_key))
    path.write_text(html, encoding="utf-8")


def write_kk_hub_from_ru(ru_path: Path, kk_path: Path, page_key: str, branch_id: str | None, ru_url: str, kk_url: str) -> None:
    """Create indexable KK hub as static HTML (no SPA JS — avoids /kk base-path breakage)."""
    kk_path.parent.mkdir(parents=True, exist_ok=True)
    meta = PAGE_META[page_key]["kk"]
    b = branch_by_id(branch_id) if branch_id else None
    schema = None
    if page_key == "home":
        schema = schema_organization()
    elif page_key == "shymkent":
        schema = schema_shymkent("kk")
    elif branch_id in ("almaty", "aqtau"):
        schema = schema_clinic(branch_by_id(branch_id), "kk")

    schema_html = ""
    if schema:
        block = json.dumps(schema, ensure_ascii=False, indent=2)
        schema_html = f'<script type="application/ld+json">\n{block}\n  </script>'

    wa = b["whatsapp"] if b else "https://wa.me/77003600180"
    cta = "Алдын ала жазылу" if branch_id == "shymkent" else "WhatsApp арқылы жазылу"

    html = f"""<!DOCTYPE html>
<html lang="kk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="theme-color" content="#00A9C1" />
  <title>{meta['title']}</title>
  <meta name="description" content="{meta['description']}" />
  <link rel="canonical" href="{kk_url}" />
{hreflang_block(ru_url, kk_url)}
  <meta property="og:site_name" content="AsiaKoz" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="kk_KZ" />
  <meta property="og:title" content="{meta['title']}" />
  <meta property="og:description" content="{meta['description']}" />
  <meta property="og:url" content="{kk_url}" />
  <meta property="og:image" content="{SITE}/images/logo.png" />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="stylesheet" href="/css/style.css" />
  {schema_html}
</head>
<body>
  <div class="container">
    <header class="header">
      <a href="/kk/" class="logo" title="AsiaKoz"><img src="/images/logo.png" alt="AsiaKoz" class="logo-img" /></a>
      <nav class="header-nav">
        <a href="/kk/almaty/">Алматы</a>
        <a href="/kk/aqtau/">Ақтау</a>
        <a href="/kk/shymkent/">Шымкент</a>
        <a href="/kk/uslugi/">Қызметтер</a>
        <a href="/kk/doctors/">Дәрігерлер</a>
        <a href="{ru_url}" hreflang="ru">RU</a>
      </nav>
    </header>
    <nav class="breadcrumb"><a href="/kk/">Басты бет</a> / {meta['h1']}</nav>
    {crawlable_block(branch_id, "kk", page_key)}
    <p><a class="btn" href="{wa}" target="_blank" rel="noopener">{cta}</a></p>
    <p><a href="{ru_url}">Орысша нұсқа / RU</a></p>
  </div>
  <script src="/js/compliance.js"></script>
</body>
</html>
"""
    kk_path.write_text(html, encoding="utf-8")
    print(f"kk hub: {kk_path.relative_to(ROOT)}")


def fix_redirect_stubs() -> None:
    for path in ROOT.rglob("*.html"):
        if any(p in SKIP_DIRS for p in path.parts):
            continue
        html = path.read_text(encoding="utf-8")
        if not is_redirect(html):
            continue
        new_html = ensure_robots(html, "noindex, follow")
        if new_html != html:
            path.write_text(new_html, encoding="utf-8")


def write_aktau_alias() -> None:
    """Soft fallback if server redirects are unavailable.
    /aqtau/ -> /aktau/ and /kk/aktau/ -> /kk/aqtau/
    """
    ru = ROOT / "aqtau" / "index.html"
    ru.parent.mkdir(parents=True, exist_ok=True)
    ru.write_text(
        """<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="robots" content="noindex, follow" />
  <link rel="canonical" href="https://asiakoz.com/aktau/" />
  <meta http-equiv="refresh" content="0; url=/aktau/" />
  <title>Перенаправление — AsiaKoz Актау</title>
  <script>location.replace("/aktau/");</script>
</head>
<body>
  <p><a href="/aktau/">AsiaKoz Актау</a></p>
</body>
</html>
""",
        encoding="utf-8",
    )

    kk = ROOT / "kk" / "aktau" / "index.html"
    kk.parent.mkdir(parents=True, exist_ok=True)
    kk.write_text(
        """<!DOCTYPE html>
<html lang="kk">
<head>
  <meta charset="UTF-8" />
  <meta name="robots" content="noindex, follow" />
  <link rel="canonical" href="https://asiakoz.com/kk/aqtau/" />
  <meta http-equiv="refresh" content="0; url=/kk/aqtau/" />
  <title>Басқа бетке өту — AsiaKoz Ақтау</title>
  <script>location.replace("/kk/aqtau/");</script>
</head>
<body>
  <p><a href="/kk/aqtau/">AsiaKoz Ақтау</a></p>
</body>
</html>
""",
        encoding="utf-8",
    )


def write_llms() -> None:
    active = [b for b in BRANCHES if b["status"] == "active"]
    soon = branch_by_id("shymkent")
    lines = [
        "# AsiaKoz",
        "",
        "> Официальный сайт офтальмологической сети AsiaKoz (Азиякөз) в Казахстане.",
        "",
        f"Сайт: {SITE}/",
        f"Sitemap: {SITE}/sitemap.xml",
        f"Политика конфиденциальности: {SITE}/politika-konfidentsialnosti/",
        "",
        "## Статус филиалов",
        "",
        "- Алматы — работает",
        "- Актау — работает",
        "- Шымкент — скоро открытие, идёт предварительная запись",
        "",
        "## Филиалы",
        "",
    ]
    for b in active:
        lines.append(f"- {b['nameRu']}: {b['addressRu']}, тел. {b['phone']}, WhatsApp {b['whatsapp']}")
        lines.append(f"  - RU: {SITE}{b['pageHref']}")
        lines.append(f"  - KK: {SITE}{b['kkHref']}")
    lines.append(
        f"- {soon['nameRu']} ({soon['statusTextRu']}): {soon['addressRu']}, тел. {soon['phone']}, WhatsApp {soon['whatsapp']}"
    )
    lines.append(f"  - RU: {SITE}{soon['pageHref']}")
    lines.append(f"  - KK: {SITE}{soon['kkHref']}")
    lines.extend(
        [
            "",
            "## Услуги",
            "",
            f"- {SITE}/uslugi/",
            f"- {SITE}/kk/uslugi/",
            f"- {SITE}/lazer-almaty/",
            f"- {SITE}/katarakta-almaty/",
            f"- {SITE}/glaukoma-almaty/",
            f"- {SITE}/vitrektomiya-almaty/",
            f"- {SITE}/kosoglazie/",
            f"- {SITE}/kosoglazie-aktau/",
            "",
            "## Врачи",
            "",
            f"- {SITE}/doctors/",
            f"- {SITE}/kk/doctors/",
        ]
    )
    for d in DOCTORS:
        cities = ", ".join(d["cities"])
        lines.append(f"- {d['nameRu']} ({cities}): {SITE}{d['href']}")
    lines.extend(
        [
            "",
            "## Контакты",
            "",
        ]
    )
    for b in active:
        lines.append(f"- {b['cityRu']}: {b['phone']} / {b['whatsapp']}")
    lines.append(f"- Instagram: {ORG['sameAs'][0]}")
    lines.append(f"- Шымкент Instagram: {soon['instagram']['url']}")
    (ROOT / "llms.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")


def collect_urls(lastmod_cache: dict) -> list[tuple[str, str, float]]:
    urls: list[tuple[str, str, float]] = []

    def add(url: str, path: Path | None, priority: float):
        html = path.read_text(encoding="utf-8") if path and path.exists() else url
        if path and path.exists():
            if is_redirect(html) or "noindex" in html.lower():
                return
        lm = lastmod_for(url, html if isinstance(html, str) else "", lastmod_cache)
        urls.append((url, lm, priority))

    add(f"{SITE}/", ROOT / "index.html", 1.0)
    add(f"{SITE}/kk/", ROOT / "kk" / "index.html", 0.95)

    for b in BRANCHES:
        add(f"{SITE}{b['pageHref']}", ROOT / branch_dir_name(b["id"]) / "index.html", 0.95)
        add(f"{SITE}{b['kkHref']}", ROOT / "kk" / b["id"] / "index.html", 0.9)

    for key in ("doctors", "uslugi"):
        add(f"{SITE}/{key}/", ROOT / key / "index.html", 0.9)
        add(f"{SITE}/kk/{key}/", ROOT / "kk" / key / "index.html", 0.85)

    for d in DOCTORS:
        add(f"{SITE}{d['href']}", ROOT / d["slug"] / "index.html", 0.85)

    # Static medical landings (RU only for now)
    for path in sorted(ROOT.rglob("index.html")):
        if any(p in SKIP_DIRS for p in path.parts):
            continue
        rel = path.parent.relative_to(ROOT)
        if str(rel) == ".":
            continue
        rel_s = str(rel).replace("\\", "/")
        if rel_s.startswith("kk/"):
            continue
        if rel_s in {b["id"] for b in BRANCHES} or rel_s in {"doctors", "uslugi", "aktau", "aqtau", "laser"}:
            continue
        if any(rel_s.startswith(f"{b['id']}/") for b in BRANCHES) or rel_s.startswith("laser/"):
            continue
        html = path.read_text(encoding="utf-8")
        if is_redirect(html) or "noindex" in html.lower():
            continue
        add(f"{SITE}/{rel_s}/", path, 0.8)

    # laser promo
    add(f"{SITE}/laser/", ROOT / "laser" / "index.html", 0.9)

    # dedupe
    seen = set()
    out = []
    for u, lm, p in urls:
        if u in seen:
            continue
        seen.add(u)
        out.append((u, lm, p))
    return out


def write_sitemap(entries: list[tuple[str, str, float]]) -> None:
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for url, lm, pri in entries:
        freq = "weekly" if pri >= 0.9 else "monthly"
        lines.extend(
            [
                "  <url>",
                f"    <loc>{url}</loc>",
                f"    <lastmod>{lm}</lastmod>",
                f"    <changefreq>{freq}</changefreq>",
                f"    <priority>{pri:.2f}</priority>",
                "  </url>",
            ]
        )
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"sitemap: {len(entries)} urls")


def patch_static_hreflang_hubs() -> None:
    pairs = [
        ("doctors", ROOT / "doctors" / "index.html", ROOT / "kk" / "doctors" / "index.html"),
        ("uslugi", ROOT / "uslugi" / "index.html", ROOT / "kk" / "uslugi" / "index.html"),
    ]
    for key, ru_path, kk_path in pairs:
        if not ru_path.exists():
            continue
        ru_url = f"{SITE}/{key}/"
        kk_url = f"{SITE}/kk/{key}/"
        html = ru_path.read_text(encoding="utf-8")
        meta = PAGE_META[key]["ru"]
        html = set_lang(html, "ru")
        html = ensure_robots(html, "index, follow, max-image-preview:large")
        html = replace_title_desc(html, meta["title"], meta["description"])
        html = set_canonical(html, ru_url)
        html = inject_hreflang(html, ru_url, kk_url)
        # language switcher link
        if 'hreflang-switch' not in html:
            html = html.replace(
                "</nav>",
                f'</nav>\n      <a class="hreflang-switch" href="{kk_url}" hrefLang="kk">KZ</a>',
                1,
            )
        ru_path.write_text(html, encoding="utf-8")
        write_kk_hub_from_ru(ru_path, kk_path, key, None, ru_url, kk_url)



def patch_doctor_profile_pages() -> None:
    """Ensure canonical indexable doctor pages with ProfilePage + Person schema."""
    city_names = {
        "almaty": "Алматы",
        "aqtau": "Актау",
    }
    service_map = {
        "orel-talip": ["https://asiakoz.com/vitrektomiya-almaty/", "https://asiakoz.com/kosoglazie/"],
        "mehmet-esat-teker": ["https://asiakoz.com/lazer-almaty/", "https://asiakoz.com/katarakta-almaty/"],
        "aliya": ["https://asiakoz.com/lazer-almaty/", "https://asiakoz.com/katarakta-almaty/"],
        "musay": ["https://asiakoz.com/uslugi/"],
        "ali-keskin": ["https://asiakoz.com/kosoglazie-aktau/", "https://asiakoz.com/katarakta-almaty/"],
        "erol-joshkun": ["https://asiakoz.com/kosoglazie-aktau/", "https://asiakoz.com/katarakta-almaty/"],
        "nazgul-sagyndykova": ["https://asiakoz.com/kosoglazie-aktau/", "https://asiakoz.com/diagnostika-almaty/"],
    }

    for d in DOCTORS:
        path = ROOT / d["slug"] / "index.html"
        if not path.exists():
            continue
        html = path.read_text(encoding="utf-8")
        ru_url = f"{SITE}{d['href']}"
        kk_url = f"{SITE}{d.get('kkHref', d['href'])}"
        title = f"{d['nameRu']} — врач офтальмолог | AsiaKoz"
        desc = f"{d['nameRu']} — {d['roleRu']}. Приём в клинике AsiaKoz. Контакты и запись на странице врача."
        html = set_lang(html, "ru")
        html = ensure_robots(html, "index, follow, max-image-preview:large")
        html = replace_title_desc(html, title, desc)
        html = set_canonical(html, ru_url)
        html = inject_hreflang(html, ru_url, kk_url)

        city = next((c for c in d.get("cities", []) if c in city_names), "almaty")
        city_name = city_names.get(city, "Алматы")
        schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "ProfilePage",
                    "@id": f"{ru_url}#profile",
                    "url": ru_url,
                    "name": d["nameRu"],
                    "inLanguage": "ru-KZ",
                    "mainEntity": {"@id": f"{ru_url}#person"},
                    "about": service_map.get(d["id"], ["https://asiakoz.com/uslugi/"]),
                    "isPartOf": {"@id": f"{SITE}/#website"},
                },
                {
                    "@type": "Person",
                    "@id": f"{ru_url}#person",
                    "name": d["nameRu"],
                    "jobTitle": d["roleRu"],
                    "image": f"{SITE}{d['image'] if d['image'].startswith('/') else '/' + d['image']}",
                    "worksFor": {"@id": f"{SITE}/{city if city!='aqtau' else 'aktau'}/#clinic"},
                    "affiliation": {"@id": f"{SITE}/#organization"},
                    "knowsAbout": d.get("knowsAbout", []),
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {"@type": "ListItem", "position": 1, "name": "AsiaKoz", "item": f"{SITE}/"},
                        {"@type": "ListItem", "position": 2, "name": "Врачи", "item": f"{SITE}/doctors/"},
                        {"@type": "ListItem", "position": 3, "name": d["nameRu"], "item": ru_url},
                    ],
                },
            ],
        }
        html = put_jsonld(html, schema)
        path.write_text(html, encoding="utf-8")


DOCTOR_SPA_CANONICAL = {
    "almaty/doctor/aliya": "https://asiakoz.com/doctor-aliya/",
    "almaty/doctor/mehmet-esat-teker": "https://asiakoz.com/doctor-mehmet-esat-teker/",
    "almaty/doctor/orel-talip": "https://asiakoz.com/doctor-orel/",
    "laser/doctor/mehmet-esat-teker": "https://asiakoz.com/doctor-mehmet-esat-teker/",
    "laser/doctor/orel-talip": "https://asiakoz.com/doctor-orel/",
    "aktau/doctor/ali-keskin": "https://asiakoz.com/doctor-ali-keskin/",
    "aktau/doctor/erol-joshkun": "https://asiakoz.com/doctor-erol/",
    "aktau/doctor/nazgul-sagyndykova": "https://asiakoz.com/doctor-nazgul/",
    "shymkent/doctor/ali-keskin": "https://asiakoz.com/doctor-ali-keskin/",
    "shymkent/doctor/mehmet-esat-teker": "https://asiakoz.com/doctor-mehmet-esat-teker/",
}


def noindex_doctor_spa_shells() -> None:
    for rel, canonical in DOCTOR_SPA_CANONICAL.items():
        path = ROOT / rel / "index.html"
        if not path.exists():
            continue
        html = path.read_text(encoding="utf-8")
        html = ensure_robots(html, "noindex, follow")
        html = set_canonical(html, canonical)
        html = re.sub(
            r'(property="og:url" content=")[^"]*(")',
            rf"\1{canonical}\2",
            html,
            count=1,
            flags=re.I,
        )
        path.write_text(html, encoding="utf-8")
        print(f"doctor spa noindex: /{rel}/ → {canonical}")


def apply_url_merges() -> None:
    """Thin micro-pages → hub soft redirects + short uslugi catalog."""
    import subprocess
    import sys

    script = ROOT / "scripts" / "apply-url-merges.py"
    if script.exists():
        subprocess.check_call([sys.executable, str(script)], cwd=str(ROOT))


def main() -> None:
    print("=== AsiaKoz SEO build ===")
    lastmod_cache = load_lastmod()
    apply_url_merges()
    fix_redirect_stubs()
    write_aktau_alias()
    noindex_doctor_spa_shells()
    patch_doctor_profile_pages()

    # RU SPA shells
    patch_spa_shell(ROOT / "index.html", "home", "ru", None, f"{SITE}/", f"{SITE}/kk/")
    for bid in ("almaty", "aqtau", "shymkent"):
        b = branch_by_id(bid)
        patch_spa_shell(
            ROOT / branch_dir_name(bid) / "index.html",
            bid,
            "ru",
            bid,
            f"{SITE}{b['pageHref']}",
            f"{SITE}{b['kkHref']}",
        )

    # KK hubs (static)
    write_kk_hub_from_ru(ROOT / "index.html", ROOT / "kk" / "index.html", "home", None, f"{SITE}/", f"{SITE}/kk/")
    for bid in ("almaty", "aqtau", "shymkent"):
        b = branch_by_id(bid)
        write_kk_hub_from_ru(
            ROOT / branch_dir_name(bid) / "index.html",
            ROOT / "kk" / bid / "index.html",
            bid,
            bid,
            f"{SITE}{b['pageHref']}",
            f"{SITE}{b['kkHref']}",
        )

    patch_static_hreflang_hubs()
    write_llms()
    entries = collect_urls(lastmod_cache)
    write_sitemap(entries)
    save_lastmod(lastmod_cache)
    print("done")


if __name__ == "__main__":
    main()
