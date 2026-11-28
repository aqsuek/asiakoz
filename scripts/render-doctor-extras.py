#!/usr/bin/env python3
"""Adds a rich block to every doctor profile page (RU + KK):

- where the doctor sees patients (branch, address, hours, consultation price);
- which operations the doctor performs, each explained in plain words, with price;
- patient review excerpts from 2GIS (data/reviews-2gis.json) with a link to the source;
- real clinic photos of the branch (images/clinic/<branch>/).

Runs at the end of build-seo.py. The block sits between markers, so reruns replace it.
Operation lists per doctor come from the clinic (28.11.2026) and patient reviews.
"""

from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
START, END = "<!--doctor-extras:start-->", "<!--doctor-extras:end-->"

BRANCH = {
    "almaty": {
        "ru": ("Алматы", "проспект Райымбека, 176А", "/almaty/"),
        "kk": ("Алматы", "Райымбек даңғылы, 176А", "/kk/almaty/"),
        "wa": "77003600180",
    },
    "aqtau": {
        "ru": ("Актау", "7А микрорайон, 11/3", "/aktau/"),
        "kk": ("Ақтау", "7А шағынауданы, 11/3", "/kk/aqtau/"),
        "wa": "77758630180",
    },
    "shymkent": {
        "ru": ("Шымкент", "улица Байтурсынова, 86/7, мкр. Туран", "/shymkent/"),
        "kk": ("Шымкент", "Байтұрсынов көшесі, 86/7, Тұран", "/kk/shymkent/"),
        "wa": "77080750180",
    },
}

