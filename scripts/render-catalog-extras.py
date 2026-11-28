#!/usr/bin/env python3
"""Adds a rich, crawlable block to the doctors catalog and the services catalog (RU + KK).

/doctors/: which doctor sees patients where, what each one does, consultation price,
           branch ratings on 2GIS, FAQ.
/uslugi/:  every operation explained in plain words, price, where it is done, FAQ.

Reuses the data in scripts/render-doctor-extras.py. Runs at the end of build-seo.py.
"""

from __future__ import annotations

import html
import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
START, END = "<!--catalog-extras:start-->", "<!--catalog-extras:end-->"

_spec = importlib.util.spec_from_file_location("dx", ROOT / "scripts" / "render-doctor-extras.py")
dx = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(dx)

WHERE = {
    "smile": ("Алматы, Актау", "Алматы, Ақтау"),
    "lasik_prk": ("Шымкент", "Шымкент"),
    "cataract": ("Алматы, Актау, Шымкент", "Алматы, Ақтау, Шымкент"),
    "vitrectomy": ("Алматы, Актау, Шымкент", "Алматы, Ақтау, Шымкент"),
    "strabismus": ("Алматы, Актау, Шымкент", "Алматы, Ақтау, Шымкент"),
    "glaucoma": ("Алматы, Актау, Шымкент", "Алматы, Ақтау, Шымкент"),
    "pterygium": ("Алматы", "Алматы"),
    "injections": ("Алматы", "Алматы"),
    "diagnostics": ("Алматы, Актау, Шымкент", "Алматы, Ақтау, Шымкент"),
    "kids": ("Алматы, Актау, Шымкент", "Алматы, Ақтау, Шымкент"),
}

T = {
    "ru": {
        "doc_h": "Кто какие операции делает",
        "doc_lead": "В AsiaKoz принимают турецкие офтальмохирурги и казахстанские офтальмологи. Приём у турецкого врача — 20 000 ₸: в цену входят полная диагностика и переводчик. Приём казахстанского врача — 10 000–15 000 ₸.",
        "cols": ("Врач", "Филиал", "Чем занимается", "Приём"),
        "rating_h": "Рейтинг филиалов на 2ГИС",
        "of": "оценок",
        "svc_h": "Что лечим и сколько стоит",
        "svc_lead": "Коротко о каждой операции простыми словами. Точную цену врач называет после диагностики.",
        "svc_cols": ("Услуга", "Что это", "Цена", "Где"),
        "faq_h": "Вопросы и ответы",
        "doc_faq": [
            ("Турецкие врачи говорят по-русски или по-казахски?", "Приём идёт с переводчиком — его услуги уже входят в стоимость приёма 20 000 ₸."),
            ("Можно ли записаться к конкретному врачу?", "Да. Напишите в WhatsApp филиала имя врача и удобную дату — администратор подберёт время."),
            ("Где делают лазерную коррекцию?", "ReLEx SMILE — в Алматы (Мехмет Есат Текер, Орел Талип) и Актау (Али Кескин, Эрол Джошкун). LASIK и PRK — в Шымкенте (Кадыр Кырбога)."),
        ],
        "svc_faq": [
            ("С чего начать, если не знаю, какая операция нужна?", "С диагностики и приёма врача (20 000 ₸). После осмотра врач объясняет диагноз и предлагает лечение."),
            ("Делают ли операции детям?", "Да: косоглазие, врождённая катаракта и другие операции у детей проводятся под общим наркозом."),
            ("Есть ли рассрочка?", "На SMILE в Алматы — рассрочка на 12 месяцев через Kaspi Bank и Halyk Bank. Об остальных услугах уточняйте в WhatsApp."),
        ],
        "prices": "Полный прайс",
    },
    "kk": {
        "doc_h": "Қай дәрігер қандай ота жасайды",
        "doc_lead": "AsiaKoz-та түрік офтальмохирургтері мен қазақстандық офтальмологтар қабылдайды. Түрік дәрігерінің қабылдауы — 20 000 ₸: бағаға толық диагностика мен аудармашы кіреді. Қазақстандық дәрігердің қабылдауы — 10 000–15 000 ₸.",
        "cols": ("Дәрігер", "Филиал", "Немен айналысады", "Қабылдау"),
        "rating_h": "Филиалдардың 2ГИС-тегі рейтингі",
        "of": "баға",
        "svc_h": "Не емдейміз және бағасы қанша",
        "svc_lead": "Әр ота туралы қарапайым тілмен қысқаша. Нақты бағаны дәрігер диагностикадан кейін айтады.",
        "svc_cols": ("Қызмет", "Бұл не", "Бағасы", "Қайда"),
        "faq_h": "Сұрақ-жауап",
        "doc_faq": [
            ("Түрік дәрігерлері қазақша не орысша сөйлей ме?", "Қабылдау аудармашымен өтеді — оның қызметі 20 000 ₸ қабылдау бағасына кіреді."),
            ("Белгілі бір дәрігерге жазылуға бола ма?", "Иә. Филиалдың WhatsApp-ына дәрігердің аты мен ыңғайлы күнді жазыңыз — әкімші уақыт таңдайды."),
            ("Лазерлік түзету қайда жасалады?", "ReLEx SMILE — Алматыда (Мехмет Есат Текер, Орел Талип) және Ақтауда (Али Кескин, Эрол Джошкун). LASIK пен PRK — Шымкентте (Кадыр Кырбога)."),
        ],
        "svc_faq": [
            ("Қандай ота керек екенін білмесем, неден бастаймын?", "Диагностика мен дәрігер қабылдауынан (20 000 ₸). Қаралғаннан кейін дәрігер диагнозды түсіндіріп, ем ұсынады."),
            ("Балаларға ота жасала ма?", "Иә: қылилық, туа біткен катаракта және басқа оталар балаларға жалпы наркозбен жасалады."),
            ("Бөліп төлеуге бола ма?", "Алматыда SMILE-ге Kaspi Bank және Halyk Bank арқылы 12 айға бөліп төлеуге болады. Басқа қызметтер туралы WhatsApp арқылы нақтылаңыз."),
        ],
        "prices": "Толық прайс",
    },
}


