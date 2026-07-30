#!/usr/bin/env python3
"""Write full KK uslugi + doctors pages in the same SPA visual style as RU."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://asiakoz.com"

GTM = """<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17817733574"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-17817733574');</script>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TJ4QBS3W');</script>"""


def header_kk(active: str, ru_url: str) -> str:
    return f"""    <header class="site-header">
      <a href="/kk/" class="logo" title="AsiaKoz"><img src="/images/logo-asiakoz.png" alt="AsiaKoz" class="logo-img" /></a>
      <nav class="header-nav">
        <a href="/kk/almaty/">Алматы</a>
        <a href="/kk/aqtau/">Ақтау</a>
        <a href="/kk/shymkent/">Шымкент</a>
        <a href="/kk/uslugi/"{' aria-current="page"' if active=='uslugi' else ''}>Қызметтер</a>
        <a href="/kk/doctors/"{' aria-current="page"' if active=='doctors' else ''}>Дәрігерлер</a>
      </nav>
      <div class="header-right">
        <a href="https://wa.me/77003600180" class="btn btn-header" target="_blank" rel="noopener">Жазылу</a>
        <a href="{ru_url}" class="hreflang-switch" hreflang="ru">RU</a>
      </div>
    </header>"""


def footer_kk() -> str:
    return """    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-col">
          <div class="footer-logo"><img src="/images/logo-asiakoz.png" alt="AsiaKoz" class="logo-img" /></div>
          <p class="footer-desc">AsiaKoz. Алматы мен Ақтау жұмыс істейді. Шымкент — жақында ашылады.</p>
        </div>
        <div class="footer-col">
          <div class="footer-title">Навигация</div>
          <a href="/kk/uslugi/">Қызметтер</a>
          <a href="/kk/doctors/">Дәрігерлер</a>
          <a href="/kk/almaty/">Алматы</a>
          <a href="/kk/aqtau/">Ақтау</a>
          <a href="/kk/shymkent/">Шымкент</a>
        </div>
        <div class="footer-col">
          <div class="footer-title">Байланыс</div>
          <p>Алматы: <a href="tel:+77003600180" class="link">+7 700 360 01 80</a></p>
          <p>Ақтау: <a href="tel:+77758630180" class="link">+7 775 863 01 80</a></p>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-disclaimer">Қарсы көрсеткіштер бар. Маман кеңесі қажет.</p>
        <p class="footer-copy">© AsiaKoz</p>
      </div>
    </footer>"""


