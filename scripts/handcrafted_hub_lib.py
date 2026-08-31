"""Shared helpers for handcrafted Almaty hub pages."""

from __future__ import annotations

import importlib.util
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS))
SITE = "https://asiakoz.com"


@dataclass
class HubConfig:
    dx_id: str
    slug: str
    hero_class: str
    title: str
    meta_desc: str
    og_title: str
    h1: str
    hero_p: str
    hero_facts: str
    wa_encoded: str
    breadcrumb: str
    schema_page_name: str
    schema_entity_name: str
    image: str
    image_alt: str
    doctor_href: str
    doctor_img: str
    doctor_name: str
    doctor_role: str
    med_trust: str
    price_title: str
    price_sub: str
    price_op_label: str
    price_op_title: str
    price_op_value: str
    price_op_text: str
    cta_h2: str
    cta_p: str
    related_html: str
    city_switch_dx: str | None = None
    remove_sections: tuple[str, ...] = ("iol", "secondary")
    extra_replacements: list = field(default_factory=list)
    section_overrides: dict[str, str] = field(default_factory=dict)


def replace_section(html: str, section_id: str, inner_html: str) -> str:
    """Replace inner content of a section (keep section tag and id)."""
    pat = re.compile(
        rf'(<section class="section[^"]*" id="{re.escape(section_id)}">)(.*?)(</section>)',
        re.DOTALL,
    )

    def repl(m: re.Match) -> str:
        return m.group(1) + "\n" + inner_html + "\n    " + m.group(3)

    return pat.sub(repl, html, count=1)


def patch_json_ld(html: str, cfg: HubConfig) -> str:
    html = re.sub(
        r'("@type": "MedicalWebPage"[\s\S]*?"description": )"[^"]*"',
        rf'\1"{cfg.meta_desc}"',
        html,
        count=1,
    )
    html = html.replace(
        '"name": "Факоэмульсификация катаракты с имплантацией ИОЛ"',
        f'"name": "{cfg.schema_entity_name}"',
    )
    html = html.replace(
        f'"@id": "https://asiakoz.com/{cfg.slug}/#procedure"',
        f'"@id": "https://asiakoz.com/{cfg.slug}/#therapy"',
    )
    html = re.sub(
        r'"alternateName": \[[^\]]+\]',
        f'"alternateName": ["{cfg.schema_entity_name}", "Офтальмология", "AsiaKoz"]',
        html,
        count=1,
    )
    html = html.replace(
        '"description": "Ориентировочная стоимость операции катаракты. Не является публичной офертой. Точная цена определяется после диагностики."',
        f'"description": "{cfg.meta_desc}"',
    )
    html = re.sub(
        r',?\s*\{\s*"@type": "FAQPage"[\s\S]*?\}\s*(?=\]\s*\}\s*</script>)',
        "",
        html,
        count=1,
    )
    return html


