"""Shared helpers for Almaty landing page content."""

from __future__ import annotations

IMG_LASER = "/images/clinic-almaty-laser.png"
IMG_RETINA = "/images/vitrektomiya-almaty.webp"
IMG_KAT = "/images/katarakta-almaty.webp"
IMG_CLINIC = "/images/clinic-building.png"

DOCS_LASER = ["mehmet", "orel", "aliya"]
DOCS_RETINA = ["orel", "mehmet"]
DOCS_KAT = ["mehmet", "orel", "aliya"]
DOCS_KIDS = ["aliya", "musay"]
DOCS_GENERAL = ["musay", "aliya", "mehmet"]


def block(
    h1: str,
    title: str,
    desc: str,
    lead: str,
    facts: list[tuple[str, str]],
    steps: list[tuple[str, str]],
    faq: list[tuple[str, str]],
) -> dict:
    return {
        "h1": h1,
        "title": title,
        "desc": desc,
        "lead": lead,
        "facts": facts,
        "steps": steps,
        "faq": faq,
    }


def dx(slug: str, image: str, doctors: list[str], name_ru: str, name_kk: str, ru: dict, kk: dict) -> dict:
    return {
        "cities": ["almaty"],
        "skip_write": [],
        "folder": lambda c, s=slug: s,
        "image": image,
        "doctors": {"almaty": doctors},
        "ru": {"name": name_ru, **ru},
        "kk": {"name": name_kk, **kk},
    }


def topic_landing(
    slug: str,
    image: str,
    doctors: list[str],
    name_ru: str,
    name_kk: str,
    lead_ru: str,
    lead_kk: str,
    facts_ru: list[tuple[str, str]],
    facts_kk: list[tuple[str, str]],
    faq_ru: list[tuple[str, str]],
    faq_kk: list[tuple[str, str]],
) -> dict:
    steps_ru = [
        ("Осмотр", "Сбор жалоб и первичная диагностика в {city}."),
        ("Обследование", "ОКТ, давление и другие методы — по показаниям."),
        ("План", "Объясняем варианты лечения без давления."),
        ("Контроль", "Повторные визиты по графику филиала."),
    ]
    steps_kk = [
        ("Қабылдау", "{city} филиалында шағым және диагностика."),
        ("Тексеру", "ОКТ, қысым — көрсеткіш бойынша."),
        ("Жоспар", "Ем нұсқаларын түсіндіреміз."),
        ("Бақылау", "Кесте бойынша қайта қаралу."),
    ]
    return dx(
        slug,
        image,
        doctors,
        name_ru,
        name_kk,
        block(
            f"{name_ru} в {{city}}",
            f"{name_ru} в {{city}} — диагностика и лечение | AsiaKoz",
            f"{name_ru} в {{city}}: диагностика и лечение в AsiaKoz. {{address}}. Запись WhatsApp.",
            lead_ru,
            facts_ru,
            steps_ru,
            faq_ru,
        ),
        block(
            f"{{city}} қаласындағы {name_kk.lower()}",
            f"{{city}} қаласындағы {name_kk} | AsiaKoz",
            f"{{city}} қаласындағы {name_kk}: диагностика және ем. {{address}}.",
            lead_kk,
            facts_kk,
            steps_kk,
            faq_kk,
        ),
    )