def write_kk_uslugi() -> None:
    path = ROOT / "kk" / "uslugi" / "index.html"
    path.parent.mkdir(parents=True, exist_ok=True)
    cards = [
        ("diagnostika", "Көру диагностикасы", "Филиал: Алматы · Ақтау", "Толық тексеру: көру өткірлігі, қысым, көз түбі және көрсеткіш бойынша қосымша әдістер.", "/diagnostika-almaty/"),
        ("lazer", "Лазерлік түзету", "Филиал: Алматы", "SMILE, Femto-LASIK/LASIK және PRK/LASEK — әдіс диагностикадан кейін таңдалады.", "/lazer-almaty/"),
        ("katarakta", "Катаракта", "Филиал: Алматы · Ақтау", "Диагностика, ИОЛ таңдау және факоэмульсификация. Монофокалды, ториктік және мультифокалды линзалар.", "/katarakta-almaty/"),
        ("vitrektomiya", "Витрэктомия", "Филиал: Алматы", "Шыны тәрізді дене мен тор қабық хирургиясы. Тактиканы витреоретинолог анықтайды.", "/vitrektomiya-almaty/"),
        ("glaukoma", "Глаукома", "Филиал: Алматы · Ақтау", "Көзішілік қысымды бақылау, көру өрісі, ОКТ. Тамшы, лазер немесе операция — сатысына қарай.", "/glaukoma-almaty/"),
        ("kosoglazie", "Қылилық", "Филиал: Алматы · Ақтау", "Балалар мен ересектердегі қылилық диагностикасы және хирургиясы.", "/kosoglazie/", "/kosoglazie-aktau/"),
        ("icl", "ICL", "Филиал: Алматы", "Факикалық линза имплантациясы — лазерлік түзетуге балама, көрсеткіш бойынша.", "/icl-almaty/"),
        ("deti", "Балалар офтальмологиясы", "Филиал: Алматы", "Балаларды тексеру, профосмотр, астигматизм және миопияны бақылау.", "/deti-almaty/"),
        ("retinopatiya", "Диабеттік ретинопатия", "Филиал: Алматы", "Көз түбін тексеру, ОКТ және диабет асқынуларын емдеу.", "/diabeticheskaya-retinopatiya-almaty/"),
        ("setchatka", "Тор қабық / Retina", "Филиал: Алматы", "Тор қабық аурулары бойынша негізгі бет: жыртылу, ажырау, макула өзгерістері.", "/setchatka-almaty/"),
        ("srochno", "Шұғыл белгілер", "Филиал: Алматы", "Жыпылық, шыбындар, перде, көрудің күрт нашарлауы — қашан дереу қаралу керек.", "/srochnye-simptomy-glaz-almaty/"),
        ("doctors", "Дәрігерлер", "Алматы · Ақтау", "AsiaKoz офтальмологтары мен хирургтерінің каталогы.", "/kk/doctors/"),
    ]
    cards_html = []
    for c in cards:
        cid, title, meta, text, href = c[0], c[1], c[2], c[3], c[4]
        extra = ""
        if len(c) > 5:
            extra = f' <a class="btn btn-outline" href="{c[5]}">Ақтау</a>'
        cards_html.append(
            f"""        <article class="catalog-card" id="{cid}">
          <h2>{title}</h2>
          <p class="meta">{meta}</p>
          <p>{text}</p>
          <a class="btn" href="{href}">Толығырақ</a>{extra}
        </article>"""
        )
    html = f"""<!DOCTYPE html>
<html lang="kk">
<head>
{GTM}
  <meta charset="UTF-8" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AsiaKoz офтальмологиялық клиникасының қызметтері</title>
  <meta name="description" content="Диагностика, лазерлік түзету, катаракта, глаукома, витрэктомия және AsiaKoz-тың басқа қызметтері. Алматы мен Ақтау." />
  <link rel="canonical" href="{SITE}/kk/uslugi/" />
  <link rel="alternate" hreflang="ru-KZ" href="{SITE}/uslugi/" />
  <link rel="alternate" hreflang="kk-KZ" href="{SITE}/kk/uslugi/" />
  <link rel="alternate" hreflang="x-default" href="{SITE}/uslugi/" />
  <meta property="og:site_name" content="AsiaKoz" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="kk_KZ" />
  <meta property="og:title" content="AsiaKoz қызметтері" />
  <meta property="og:description" content="AsiaKoz қызметтер каталогы — Алматы мен Ақтау." />
  <meta property="og:url" content="{SITE}/kk/uslugi/" />
  <meta property="og:image" content="{SITE}/images/logo-asiakoz.png" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="stylesheet" href="/css/style.css" />
</head>
<body>
  <div class="container">
{header_kk('uslugi', '/uslugi/')}
    <nav class="breadcrumb"><a href="/kk/">Басты бет</a> / Қызметтер</nav>
    <section class="spa-hero">
      <div class="spa-eyebrow">AsiaKoz · Қызметтер</div>
      <h1>AsiaKoz қызметтері</h1>
      <p>Бағыттардың қысқа каталогы. Толығырақ ақпарат пен жазылу — қызмет бетінде. Алматы мен Ақтау жұмыс істейді, Шымкент — жақында ашылады.</p>
    </section>
    <section class="section">
      <div class="catalog-grid">
{chr(10).join(cards_html)}
      </div>
    </section>
    <div class="cta-block">
      <h2>Кеңеске жазылу</h2>
      <p>Алматы: <a href="tel:+77003600180">+7 700 360 01 80</a> · Ақтау: <a href="tel:+77758630180">+7 775 863 01 80</a></p>
      <a href="https://wa.me/77003600180" class="btn" target="_blank" rel="noopener">WhatsApp Алматы</a>
      <a href="https://wa.me/77758630180" class="btn btn-outline" target="_blank" rel="noopener" style="margin-left:8px;">WhatsApp Ақтау</a>
    </div>
{footer_kk()}
  </div>
  <script src="/js/compliance.js"></script>
</body>
</html>
"""
    path.write_text(html, encoding="utf-8")
    print("wrote: /kk/uslugi/ full catalog")