# key: (RU title, RU explanation, KK title, KK explanation, price RU, price KK, RU link, KK link)
OPS = {
    "smile": ("Лазерная коррекция ReLEx SMILE", "Лазер исправляет близорукость и астигматизм через микроразрез 2–4 мм, без лоскута. Обычно хорошее зрение уже через 1–2 дня.",
              "ReLEx SMILE лазерлік түзету", "Лазер миопия мен астигматизмді 2–4 мм шағын тілік арқылы, қақпақшасыз түзетеді. Әдетте 1–2 күнде жақсы көреді.",
              "650 000 ₸ за оба глаза", "екі көзге 650 000 ₸", "/smile-lasik-prk/", "/kk/smile-lasik-prk/"),
    "lasik_prk": ("Лазерная коррекция LASIK и PRK", "LASIK — коррекция под тонким лоскутом роговицы, PRK — по поверхности роговицы, когда она тонкая. Исправляют близорукость, дальнозоркость и астигматизм.",
                  "LASIK және PRK лазерлік түзету", "LASIK — мөлдір қабықтың жұқа қақпақшасы астында, PRK — мөлдір қабық жұқа болса, оның бетінде жасалады. Миопия, гиперметропия және астигматизмді түзетеді.",
                  "LASIK от 300 000 ₸, PRK от 200 000 ₸", "LASIK 300 000 ₸-дан, PRK 200 000 ₸-дан", "/lazer-shymkent/", "/kk/lazer-shymkent/"),
    "cataract": ("Операция катаракты", "Помутневший хрусталик заменяют искусственной линзой (ИОЛ) через микроразрез — факоэмульсификация. Линзы: монофокальные, торические, мультифокальные, трифокальные (Alcon, Rayner).",
                 "Катаракта операциясы", "Бұлыңғырланған көз бұршағы шағын тілік арқылы жасанды линзаға (ИОЛ) ауыстырылады — факоэмульсификация. Линзалар: монофокалды, торикалық, мультифокалды, трифокалды (Alcon, Rayner).",
                 "от 450 000 ₸", "450 000 ₸-дан", "/katarakta-almaty/", "/kk/katarakta-almaty/"),
    "vitrectomy": ("Витрэктомия и операции на сетчатке", "Операция внутри глаза при отслойке сетчатки, кровоизлиянии (гемофтальме), макулярном разрыве и диабетической ретинопатии.",
                   "Витрэктомия және тор қабық операциялары", "Тор қабық ажырағанда, көзге қан құйылғанда (гемофтальм), макула жыртылғанда және диабеттік ретинопатияда көз ішінде жасалатын ота.",
                   "от 1 000 000 ₸", "1 000 000 ₸-дан", "/vitrektomiya-almaty/", "/kk/vitrektomiya-almaty/"),
    "strabismus": ("Операция при косоглазии", "Хирург меняет натяжение глазных мышц, чтобы глаза смотрели прямо. Детям — под общим наркозом, взрослым чаще под местным.",
                   "Қылилық операциясы", "Хирург көз бұлшықеттерінің керілуін өзгертіп, көзді түзу қаратады. Балаларға — жалпы наркозбен, ересектерге көбіне жергілікті жансыздандырумен.",
                   "от 600 000 ₸", "600 000 ₸-дан", "/operatsiya-kosoglazie-almaty/", "/kk/kosoglazie/"),
    "glaucoma": ("Операция при глаукоме", "Операция снижает внутриглазное давление, чтобы сохранить зрительный нерв, когда капли уже не помогают.",
                 "Глаукома операциясы", "Тамшылар көмектеспегенде көру нервін сақтау үшін көзішілік қысымды төмендететін ота.",
                 "от 500 000 ₸", "500 000 ₸-дан", "/operatsiya-glaukoma-almaty/", "/kk/operatsiya-glaukoma-almaty/"),
    "pterygium": ("Удаление птеригиума", "Удаление разрастания конъюнктивы на роговицу; используется методика, снижающая риск повторного роста.",
                  "Птеригиумды алып тастау", "Мөлдір қабыққа өсіп кеткен конъюнктиваны алып тастау; қайта өсу қаупін азайтатын әдіс қолданылады.",
                  "по итогам осмотра", "қаралғаннан кейін", "/pterigiym-almaty/", "/kk/pterigiym-almaty/"),
    "injections": ("Интравитреальные инъекции", "Лекарство вводят внутрь глаза при макулярном отёке, ВМД и диабетическом поражении сетчатки.",
                   "Интравитреальды инъекциялар", "Макула ісінгенде, ВМД және диабеттік тор қабық зақымданғанда дәрі көз ішіне енгізіледі.",
                   "по итогам осмотра", "қаралғаннан кейін", "/intravitrealnye-inektsii-almaty/", "/kk/intravitrealnye-inektsii-almaty/"),
    "diagnostics": ("Полная диагностика и приём", "Острота и рефракция, давление, глазное дно, ОКТ по показаниям; врач объясняет диагноз и план лечения.",
                    "Толық диагностика және қабылдау", "Көру өткірлігі мен рефракция, қысым, көз түбі, көрсеткіш болса ОКТ; дәрігер диагноз бен ем жоспарын түсіндіреді.",
                    "20 000 ₸ (с переводчиком)", "20 000 ₸ (аудармашымен)", "/diagnostika-almaty/", "/kk/diagnostika-almaty/"),
    "kids": ("Детская офтальмология", "Профосмотр перед садом и школой, близорукость, астигматизм, косоглазие, амблиопия — с графиком наблюдения.",
             "Балалар офтальмологиясы", "Бала бақша мен мектеп алдындағы тексеру, миопия, астигматизм, қылилық, амблиопия — бақылау кестесімен.",
             "20 000 ₸ у турецкого врача, 10 000–15 000 ₸ у казахстанского", "түрік дәрігерінде 20 000 ₸, қазақстандық дәрігерде 10 000–15 000 ₸", "/deti-almaty/", "/kk/deti-almaty/"),
    "followup": ("Ведение до и после операции", "Подготовка к операции, контрольные осмотры, подбор капель и объяснение ухода после вмешательства.",
                 "Отаға дейін және кейін бақылау", "Отаға дайындық, бақылау қаралулары, тамшыларды таңдау және отадан кейінгі күтімді түсіндіру.",
                 "20 000 ₸", "20 000 ₸", "/diagnostika-almaty/", "/kk/diagnostika-almaty/"),
}

# Branch-specific service links (Aktau/Shymkent have their own city pages).
CITY_LINK = {
    ("cataract", "aqtau"): ("/katarakta-aktau/", "/kk/katarakta-aktau/"),
    ("cataract", "shymkent"): ("/katarakta-shymkent/", "/kk/katarakta-shymkent/"),
    ("smile", "aqtau"): ("/lazer-aktau/", "/kk/lazer-aktau/"),
    ("diagnostics", "aqtau"): ("/diagnostika-aktau/", "/kk/diagnostika-aktau/"),
    ("diagnostics", "shymkent"): ("/diagnostika-shymkent/", "/kk/diagnostika-shymkent/"),
    ("kids", "aqtau"): ("/deti-aktau/", "/kk/deti-aktau/"),
    ("kids", "shymkent"): ("/deti-shymkent/", "/kk/deti-shymkent/"),
    ("vitrectomy", "aqtau"): ("/vitrektomiya-aktau/", "/kk/vitrektomiya-aktau/"),
    ("vitrectomy", "shymkent"): ("/vitrektomiya-shymkent/", "/kk/vitrektomiya-shymkent/"),
    ("strabismus", "aqtau"): ("/kosoglazie-aktau/", "/kk/kosoglazie-aktau/"),
    ("strabismus", "shymkent"): ("/kosoglazie-shymkent/", "/kk/kosoglazie-shymkent/"),
    ("glaucoma", "aqtau"): ("/glaukoma-aktau/", "/kk/glaukoma-aktau/"),
    ("glaucoma", "shymkent"): ("/glaukoma-shymkent/", "/kk/glaukoma-shymkent/"),
}

