"""Extra hub-tier sections: price block, urgent alert."""

from __future__ import annotations

import urllib.parse

from premium_content import get_category


def hub_price_html(
    dx_id: str,
    lang: str,
    city_name: str,
    wa: str,
    topic: str,
) -> str:
    cat = get_category(dx_id)
    greet = "Сәлеметсіз бе!" if lang == "kk" else "Здравствуйте!"
    wa_q = urllib.parse.quote(f"{greet} {topic} — {city_name}.")
    wa_link = f"https://wa.me/{wa}?text={wa_q}"

    if lang == "kk":
        title = f"{city_name} қаласындағы бағалар"
        sub = "Баға ориентирлік. Нақты сома диагностикадан кейін."
        note = "Жария оферта емес."
        cta = "WhatsApp-қа жазу"
        diag_t = "Диагностика және дәрігер қабылдауы"
        diag_v = "20 000 ₸-дан"
        diag_p = "Зерттеулер тізімі көрсеткіш бойынша."
    else:
        title = f"Стоимость в {city_name}"
        sub = "Цены ориентировочные. Точная сумма — после диагностики."
        note = "Указанная стоимость не является публичной офертой."
        cta = "Записаться в WhatsApp"
        diag_t = "Полная диагностика и приём офтальмолога"
        diag_v = "от 20 000 ₸"
        diag_p = "Состав обследований определяется индивидуально."

    op_card = ""
    if cat == "retina":
        if lang == "kk":
            op_t, op_v, op_p = "Витрэктомия (ориентир)", "1 000 000–1 600 000 ₸", "Диагнозға байланысты."
        else:
            op_t, op_v, op_p = (
                "Витрэктомия (ориентир)",
                "1 000 000–1 600 000 ₸",
                "Зависит от диагноза, объёма операции и материалов. Точная цена — после ОКТ и консультации витреоретинолога.",
            )
        op_card = f"""        <article class="price-card price-card--accent">
          <p class="price-card__label">{'Операция' if lang == 'ru' else 'Операция'}</p>
          <h3 class="price-card__title">{op_t}</h3>
          <p class="price-card__value">{op_v}</p>
          <p class="price-card__text">{op_p}</p>
          <a class="btn" href="{wa_link}" target="_blank" rel="noopener">{'Узнать точную стоимость' if lang == 'ru' else 'Бағаны сұрау'}</a>
        </article>"""
    elif cat == "cataract":
        if lang == "kk":
            op_t, op_v, op_p = "Катаракта операциясы", "350 000–1 200 000 ₸", "ИОЛ түріне байланысты."
        else:
            op_t, op_v, op_p = (
                "Операция катаракты (ФЭК + ИОЛ)",
                "350 000–1 200 000 ₸",
                "Зависит от типа искусственного хрусталика и клинической ситуации.",
            )
        op_card = f"""        <article class="price-card price-card--accent">
          <p class="price-card__label">Операция</p>
          <h3 class="price-card__title">{op_t}</h3>
          <p class="price-card__value">{op_v}</p>
          <p class="price-card__text">{op_p}</p>
          <a class="btn" href="{wa_link}" target="_blank" rel="noopener">{'Узнать точную стоимость' if lang == 'ru' else 'Бағаны сұрау'}</a>
        </article>"""
    elif cat == "refraction" and dx_id == "icl":
        if lang == "kk":
            op_t, op_v, op_p = "ICL имплантациясы", "Диагностикадан кейін", "Линза түрі мен есеп."
        else:
            op_t, op_v, op_p = ("ICL имплантация", "После диагностики", "Зависит от типа линзы и расчёта.")
        op_card = f"""        <article class="price-card price-card--accent">
          <p class="price-card__label">ICL</p>
          <h3 class="price-card__title">{op_t}</h3>
          <p class="price-card__value">{op_v}</p>
          <p class="price-card__text">{op_p}</p>
          <a class="btn" href="{wa_link}" target="_blank" rel="noopener">{cta}</a>
        </article>"""

    return f"""    <section class="section" id="price">
      <h2 class="section-title">{title}</h2>
      <p class="section-subtitle">{sub}</p>
      <div class="price-grid">
        <article class="price-card">
          <p class="price-card__label">{'Диагностика' if lang == 'ru' else 'Диагностика'}</p>
          <h3 class="price-card__title">{diag_t}</h3>
          <p class="price-card__value">{diag_v}</p>
          <p class="price-card__text">{diag_p}</p>
        </article>
{op_card}
      </div>
      <p class="price-note">{note}</p>
    </section>"""


def urgent_alert_html(dx_id: str, lang: str, city_name: str, wa: str) -> str:
    cat = get_category(dx_id)
    if cat != "retina":
        return ""
    greet = "Сәлеметсіз бе!" if lang == "kk" else "Здравствуйте!"
    text = (
        f"{greet} Нужна срочная диагностика сетчатки — {city_name}."
        if lang == "ru"
        else f"{greet} Тор қабық шұғыл диагностикасы — {city_name}."
    )
    wa_link = f"https://wa.me/{wa}?text=" + urllib.parse.quote(text)
    if lang == "kk":
        title = "Қашан шұғыл дәрігерге жүгіну керек"
        body = (
            "Жыпылық, «ұшқындар» кенет көбейсе, бүйірден перде немесе күрт нашарлау болса — кідіртпеңіз. "
            "Бұл тор қабық жыртылуы немесе ажырау белгісі болуы мүмкін."
        )
        cta = "Шұғыл диагностикаға жазылу"
    else:
        title = "Когда нужно срочно обратиться к офтальмологу"
        body = (
            "Не откладывайте осмотр при вспышках, резком увеличении «мушек», тени сбоку или кратком падении зрения. "
            "Это может быть разрыв или отслойка сетчатки — нужна срочная диагностика."
        )
        cta = "Записаться на срочную диагностику"
    return f"""    <section class="section" id="urgent">
      <div class="urgent-alert" role="note">
        <h2 class="urgent-alert__title">{title}</h2>
        <p>{body}</p>
        <a class="btn" href="{wa_link}" target="_blank" rel="noopener">{cta}</a>
      </div>
    </section>"""