def global_scrub(html: str) -> str:
    """Remove obvious katarakta-template leaks from visible body."""
    subs = [
        (
            "Врач оценивает состояние хрусталика и глаза, уточняет диагноз и определяет необходимые измерения для подбора ИОЛ.",
            "Врач оценивает состояние глаз, уточняет диагноз и определяет необходимый объём обследования.",
        ),
        (
            "Решение об операции и тип ИОЛ врач определяет после обследования, а не по рекламным обещаниям.",
            "План лечения врач определяет после обследования, а не по рекламным обещаниям.",
        ),
        (
            "<h3 class=\"card-title\">Подбор ИОЛ после диагностики</h3>",
            "<h3 class=\"card-title\">Индивидуальный план лечения</h3>",
        ),
        (
            "Тип линзы — монофокальная, торическая, мультифокальная или EDOF — подбирается по состоянию глаза, астигматизму, зрительным задачам и бюджету. Полная диагностика и приём хирурга — 20 000 ₸.",
            "Тактика лечения подбирается по диагнозу, стадии и динамике. Полная диагностика и приём специалиста — от 20 000 ₸.",
        ),
        (
            "Сначала обследование, затем расчёт хрусталика и обсуждение ожидаемого результата. Точная стоимость операции называется после диагностики и не является публичной офертой.",
            "Сначала обследование, затем обсуждение тактики и ожидаемого результата. Точная стоимость называется после диагностики.",
        ),
        (
            "<h2 class=\"section-title\">Как проходит операция катаракты</h2>",
            "<h2 class=\"section-title\">Как проходит лечение</h2>",
        ),
        (
            "<h2 class=\"section-title\">Восстановление после операции катаракты</h2>",
            "<h2 class=\"section-title\">Восстановление и контроль</h2>",
        ),
        (
            "Катаракту и имплантацию ИОЛ в Алматы проводят Мехмет Есат Текер, Орел Талип и Алия Ганимуратовна Усманова.",
            "В филиале Asiakoz в Алматы ведут приём офтальмохирурги сети — в том числе Мехмет Есат Текер, Алия Усманова и Нурмухамед Мусай.",
        ),
        (
            "Операция катаракты является хирургическим вмешательством и имеет возможные риски и ограничения.",
            "Любое лечение имеет риски и ограничения — их обсуждают на приёме до начала терапии.",
        ),
        (
            "После обследования врач подтвердит диагноз, поможет выбрать ИОЛ и назовёт точную стоимость операции.",
            "После обследования врач объяснит диагноз, варианты лечения и ориентировочную стоимость.",
        ),
    ]
    for old, new in subs:
        html = html.replace(old, new)
    return html


def apply(html: str, rules: list) -> str:
    for old, new in rules:
        if isinstance(old, re.Pattern):
            html = old.sub(new, html, count=1)
        else:
            html = html.replace(old, new)
    return html


def remove_section(html: str, section_id: str) -> str:
    pat = re.compile(
        rf'\s*<section class="section[^"]*" id="{re.escape(section_id)}">.*?</section>',
        re.DOTALL,
    )
    return pat.sub("", html, count=1)


def replace_faq_section(html: str, dx_id: str, lang: str) -> str:
    from premium_mega_faq import get_mega_faq, mega_faq_html

    items = get_mega_faq(dx_id, lang, "AsiaKoz", "Алматы", "77003600180", "+7 700 360 01 80")
    block = mega_faq_html(items, lang)
    return re.sub(
        r'<section class="section faq" id="faq">.*?</section>',
        block.strip(),
        html,
        count=1,
        flags=re.DOTALL,
    )


def insert_deep_table(html: str, dx_id: str, lang: str, before_id: str = "how") -> str:
    from premium_deep import deep_section_html, get_deep_section

    block = deep_section_html(get_deep_section(dx_id, lang))
    if not block:
        return html
    marker = f'    <section class="section" id="{before_id}">'
    if block.strip() in html:
        return html
    return html.replace(marker, block + "\n" + marker, 1)


HERO_DOCTOR_BLOCK = re.compile(
    r'        <a href="/doctor-mehmet-esat-teker/" class="[a-z0-9-]+-hero__doctor">\s*'
    r'<img src="/images/doctor-mehmet-esat-teker\.png(?:\?v=[^"]+)?" alt="" width="56" height="56" />\s*'
    r"<span>\s*<strong>Мехмет Есат Текер</strong>\s*"
    r"Офтальмохирург · Катаракта · Алматы\s*"
    r"</span>\s*</a>",
    re.DOTALL,
)


def hero_doctor_block(cfg: HubConfig) -> str:
    return f"""        <a href="{cfg.doctor_href}" class="{cfg.hero_class}__doctor">
          <img src="{cfg.doctor_img}" alt="" width="56" height="56" />
          <span>
            <strong>{cfg.doctor_name}</strong>
            {cfg.doctor_role}
          </span>
        </a>"""


def replace_hero_doctor(html: str, cfg: HubConfig) -> str:
    return HERO_DOCTOR_BLOCK.sub(hero_doctor_block(cfg), html, count=1)


def base_slug_swap(html: str, cfg: HubConfig) -> str:
    html = html.replace("/images/katarakta-almaty.webp", "@@HUB_IMG@@")
    html = html.replace("https://asiakoz.com/katarakta-almaty/", f"{SITE}/{cfg.slug}/")
    html = html.replace("katarakta-almaty", cfg.slug)
    html = html.replace("katarakta-hero", cfg.hero_class)
    html = html.replace("@@HUB_IMG@@", cfg.image)
    return html