# Kazakhstani doctors: consultation 10 000–15 000 ₸ (Turkish doctors: 20 000 ₸ with diagnostics and interpreter).
LOCAL_DOCTORS = {"aliya", "musay", "nazgul-sagyndykova"}

DOCTOR_OPS = {
    "mehmet-esat-teker": ["smile", "cataract", "strabismus", "pterygium", "injections", "glaucoma"],
    "orel-talip": ["vitrectomy", "cataract", "strabismus", "injections", "smile"],
    "aliya": ["diagnostics", "cataract", "kids"],
    "musay": ["diagnostics", "followup"],
    "ali-keskin": ["smile", "cataract", "strabismus", "vitrectomy"],
    "erol-joshkun": ["smile", "cataract", "strabismus"],
    "nazgul-sagyndykova": ["diagnostics", "kids"],
    "kadyr-kyrboga": ["lasik_prk", "cataract", "strabismus", "glaucoma", "vitrectomy", "diagnostics"],
}

T = {
    "ru": {
        "where": "Где принимает", "hours": "Пн–Пт 9:00–17:00, Сб 9:00–14:00", "consult": "Приём с диагностикой и переводчиком — 20 000 ₸",
        "consult_local": "Приём — 10 000–15 000 ₸",
        "ops": "Какие операции и лечение проводит", "price": "Цена", "more": "Подробнее",
        "reviews": "Отзывы пациентов", "src": "Выдержки из отзывов на 2ГИС, орфография авторов.", "all": "Все отзывы на 2ГИС",
        "rating": "Рейтинг филиала на 2ГИС", "of": "оценок", "photos": "Фото клиники", "wa": "Записаться к врачу в WhatsApp",
        "prices": "Все цены", "stats": "В цифрах",
    },
    "kk": {
        "where": "Қай жерде қабылдайды", "hours": "Дс–Жм 9:00–17:00, Сб 9:00–14:00", "consult": "Диагностика мен аудармашы қоса қабылдау — 20 000 ₸",
        "consult_local": "Қабылдау — 10 000–15 000 ₸",
        "ops": "Қандай ота мен ем жасайды", "price": "Бағасы", "more": "Толығырақ",
        "reviews": "Пациенттердің пікірлері", "src": "2ГИС-тегі пікірлерден үзінділер, авторлардың жазуы сақталған.", "all": "2ГИС-тегі барлық пікірлер",
        "rating": "Филиалдың 2ГИС-тегі рейтингі", "of": "баға", "photos": "Клиника фотолары", "wa": "Дәрігерге WhatsApp арқылы жазылу",
        "prices": "Барлық бағалар", "stats": "Сандармен",
    },
}

CSS = """<style>
.dx-wrap{margin:32px 0}.dx-grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
.dx-card{border:1px solid rgba(15,23,42,.08);border-radius:14px;padding:16px;background:#fff}
.dx-card h3{margin:0 0 6px;font-size:16px}.dx-card p{margin:0 0 8px;font-size:14px;line-height:1.5}
.dx-price{font-weight:700;color:#00839a}.dx-q{font-size:14px;line-height:1.5;margin:0}.dx-who{font-size:12px;color:#64748b;margin-top:6px}
.dx-photos{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}.dx-photos img{width:100%;height:240px;object-fit:cover;border-radius:12px}
.dx-stats{display:flex;flex-wrap:wrap;gap:10px}.dx-stats div{background:#eef9fb;border-radius:12px;padding:10px 14px}.dx-stats b{display:block;font-size:20px}
</style>"""


def city_of(ui: dict) -> str:
    cities = ui.get("cities") or ["almaty"]
    return cities[0]