def write_kk_doctors() -> None:
    path = ROOT / "kk" / "doctors" / "index.html"
    path.parent.mkdir(parents=True, exist_ok=True)
    doctors = [
        ("/doctor-orel/", "/images/doctor-orel.png", "Орел Талип", "Витреоретинолог", "almaty", ["Қылилық", "Витрэктомия", "Тор қабық"]),
        ("/doctor-mehmet-esat-teker/", "/images/doctor-mehmet-esat-teker.png", "Мехмет Есат Текер", "Офтальмолог-хирург", "almaty", ["Лазер", "Катаракта", "Глаукома"]),
        ("/doctor-aliya/", "/images/doctor-aliya.png", "Алия Усманова", "Офтальмохирург", "almaty", ["Лазер", "Катаракта"]),
        ("/doctor-musay/", "/images/doctor-musay.png", "Нұрмұхамед Мусай", "Бас дәрігер", "almaty", ["Бас дәрігер"]),
        ("/doctor-ali-keskin/", "/images/doctor-ali-keskin.png", "Али Кескин", "Офтальмолог-хирург", "aktau", ["Макула", "Қылилық", "Тор қабық"]),
        ("/doctor-erol/", "/images/doctor-erol.png", "Эрол Джошкун", "Офтальмолог-хирург", "aktau", ["Қылилық", "Катаракта", "Глаукома"]),
        ("/doctor-nazgul/", "/images/doctor-nazgul.png", "Назгуль Сагындыкова", "Дәрігер-офтальмолог", "aktau", ["Ересектер мен балалар"]),
    ]
    cards = []
    for href, img, name, role, city, tags in doctors:
        badge = "branch-badge-almaty" if city == "almaty" else "branch-badge-aktau"
        city_label = "Алматы" if city == "almaty" else "Ақтау"
        tags_html = "".join(f'<span class="doctor-tag">{t}</span>' for t in tags)
        cards.append(
            f"""        <article class="doctor-card"><a class="doctor-card-inner" href="{href}"><div class="doctor-photo-wrap"><img src="{img}" alt="{name}" loading="lazy" /></div><div class="doctor-body"><div class="doctor-meta"><span class="doctor-role">{role}</span><span class="{badge}">{city_label}</span></div><h3 class="doctor-name">{name}</h3><div class="doctor-tags">{tags_html}</div><div class="doctor-action">Толығырақ →</div></div></a></article>"""
        )
    html = f"""<!DOCTYPE html>
<html lang="kk">
<head>
{GTM}
  <meta charset="UTF-8" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AsiaKoz дәрігер-офтальмологтары — Алматы және Ақтау</title>
  <meta name="description" content="AsiaKoz клиникасының офтальмологтары мен офтальмохирургтері Алматы мен Ақтауда. Дәрігерді таңдап, WhatsApp арқылы жазылыңыз." />
  <link rel="canonical" href="{SITE}/kk/doctors/" />
  <link rel="alternate" hreflang="ru-KZ" href="{SITE}/doctors/" />
  <link rel="alternate" hreflang="kk-KZ" href="{SITE}/kk/doctors/" />
  <link rel="alternate" hreflang="x-default" href="{SITE}/doctors/" />
  <meta property="og:site_name" content="AsiaKoz" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="kk_KZ" />
  <meta property="og:title" content="AsiaKoz дәрігерлері" />
  <meta property="og:description" content="Алматы мен Ақтаудағы AsiaKoz дәрігерлері." />
  <meta property="og:url" content="{SITE}/kk/doctors/" />
  <meta property="og:image" content="{SITE}/images/logo-asiakoz.png" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="stylesheet" href="/css/style.css" />
</head>
<body>
  <div class="container">
{header_kk('doctors', '/doctors/')}
    <nav class="breadcrumb"><a href="/kk/">Басты бет</a> / Дәрігерлер</nav>
    <section class="spa-hero">
      <div class="spa-eyebrow">AsiaKoz · Дәрігерлер</div>
      <h1>AsiaKoz дәрігерлері</h1>
      <p>Қабылдау Алматы мен Ақтауда. Шымкент — жақында ашылады, алдын ала жазылу филиал бетінде.</p>
      <div class="spa-actions">
        <a class="btn" href="https://wa.me/77003600180" target="_blank" rel="noopener">WhatsApp Алматы</a>
        <a class="btn btn-outline" href="https://wa.me/77758630180" target="_blank" rel="noopener">WhatsApp Ақтау</a>
      </div>
    </section>
    <div class="spa-branch-grid">
      <article class="spa-branch-card"><h2>Алматы</h2><p>Райымбек даңғылы, 176А</p><p><a class="link" href="tel:+77003600180">+7 700 360 01 80</a></p><p><a class="link" href="/kk/almaty/">Филиал беті →</a></p></article>
      <article class="spa-branch-card"><h2>Ақтау</h2><p>7А ш/а, 11/3</p><p><a class="link" href="tel:+77758630180">+7 775 863 01 80</a></p><p><a class="link" href="/kk/aqtau/">Филиал беті →</a></p></article>
      <article class="spa-branch-card soon"><h2>Шымкент</h2><p>Жақында ашылады. Алдын ала жазылу.</p><p><a class="link" href="tel:+77080750180">+7 708 075 01 80</a></p><p><a class="link" href="/kk/shymkent/">Филиал беті →</a></p></article>
    </div>
    <section class="section">
      <h2 class="section-title">Дәрігерлер каталогы</h2>
      <p class="section-subtitle">Дәрігерді таңдап, профиль арқылы жазылыңыз.</p>
      <div class="doctors-grid">
{chr(10).join(cards)}
      </div>
    </section>
    <div class="cta-block">
      <h2>Қабылдауға жазылу</h2>
      <p>WhatsApp арқылы жазылыңыз — дәрігер мен уақытты таңдаймыз.</p>
      <a href="https://wa.me/77003600180" class="btn" target="_blank" rel="noopener">WhatsApp Алматы</a>
      <a href="https://wa.me/77758630180" class="btn btn-outline" target="_blank" rel="noopener" style="margin-left:8px;">WhatsApp Ақтау</a>
    </div>
{footer_kk()}
  </div>
  <script src="/js/compliance.js"></script>
</body>
</html>
"""
    path.write_text(html, encoding="utf-8")
    print("wrote: /kk/doctors/ full catalog")


def swap_logos_in_static() -> None:
    n = 0
    for path in ROOT.rglob("index.html"):
        if any(x in path.parts for x in ["asiakoz-homepage", "node_modules", ".git", "assets", "videos"]):
            continue
        t = path.read_text(encoding="utf-8", errors="ignore")
        if "noindex" in t.lower() and 'http-equiv="refresh"' in t.lower():
            continue
        nt = t.replace('src="/images/logo.png"', 'src="/images/logo-asiakoz.png"')
        nt = nt.replace('src="../images/logo.png"', 'src="/images/logo-asiakoz.png"')
        if nt != t:
            path.write_text(nt, encoding="utf-8")
            n += 1
    print("logo swapped on", n, "pages")


def main() -> None:
    write_kk_uslugi()
    write_kk_doctors()
    swap_logos_in_static()
    # RU doctors/uslugi logos too
    for rel in ("doctors/index.html", "uslugi/index.html"):
        p = ROOT / rel
        if p.exists():
            t = p.read_text(encoding="utf-8")
            t = t.replace('src="/images/logo.png"', 'src="/images/logo-asiakoz.png"')
            p.write_text(t, encoding="utf-8")


if __name__ == "__main__":
    main()
