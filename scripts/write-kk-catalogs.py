#!/usr/bin/env python3
"""Write full KK uslugi + doctors pages in the same SPA visual style as RU."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
SITE = "https://asiakoz.com"

GTM = """<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17817733574"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-17817733574');</script>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TJ4QBS3W');</script>"""


from site_nav import footer_nav_html, header_nav_html


def header_kk(active: str, ru_url: str) -> str:
    return f"""    <header class="site-header">
      <a href="/kk/" class="logo" title="AsiaKoz"><img src="/images/logo-asiakoz.png" alt="AsiaKoz" class="logo-img" /></a>
{header_nav_html("kk")}
      <div class="header-right">
        <div class="lang-switch" role="group" aria-label="Тіл">
          <a class="is-active" hrefLang="kk" aria-current="page">KZ</a>
          <a href="{ru_url}" hrefLang="ru">RU</a>
        </div>
        <a href="https://wa.me/77003600180" class="btn btn-header" target="_blank" rel="noopener">Жазылу</a>
      </div>
    </header>"""


def footer_kk() -> str:
    return """    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-col">
          <div class="footer-logo"><img src="/images/logo-asiakoz.png" alt="AsiaKoz" class="logo-img" /></div>
          <p class="footer-desc">AsiaKoz. Алматы, Ақтау және Шымкент жұмыс істейді.</p>
        </div>
        <div class="footer-col">
          <div class="footer-title">Навигация</div>
{footer_nav_html("kk")}
        </div>
        <div class="footer-col">
          <div class="footer-title">Байланыс</div>
          <p>Алматы: <a href="tel:+77008880180" class="link">+7 700 888 01 80</a></p>
          <p>Ақтау: <a href="tel:+77758630180" class="link">+7 775 863 01 80</a></p>
          <p>Шымкент: <a href="tel:+77080750180" class="link">+7 708 075 01 80</a> · <a href="tel:+77080760180" class="link">+7 708 076 01 80</a></p>
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
        ("diagnostika", "Көру диагностикасы", "Толық тексеру: көру өткірлігі, қысым, көз түбі және көрсеткіш бойынша қосымша әдістер.", "/diagnostika-almaty/"),
        ("lazer", "Лазерлік түзету", "SMILE, Femto-LASIK/LASIK және PRK/LASEK — әдіс диагностикадан кейін таңдалады.", "/lazer-almaty/"),
        ("katarakta", "Катаракта", "Диагностика, ИОЛ таңдау және факоэмульсификация. Монофокалды, ториктік және мультифокалды линзалар.", "/katarakta-almaty/"),
        ("vitrektomiya", "Витрэктомия", "Шыны тәрізді дене мен тор қабық хирургиясы. Тактиканы витреоретинолог анықтайды.", "/vitrektomiya-almaty/"),
        ("glaukoma", "Глаукома", "Көзішілік қысымды бақылау, көру өрісі, ОКТ. Тамшы, лазер немесе операция — сатысына қарай.", "/glaukoma-almaty/"),
        ("kosoglazie", "Қылилық", "Балалар мен ересектердегі қылилық диагностикасы және хирургиясы.", "/kosoglazie/", "/kosoglazie-aktau/"),
        ("icl", "ICL", "Факикалық линза имплантациясы — лазерлік түзетуге балама, көрсеткіш бойынша.", "/icl-almaty/"),
        ("deti", "Балалар офтальмологиясы", "Балаларды тексеру, профосмотр, астигматизм және миопияны бақылау.", "/deti-almaty/"),
        ("retinopatiya", "Диабеттік ретинопатия", "Көз түбін тексеру, ОКТ және диабет асқынуларын емдеу.", "/diabeticheskaya-retinopatiya-almaty/"),
        ("setchatka", "Тор қабық / Retina", "Тор қабық аурулары бойынша негізгі бет: жыртылу, ажырау, макула өзгерістері.", "/setchatka-almaty/"),
        ("srochno", "Шұғыл белгілер", "Жыпылық, шыбындар, перде, көрудің күрт нашарлауы — қашан дереу қаралу керек.", "/srochnye-simptomy-glaz-almaty/"),
        ("doctors", "Дәрігерлер", "AsiaKoz офтальмологтары мен хирургтерінің каталогы.", "/kk/doctors/"),
    ]
    cards_html = []
    for c in cards:
        cid, title, text, href = c[0], c[1], c[2], c[3]
        extra = ""
        if len(c) > 4:
            extra = f' <a class="btn btn-outline" href="{c[4]}">Ақтау</a>'
        cards_html.append(
            f"""        <article class="catalog-card" id="{cid}">
          <h2>{title}</h2>
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
      <p>Бағыттардың қысқа каталогы. Толығырақ ақпарат пен жазылу — қызмет бетінде. Алматы, Ақтау және Шымкент жұмыс істейді.</p>
    </section>
    <section class="section">
      <div class="catalog-grid">
{chr(10).join(cards_html)}
      </div>
    </section>
    <div class="cta-block">
      <h2>Кеңеске жазылу</h2>
      <p>Алматы: <a href="tel:+77008880180">+7 700 888 01 80</a> · Ақтау: <a href="tel:+77758630180">+7 775 863 01 80</a></p>
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
    import subprocess
    import sys

    script = ROOT / "scripts" / "sync-doctors.py"
    if script.exists():
        subprocess.check_call([sys.executable, str(script)], cwd=str(ROOT))
        print("wrote: /kk/doctors/ via sync-doctors.py")


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