def faq_html(items, lang):
    e = html.escape
    body = "".join(f"<details><summary>{e(q)}</summary><p>{e(a)}</p></details>" for q, a in items)
    ld = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in items],
    }
    return f'<h2 class="section-title">{T[lang]["faq_h"]}</h2><div class="faq">{body}</div><script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>'


def doctors_block(lang: str) -> str:
    e = html.escape
    t = T[lang]
    docs = json.loads((ROOT / "data" / "doctors-ui.json").read_text(encoding="utf-8"))
    reviews = json.loads((ROOT / "data" / "reviews-2gis.json").read_text(encoding="utf-8"))
    rows = []
    for ui in docs:
        name = ui["nameKz"] if lang == "kk" else ui["nameRu"]
        href = ui.get("profileUrlKz") if lang == "kk" else ui.get("profileUrl")
        cities = ", ".join(dx.BRANCH[c][lang][0] for c in (ui.get("cities") or ["almaty"]) if c in dx.BRANCH)
        ops = []
        for key in dx.DOCTOR_OPS.get(ui["id"], []):
            if key == "smile" and "shymkent" in (ui.get("cities") or [])[:1]:
                continue
            ops.append(dx.OPS[key][2] if lang == "kk" else dx.OPS[key][0])
        price = "10 000–15 000 ₸" if ui["id"] in dx.LOCAL_DOCTORS else "20 000 ₸"
        rows.append(
            f'<tr style="border-top:1px solid rgba(15,23,42,.08);"><td style="padding:10px 8px;"><a class="link" href="{href}">{e(name)}</a></td>'
            f'<td style="padding:10px 8px;">{e(cities)}</td><td style="padding:10px 8px;">{e(", ".join(ops))}</td>'
            f'<td style="padding:10px 8px;white-space:nowrap;">{price}</td></tr>'
        )
    head = "".join(f'<th style="padding:10px 8px;text-align:left;">{e(c)}</th>' for c in t["cols"])
    ratings = "".join(
        f'<li>{e(dx.BRANCH[k][lang][0])}: <b>{v["rating"]} ★</b> ({v["ratings"]} {t["of"]}) — <a class="link" href="{v["url"]}" target="_blank" rel="noopener nofollow">2ГИС</a></li>'
        for k, v in reviews["branches"].items()
    )
    return (
        f'{START}<section class="section" id="doctors-guide"><h2 class="section-title">{t["doc_h"]}</h2><p>{e(t["doc_lead"])}</p>'
        f'<div style="overflow-x:auto;"><table style="width:100%;min-width:640px;border-collapse:collapse;font-size:14px;"><thead><tr>{head}</tr></thead><tbody>{"".join(rows)}</tbody></table></div>'
        f'<h2 class="section-title">{t["rating_h"]}</h2><ul>{ratings}</ul>'
        f'{faq_html(t["doc_faq"], lang)}</section>{END}'
    )