def block(ui: dict, lang: str, reviews: dict) -> str:
    e = html.escape
    t = T[lang]
    did = ui["id"]
    cities = ui.get("cities") or ["almaty"]
    main_city = city_of(ui)
    name = ui["nameKz"] if lang == "kk" else ui["nameRu"]
    parts = [CSS, f'<section class="section dx-wrap" id="doctor-details">']

    stats = ui.get("stats") or []
    if stats:
        items = "".join(
            f'<div><b>{e(s.get("valueKz" if lang == "kk" else "valueRu", ""))}</b>{e(s.get("labelKz" if lang == "kk" else "labelRu", ""))}</div>'
            for s in stats
        )
        parts.append(f'<h2 class="section-title">{e(name)} — {t["stats"].lower()}</h2><div class="dx-stats">{items}</div>')

    where = []
    for c in cities:
        b = BRANCH.get(c)
        if not b:
            continue
        cname, addr, href = b[lang]
        where.append(
            f'<div class="dx-card"><h3><a class="link" href="{href}">AsiaKoz {e(cname)}</a></h3><p>{e(addr)}</p>'
            f'<p>{t["hours"]}</p><p class="dx-price">{t["consult_local"] if did in LOCAL_DOCTORS else t["consult"]}</p>'
            f'<p><a class="link" href="https://wa.me/{b["wa"]}" target="_blank" rel="noopener">{t["wa"]}</a></p></div>'
        )
    parts.append(f'<h2 class="section-title">{t["where"]}</h2><div class="dx-grid">{"".join(where)}</div>')

    ops = []
    for key in DOCTOR_OPS.get(did, []):
        o = OPS[key]
        title, text, price = (o[2], o[3], o[5]) if lang == "kk" else (o[0], o[1], o[4])
        if did in LOCAL_DOCTORS and key in ("diagnostics", "followup", "kids"):
            price = "10 000–15 000 ₸"
        href = o[7] if lang == "kk" else o[6]
        city_href = CITY_LINK.get((key, main_city))
        if city_href:
            href = city_href[1] if lang == "kk" else city_href[0]
        if key == "smile" and main_city == "shymkent":
            continue
        ops.append(
            f'<div class="dx-card"><h3>{e(title)}</h3><p>{e(text)}</p>'
            f'<p><span class="dx-price">{t["price"]}: {e(price)}</span> · <a class="link" href="{href}">{t["more"]}</a></p></div>'
        )
    if ops:
        prices = "/kk/prices/" if lang == "kk" else "/prices/"
        parts.append(
            f'<h2 class="section-title">{t["ops"]}</h2><div class="dx-grid">{"".join(ops)}</div>'
            f'<p class="section-note"><a class="link" href="{prices}">{t["prices"]}</a></p>'
        )

    revs = reviews["doctors"].get(did, [])
    br = reviews["branches"].get(main_city)
    if revs and br:
        cards = "".join(
            f'<div class="dx-card"><p class="dx-q">«{e(r["q"])}»</p><p class="dx-who">{e(r["n"])} · {e(r["d"])} · 2ГИС</p></div>'
            for r in revs
        )
        parts.append(
            f'<h2 class="section-title">{t["reviews"]}</h2>'
            f'<p>{t["rating"]}: <b>{br["rating"]} ★</b> ({br["ratings"]} {t["of"]}). '
            f'<a class="link" href="{br["url"]}" target="_blank" rel="noopener nofollow">{t["all"]}</a></p>'
            f'<div class="dx-grid">{cards}</div><p class="section-note">{t["src"]}</p>'
        )

    photo_dir = ROOT / "images" / "clinic" / ("aktau" if main_city == "aqtau" else main_city)
    photos = sorted(photo_dir.glob("*.jpg"))[:4] if photo_dir.exists() else []
    if photos:
        cname = BRANCH[main_city][lang][0]
        imgs = "".join(
            f'<img src="/images/clinic/{p.parent.name}/{p.name}" alt="{"AsiaKoz " + e(cname) + (" клиникасы" if lang == "kk" else " — клиника")}" loading="lazy" decoding="async" width="900" height="1200" />'
            for p in photos
        )
        parts.append(f'<h2 class="section-title">{t["photos"]} — {e(cname)}</h2><div class="dx-photos">{imgs}</div>')

    parts.append("</section>")
    return START + "\n".join(parts) + END


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
    docs = json.loads((ROOT / "data" / "doctors-ui.json").read_text(encoding="utf-8"))
    reviews = json.loads((ROOT / "data" / "reviews-2gis.json").read_text(encoding="utf-8"))
    for ui in docs:
        ru = ROOT / (ui.get("profileUrl") or f"/doctor-{ui['id']}/").strip("/") / "index.html"
        kk = ROOT / (ui.get("profileUrlKz") or f"/kk/doctor-{ui['id']}/").strip("/") / "index.html"
        for lang, path in (("ru", ru), ("kk", kk)):
            ok = inject(path, block(ui, lang, reviews))
            print(("extras: " if ok else "SKIP extras: ") + str(path.relative_to(ROOT)))


if __name__ == "__main__":
    main()
