#!/usr/bin/env python3
"""Sync doctor portraits, catalogs, and profile page names/images from data/doctors.json."""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://asiakoz.com"
CANON = ROOT / "images" / "doctors"
LEGACY_DIR = ROOT / "images"
CACHE = "20260828g"

# Canonical filename in images/doctors/ -> legacy filename in images/
IMAGE_ALIASES = {
    "mehmet-esat-teker.png": "doctor-mehmet-esat-teker.png",
    "orel-talip.png": "doctor-orel.png",
    "aliya.png": "doctor-aliya.png",
    "musay.png": "doctor-musay.png",
    "ali-keskin.png": "doctor-ali-keskin.png",
    "erol-joshkun.png": "doctor-erol.png",
    "nazgul-sagyndykova.png": "doctor-nazgul.png",
    "kadyr-kyrboga.png": "doctor-kadyr-kyrboga.png",
}

LEGACY_BY_ID = {
    "mehmet-esat-teker": "/images/doctors/mehmet-esat-teker.png",
    "orel-talip": "/images/doctors/orel-talip.png",
    "aliya": "/images/doctors/aliya.png",
    "musay": "/images/doctors/musay.png",
    "ali-keskin": "/images/doctors/ali-keskin.png",
    "erol-joshkun": "/images/doctors/erol-joshkun.png",
    "nazgul-sagyndykova": "/images/doctors/nazgul-sagyndykova.png",
    "kadyr-kyrboga": "/images/doctors/kadyr-kyrboga.png",
}

CITY_ORDER = {"almaty": 0, "aqtau": 1, "shymkent": 2}
CITY_META = {
    "almaty": {"badge": "branch-badge-almaty", "ru": "Алматы", "kk": "Алматы"},
    "aqtau": {"badge": "branch-badge-aktau", "ru": "Актау", "kk": "Ақтау"},
    "shymkent": {"badge": "branch-badge-aktau", "ru": "Шымкент", "kk": "Шымкент"},
}


def load_doctors() -> list[dict]:
    with (ROOT / "data" / "doctors.json").open(encoding="utf-8") as f:
        return json.load(f)["doctors"]


def sync_images() -> None:
    """Copy canonical portraits to every SPA/static mirror (branch folders, homepage public)."""
    canon_files = sorted(CANON.glob("*.png"))
    if not canon_files:
        raise FileNotFoundError(f"No portraits in {CANON}")

    mirror_dirs: set[Path] = {CANON}
    for path in ROOT.rglob("doctors"):
        if not path.is_dir() or path.name != "doctors":
            continue
        if "node_modules" in path.parts:
            continue
        if path.parent.name == "images":
            mirror_dirs.add(path)

    for mirror in sorted(mirror_dirs):
        if mirror == CANON:
            continue
        for src in canon_files:
            dst = mirror / src.name
            shutil.copy2(src, dst)
            print(f"mirror: {src.name} -> {mirror.relative_to(ROOT)}/")

    for src_name, dst_name in IMAGE_ALIASES.items():
        src = CANON / src_name
        dst = LEGACY_DIR / dst_name
        if not src.exists():
            raise FileNotFoundError(src)
        shutil.copy2(src, dst)
        print(f"legacy: {src_name} -> {dst_name}")


def patch_doctors_ui_cache() -> None:
    """Add cache-buster to SPA doctor image paths in all doctors-ui.json copies."""
    for path in ROOT.rglob("doctors-ui.json"):
        if "node_modules" in path.parts:
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        changed = False
        for d in data:
            img = d.get("image", "")
            base = img.split("?", 1)[0]
            patched = f"{base}?v={CACHE}"
            if img != patched:
                d["image"] = patched
                changed = True
        if changed:
            path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            print(f"doctors-ui: {path.relative_to(ROOT)}")


def legacy_img(doctor_id: str) -> str:
    return LEGACY_BY_ID[doctor_id]


def img_src(path: str, cache: bool = True) -> str:
    q = f"?v={CACHE}" if cache else ""
    return f"{path}{q}"


def doctor_card(d: dict, lang: str) -> str:
    city = d["cities"][0]
    meta = CITY_META[city]
    name = d["nameKz"] if lang == "kk" else d["nameRu"]
    role = d["roleKz"] if lang == "kk" else d["roleRu"]
    tags = d["tagsKz"] if lang == "kk" else d["tagsRu"]
    city_label = meta["kk"] if lang == "kk" else meta["ru"]
    action = "Толығырақ →" if lang == "kk" else "Подробнее →"
    tags_html = "".join(f'<span class="doctor-tag">{t}</span>' for t in tags)
    img = img_src(legacy_img(d["id"]))
    return (
        f'        <article class="doctor-card"><a class="doctor-card-inner" href="{d["href"]}">'
        f'<div class="doctor-photo-wrap"><img src="{img}" alt="{name}" loading="lazy" /></div>'
        f'<div class="doctor-body"><div class="doctor-meta"><span class="doctor-role">{role}</span>'
        f'<span class="{meta["badge"]}">{city_label}</span></div>'
        f'<h3 class="doctor-name">{name}</h3><div class="doctor-tags">{tags_html}</div>'
        f'<div class="doctor-action">{action}</div></div></a></article>'
    )