def city_switch_html(dx_id: str, lang: str = "ru") -> str:
    spec = importlib.util.spec_from_file_location(
        "gen_dx", SCRIPTS / "generate-city-diagnosis-pages.py"
    )
    gen = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(gen)
    dx = gen.DIAGNOSES[dx_id]
    links = []
    for city in dx["cities"]:
        label = gen.CITIES[city]["kk" if lang == "kk" else "ru"]
        href = gen.rel_url(dx_id, city, lang)
        cls = " is-active" if city == "almaty" else ""
        links.append(f'<a class="{cls.strip()}" href="{href}">{label}</a>')
    title = "Қала" if lang == "kk" else "Филиал"
    return f'<nav class="city-switch" aria-label="{title}">{"".join(links)}</nav>'


def post_process_ru(html: str, cfg: HubConfig) -> str:
    if cfg.city_switch_dx:
        switch = city_switch_html(cfg.city_switch_dx, "ru")
        html = re.sub(r'\s*<nav class="city-switch" aria-label="[^"]*">.*?</nav>', f"\n        {switch}", html, count=1, flags=re.DOTALL)
    else:
        html = re.sub(r'\s*<nav class="city-switch" aria-label="[^"]*">.*?</nav>', "", html, count=1, flags=re.DOTALL)

    if 'lang-switch' not in html:
        html = html.replace(
            '      <div class="header-right">\n        <div class="header-schedule">',
            '      <div class="header-right">\n        <div class="lang-switch" role="group" aria-label="Язык">\n'
            f'          <a href="/kk/{cfg.slug}/" hreflang="kk">ҚАЗ</a>\n'
            '          <a class="is-active" hreflang="ru" aria-current="page">РУС</a>\n'
            "        </div>\n        <div class=\"header-schedule\">",
        )
    else:
        html = re.sub(
            r'<div class="lang-switch" role="group" aria-label="Язык">.*?</div>',
            f'<div class="lang-switch" role="group" aria-label="Язык">\n'
            f'          <a href="/kk/{cfg.slug}/" hreflang="kk">ҚАЗ</a>\n'
            f'          <a class="is-active" hreflang="ru" aria-current="page">РУС</a>\n'
            f"        </div>",
            html,
            count=1,
            flags=re.DOTALL,
        )

    html = html.replace("Дата обновления: 24.08.2026", "Дата обновления: 28.08.2026")
    html = html.replace('"dateModified": "2026-08-24"', '"dateModified": "2026-08-28"')
    return html


def make_kk_from_ru(ru_html: str, slug: str) -> str:
    spec = importlib.util.spec_from_file_location("sync_kk", SCRIPTS / "sync-kk-static-mirrors.py")
    sync = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(sync)

    spec2 = importlib.util.spec_from_file_location("build_seo", SCRIPTS / "build-seo.py")
    build = importlib.util.module_from_spec(spec2)
    spec2.loader.exec_module(build)

    ru_url = f"{SITE}/{slug}/"
    kk_url = f"{SITE}/kk/{slug}/"
    kh = sync.localize_html(ru_html)
    kh = build.set_lang(kh, "kk")
    kh = build.set_canonical(kh, kk_url)
    kh = build.inject_hreflang(kh, ru_url, kk_url)
    kh = sync.fix_internal_links(kh)
    kh = re.sub(r'(property="og:url" content=")[^"]*(")', rf"\1{kk_url}\2", kh, count=1, flags=re.I)
    kh = re.sub(r'(property="og:locale" content=")[^"]*(")', r"\1kk_KZ\2", kh, count=1, flags=re.I)
    kh = kh.replace("/kk/kk/", "/kk/")
    kh = re.sub(
        r'<div class="lang-switch" role="group" aria-label="[^"]*">.*?</div>',
        f'<div class="lang-switch" role="group" aria-label="Тіл">\n'
        f'          <a class="is-active" href="/kk/{slug}/" hreflang="kk" aria-current="page">ҚАЗ</a>\n'
        f'          <a href="/{slug}/" hreflang="ru">РУС</a>\n'
        f"        </div>",
        kh,
        count=1,
        flags=re.DOTALL,
    )
    from lang_switch import patch_kk_static_chrome

    kh = patch_kk_static_chrome(kh, f"kk/{slug}")
    return kh