def services_block(lang: str) -> str:
    e = html.escape
    t = T[lang]
    rows = []
    for key, o in dx.OPS.items():
        if key == "followup":
            continue
        title, text, price = (o[2], o[3], o[5]) if lang == "kk" else (o[0], o[1], o[4])
        href = o[7] if lang == "kk" else o[6]
        where = WHERE.get(key, ("", ""))[1 if lang == "kk" else 0]
        rows.append(
            f'<tr style="border-top:1px solid rgba(15,23,42,.08);"><td style="padding:10px 8px;vertical-align:top;"><a class="link" href="{href}">{e(title)}</a></td>'
            f'<td style="padding:10px 8px;vertical-align:top;">{e(text)}</td><td style="padding:10px 8px;vertical-align:top;white-space:nowrap;"><b>{e(price)}</b></td>'
            f'<td style="padding:10px 8px;vertical-align:top;">{e(where)}</td></tr>'
        )
    head = "".join(f'<th style="padding:10px 8px;text-align:left;">{e(c)}</th>' for c in t["svc_cols"])
    prices = "/kk/prices/" if lang == "kk" else "/prices/"
    return (
        f'{START}<section class="section" id="services-guide"><h2 class="section-title">{t["svc_h"]}</h2><p>{e(t["svc_lead"])}</p>'
        f'<div style="overflow-x:auto;"><table style="width:100%;min-width:720px;border-collapse:collapse;font-size:14px;"><thead><tr>{head}</tr></thead><tbody>{"".join(rows)}</tbody></table></div>'
        f'<p class="section-note"><a class="link" href="{prices}">{t["prices"]}</a></p>'
        f'{faq_html(t["svc_faq"], lang)}</section>{END}'
    )


def inject(path: Path, content: str) -> bool:
    if not path.exists():
        return False
    t = path.read_text(encoding="utf-8")
    t = re.sub(re.escape(START) + r".*?" + re.escape(END), "", t, flags=re.S)
    anchor = re.search(r'<div class="cta-block"|<section class="cta|<footer', t)
    if not anchor:
        return False
    t = t[: anchor.start()] + content + "\n" + t[anchor.start():]
    path.write_text(t, encoding="utf-8")
    return True


def main() -> None:
    jobs = [
        (ROOT / "doctors" / "index.html", doctors_block("ru")),
        (ROOT / "kk" / "doctors" / "index.html", doctors_block("kk")),
        (ROOT / "uslugi" / "index.html", services_block("ru")),
        (ROOT / "kk" / "uslugi" / "index.html", services_block("kk")),
    ]
    for path, content in jobs:
        print(("catalog: " if inject(path, content) else "SKIP catalog: ") + str(path.relative_to(ROOT)))


if __name__ == "__main__":
    main()