def sorted_doctors(doctors: list[dict]) -> list[dict]:
    return sorted(doctors, key=lambda d: (CITY_ORDER.get(d["cities"][0], 9), d["nameRu"]))


def patch_doctors_grid(path: Path, lang: str, doctors: list[dict]) -> None:
    if not path.exists():
        return
    html = path.read_text(encoding="utf-8")
    cards = "\n".join(doctor_card(d, lang) for d in sorted_doctors(doctors))
    start = html.find('<div class="doctors-grid">')
    end = html.find("      </div>\n    </section>", start)
    if start < 0 or end < 0:
        print(f"catalog skip (markers missing): {path.relative_to(ROOT)}")
        return
    html = html[:start] + f'<div class="doctors-grid">\n{cards}\n' + html[end:]
    path.write_text(html, encoding="utf-8")
    print(f"catalog: {path.relative_to(ROOT)}")


def patch_profile_page(path: Path, d: dict, lang: str) -> None:
    if not path.exists():
        return
    name = d["nameKz"] if lang == "kk" else d["nameRu"]
    role = d["roleKz"] if lang == "kk" else d["roleRu"]
    rel_img = ".." + legacy_img(d["id"]) + f"?v={CACHE}"
    abs_img = f"{SITE}{legacy_img(d['id'])}"
    html = path.read_text(encoding="utf-8")

    html = re.sub(
        r'(<div class="doctor-photo-wrap"><img src=")[^"]+(" alt=")[^"]*(")',
        rf"\1{rel_img}\2{name}\3",
        html,
        count=1,
    )
    html = re.sub(r"<h1>[^<]+</h1>", f"<h1>{name}</h1>", html, count=1)
    html = re.sub(
        r'(<div class="doctor-role">)[^<]+(</div>)',
        rf"\1{role}\2",
        html,
        count=1,
    )
    html = re.sub(
        r'content="https://asiakoz\.com/images/[^"]+"',
        f'content="{abs_img}"',
        html,
        count=1,
    )
    html = re.sub(
        r"(<nav class=\"breadcrumb\">.*?</nav>)",
        lambda m: re.sub(r"/ [^<]+</nav>", f"/ {name}</nav>", m.group(1), count=1),
        html,
        count=1,
        flags=re.DOTALL,
    )
    if lang == "ru":
        html = html.replace("Нұрмұхамед Мусай", d["nameRu"])
    path.write_text(html, encoding="utf-8")
    print(f"profile: {path.relative_to(ROOT)}")


def bump_doctor_image_cache() -> None:
    for path in ROOT.rglob("*.html"):
        text = path.read_text(encoding="utf-8")
        new = text
        for stem in (
            "doctor-mehmet-esat-teker",
            "doctor-orel",
            "doctor-aliya",
            "doctor-musay",
            "doctor-ali-keskin",
            "doctor-erol",
            "doctor-nazgul",
            "doctor-kadyr-kyrboga",
        ):
            new = re.sub(
                rf"/images/{stem}\.png\?v=[^\"']+",
                f"/images/{stem}.png?v={CACHE}",
                new,
            )
            # Add cache buster to bare paths in surgeon grids (not ../ relative)
            new = re.sub(
                rf'(?<=\")/images/{stem}\.png(?!\?v=)(?=\")',
                f"/images/{stem}.png?v={CACHE}",
                new,
            )
        if new != text:
            path.write_text(new, encoding="utf-8")


def main() -> None:
    doctors = load_doctors()
    sync_images()
    patch_doctors_ui_cache()
    patch_doctors_grid(ROOT / "doctors" / "index.html", "ru", doctors)
    patch_doctors_grid(ROOT / "kk" / "doctors" / "index.html", "kk", doctors)
    for d in doctors:
        patch_profile_page(ROOT / d["slug"] / "index.html", d, "ru")
        kk_href = d.get("kkHref") or f"/kk/{d['slug']}/"
        patch_profile_page(ROOT / kk_href.strip("/") / "index.html", d, "kk")
    bump_doctor_image_cache()
    print("done: doctor sync")


if __name__ == "__main__":
    main()