def render_hub(cfg: HubConfig, source: Path | None = None) -> tuple[str, str]:
    src_path = source or ROOT / "katarakta-almaty" / "index.html"
    html = src_path.read_text(encoding="utf-8")
    html = base_slug_swap(html, cfg)

    for sid in cfg.remove_sections:
        html = remove_section(html, sid)

    rules = [
        (re.compile(r"<title>.*?</title>", re.DOTALL), f"<title>{cfg.title}</title>"),
        (
            re.compile(r'name="description"\s+content="[^"]*"', re.DOTALL),
            f'name="description"\n    content="{cfg.meta_desc}"',
        ),
        (
            re.compile(r'property="og:title" content="[^"]*"'),
            f'property="og:title" content="{cfg.og_title}"',
        ),
        (
            re.compile(r'name="twitter:title" content="[^"]*"'),
            f'name="twitter:title" content="{cfg.og_title}"',
        ),
        (
            re.compile(r'property="og:description"\s+content="[^"]*"', re.DOTALL),
            f'property="og:description"\n    content="{cfg.meta_desc}"',
        ),
        (
            re.compile(r'name="twitter:description"\s+content="[^"]*"', re.DOTALL),
            f'name="twitter:description"\n    content="{cfg.meta_desc}"',
        ),
        (
            "<h1>Операция катаракты в Алматы: факоэмульсификация с ИОЛ</h1>",
            f"<h1>{cfg.h1}</h1>",
        ),
        (
            """        <p>
          Катаракта — это помутнение естественного хрусталика глаза, которое постепенно снижает качество зрения.
          В клинике asiakoz в Алматы проводится факоэмульсификация катаракты с имплантацией искусственного хрусталика.
          Тип ИОЛ подбирается после полной диагностики с учётом состояния глаза, астигматизма и зрительных задач пациента.
        </p>""",
            f"        <p>\n          {cfg.hero_p}\n        </p>",
        ),
        (
            """        <div class="hero-facts hero-facts--4" aria-label="Ключевые факты">
          <div class="hero-fact"><b>20 000 ₸</b><span>Полная диагностика и приём офтальмолога-хирурга</span></div>
          <div class="hero-fact"><b>350 000–1 200 000 ₸</b><span>Ориентировочная стоимость операции</span></div>
          <div class="hero-fact"><b>После диагностики</b><span>Точная стоимость и подбор ИОЛ</span></div>
          <div class="hero-fact"><b>4 врача в Алматы</b><span>Мехмет, Орел Талип, Алия, Нурмухамед Мусай</span></div>
        </div>""",
            cfg.hero_facts,
        ),
        (
            '<a href="/">Главная</a> / <a href="/uslugi/">Услуги</a> / Катаракта в Алматы',
            cfg.breadcrumb,
        ),
        (
            'alt="Схема глаза и искусственного хрусталика — визуализация операции катаракты в asiakoz Алматы"',
            f'alt="{cfg.image_alt}"',
        ),
        (
            "<h2 class=\"section-title\">Стоимость диагностики и операции катаракты</h2>",
            f"<h2 class=\"section-title\">{cfg.price_title}</h2>",
        ),
        (
            """      <p class="section-subtitle">
        Полная диагностика помогает подтвердить катаракту, оценить состояние глаза и рассчитать параметры искусственного хрусталика.
        Стоимость операции зависит от выбранной ИОЛ, клинической ситуации и объёма вмешательства.
      </p>""",
            f'      <p class="section-subtitle">\n        {cfg.price_sub}\n      </p>',
        ),
        (
            "<h3 class=\"price-card__title\">Операция катаракты</h3>",
            f"<h3 class=\"price-card__title\">{cfg.price_op_title}</h3>",
        ),
        (
            "<p class=\"price-card__value\">Ориентировочно 350 000–1 200 000 ₸</p>",
            f"<p class=\"price-card__value\">{cfg.price_op_value}</p>",
        ),
        (
            """          <p class="price-card__text">
            Точная стоимость зависит от типа искусственного хрусталика, состояния глаза и сложности операции.
            Итоговая цена определяется после диагностики и консультации офтальмолога-хирурга.
          </p>""",
            f'          <p class="price-card__text">\n            {cfg.price_op_text}\n          </p>',
        ),
        (
            "<h2>Запишитесь на диагностику катаракты в Алматы</h2>",
            f"<h2>{cfg.cta_h2}</h2>",
        ),
        (
            """      <p>
        Полная диагностика и приём офтальмолога-хирурга — 20 000 ₸.
        После обследования врач подтвердит диагноз, поможет выбрать ИОЛ и назовёт точную стоимость операции.
      </p>
      <p>Операция — ориентировочно 350 000–1 200 000 ₸.</p>""",
            f"      <p>\n        {cfg.cta_p}\n      </p>",
        ),
        (
            "<p><strong>Материал проверил:</strong> Мехмет Есат Текер, офтальмохирург.</p>",
            f"<p><strong>Материал проверил:</strong> {cfg.med_trust}</p>",
        ),
        ('"name": "Операция катаракты в Алматы — цена от 350 000 ₸ | asiakoz"', f'"name": "{cfg.schema_page_name}"'),
        ('"name": "Катаракта в Алматы", "item":', f'"name": "{cfg.schema_entity_name}", "item":'),
        ('"@type": "MedicalProcedure"', '"@type": "MedicalTherapy"'),
        ('"name": "Факоэмульсификация катаракты с ИОЛ"', f'"name": "{cfg.schema_entity_name}"'),
        ('"procedureType": "Surgical"', '"procedureType": "Therapeutic"'),
        *cfg.extra_replacements,
    ]
    html = apply(html, rules)
    html = replace_hero_doctor(html, cfg)

    for section_id, content in cfg.section_overrides.items():
        html = replace_section(html, section_id, content)

    html = global_scrub(html)
    html = patch_json_ld(html, cfg)

    # WhatsApp links
    html = re.sub(
        r"%D0%BA%D0%B0%D1%82%D0%B0%D1%80%D0%B0%D0%BA%D1%82%D1%8B%20%D0%B2%20%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B",
        cfg.wa_encoded,
        html,
    )

    # Related block
    html = re.sub(
        r'<section class="section" id="related">.*?</section>',
        f'<section class="section" id="related">\n      <h2 class="section-title">Полезные страницы</h2>\n      <p class="section-subtitle">\n        {cfg.related_html}\n      </p>\n    </section>',
        html,
        count=1,
        flags=re.DOTALL,
    )

    html = insert_deep_table(html, cfg.dx_id, "ru")
    html = replace_faq_section(html, cfg.dx_id, "ru")
    html = post_process_ru(html, cfg)

    ru_out = html
    kk_out = make_kk_from_ru(ru_out, cfg.slug)
    kk_out = replace_faq_section(kk_out, cfg.dx_id, "kk")
    if cfg.city_switch_dx:
        switch = city_switch_html(cfg.city_switch_dx, "kk")
        kk_out = re.sub(
            r'\s*<nav class="city-switch" aria-label="[^"]*">.*?</nav>',
            f"\n        {switch}",
            kk_out,
            count=1,
            flags=re.DOTALL,
        )

    dest_ru = ROOT / cfg.slug / "index.html"
    dest_kk = ROOT / "kk" / cfg.slug / "index.html"
    dest_ru.parent.mkdir(parents=True, exist_ok=True)
    dest_kk.parent.mkdir(parents=True, exist_ok=True)
    dest_ru.write_text(ru_out, encoding="utf-8")
    try:
        from kk_hub_slugs import GENERATOR_KK_SLUGS
    except ImportError:
        GENERATOR_KK_SLUGS = frozenset()
    if cfg.slug not in GENERATOR_KK_SLUGS:
        dest_kk.write_text(kk_out, encoding="utf-8")
    return ru_out, kk_out
