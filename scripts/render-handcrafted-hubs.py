#!/usr/bin/env python3
"""Render handcrafted Almaty hub pages (glaukoma, icl, diagnostika, deti)."""

from __future__ import annotations

from handcrafted_hub_lib import HubConfig, render_hub

GLAUKOMA_SECTIONS = {
    "what": """      <h2 class="section-title">Что такое глаукома</h2>
      <p>
        Глаукома — хроническое заболевание глаз, при котором повышается внутриглазное давление и постепенно повреждается зрительный нерв.
        На ранних стадиях пациент может не замечать изменений — поэтому важны регулярные осмотры.
      </p>
      <p style="margin-top:12px;">
        Цель лечения — стабилизировать давление и сохранить оставшееся зрение. Полностью восстановить уже потерянные поля зрения обычно невозможно.
      </p>""",
    "symptoms": """      <h2 class="section-title">Симптомы и признаки глаукомы</h2>
      <ul class="symptom-grid">
        <li>сужение полей зрения по краям;</li>
        <li>периодические боли и тошнота при остром приступе;</li>
        <li>радужные круги вокруг источников света;</li>
        <li>покраснение и слезотечение;</li>
        <li>головные боли (при высоком давлении);</li>
        <li>на ранней стадии — часто нет жалоб.</li>
      </ul>
      <p class="section-note">После 40 лет рекомендуется плановый осмотр раз в 1–2 года, при наследственности — раньше.</p>""",
    "when": """      <h2 class="section-title">Когда нужна операция при глаукоме</h2>
      <p>
        Операция рассматривается, если капли и лазер не удерживают давление, ухудшаются поля зрения или диск зрительного нерва.
        Решение принимает офтальмолог после периметрии и ОКТ.
      </p>
      <p class="section-note">Подробнее: <a class="link" href="/operatsiya-glaukoma-almaty/">операция при глаукоме</a>.</p>""",
    "without-surgery": """      <h2 class="section-title">Можно ли вылечить глаукому каплями</h2>
      <p>
        Капли — основа лечения на многих стадиях. Они снижают давление, но не восстанавливают уже потерянные поля зрения.
      </p>
      <p style="margin-top:12px;">
        При недостаточном контроле добавляют лазер или операцию. Пропуски приёма капель опасны — скачки давления продолжают повреждать нерв.
      </p>""",
    "diagnostics": """      <h2 class="section-title">Диагностика глаукомы в Алматы</h2>
      <p>По показаниям проводятся:</p>
      <ul class="plain-list">
        <li>тонометрия (измерение ВГД);</li>
        <li>периметрия (поля зрения);</li>
        <li>ОКТ зрительного нерва;</li>
        <li>гониоскопия;</li>
        <li>осмотр глазного дна;</li>
        <li>пахиметрия — по показаниям.</li>
      </ul>
      <p class="section-note">Подробнее: <a class="link" href="/diagnostika-almaty/">диагностика зрения</a>.</p>""",
    "how": """      <h2 class="section-title">Как проходит лечение глаукомы</h2>
      <div class="steps-grid">
        <div class="step-card"><div class="step-num">1</div><h3>Диагностика</h3><p>Давление, осмотр нерва, периметрия, ОКТ.</p></div>
        <div class="step-card"><div class="step-num">2</div><h3>План</h3><p>Стадия, целевое давление, график визитов.</p></div>
        <div class="step-card"><div class="step-num">3</div><h3>Терапия</h3><p>Капли; при необходимости — лазер.</p></div>
        <div class="step-card"><div class="step-num">4</div><h3>Операция</h3><p>Если консервативного контроля недостаточно.</p></div>
      </div>""",
    "recovery": """      <h2 class="section-title">Восстановление и контроль</h2>
      <p>Глаукома требует пожизненного наблюдения. После лазера или операции — ограничения и график визитов объясняет врач.</p>
      <p class="section-note">При резкой боли, тошноте и падении зрения — срочно обратитесь в клинику.</p>""",
}

ICL_SECTIONS = {
    "what": """      <h2 class="section-title">Что такое ICL</h2>
      <p>ICL — факичная линза, имплантируемая внутрь глаза перед естественным хрусталиком. Корректирует миопию и астигматизм без изменения роговицы.</p>""",
    "symptoms": """      <h2 class="section-title">Кому подходит ICL</h2>
      <ul class="symptom-grid">
        <li>высокая миопия (часто −8 D и выше);</li>
        <li>тонкая роговица — противопоказание к лазеру;</li>
        <li>сухость глаз, ореолы после лазера в анамнезе;</li>
        <li>желание обратимой коррекции.</li>
      </ul>""",
    "diagnostics": """      <h2 class="section-title">Диагностика перед ICL</h2>
      <ul class="plain-list">
        <li>топография и пахиметрия роговицы;</li>
        <li>биометрия глаза;</li>
        <li>расчёт размера и модели линзы;</li>
        <li>осмотр сетчатки и глазного дна.</li>
      </ul>""",
}

DIAGNOSTIKA_SECTIONS = {
    "what": """      <h2 class="section-title">Зачем нужна диагностика зрения</h2>
      <p>Диагностика определяет диагноз и план лечения — лазер, капли, операция или наблюдение. Без обследования нельзя безопасно назначить хирургию.</p>""",
    "symptoms": """      <h2 class="section-title">Когда нужна диагностика</h2>
      <ul class="symptom-grid">
        <li>перед лазерной коррекцией или ICL;</li>
        <li>перед операцией на катаракте или глаукоме;</li>
        <li>при снижении зрения, боли, «мушках», завесе;</li>
        <li>плановый осмотр раз в 1–2 года после 40 лет;</li>
        <li>контроль хронических заболеваний глаз.</li>
      </ul>""",
    "diagnostics": """      <h2 class="section-title">Что входит в диагностику</h2>
      <ul class="plain-list">
        <li>острота зрения и рефракция;</li>
        <li>тонометрия;</li>
        <li>осмотр глазного дна;</li>
        <li>ОКТ, периметрия, топография — по показаниям.</li>
      </ul>""",
}

DETI_SECTIONS = {
    "what": """      <h2 class="section-title">Почему важен детский осмотр</h2>
      <p>Детское зрение формируется до 8–10 лет. Пропущенная амблиопия или косоглазие могут оставить дефект на всю жизнь.</p>""",
    "symptoms": """      <h2 class="section-title">Признаки проблем со зрением у детей</h2>
      <ul class="symptom-grid">
        <li>прищуривание, наклон головы;</li>
        <li>жалобы на головную боль при чтении;</li>
        <li>сходящееся или расходящееся косоглазие;</li>
        <li>не видит на доске;</li>
        <li>закрывает один глаз.</li>
      </ul>""",
    "diagnostics": """      <h2 class="section-title">Диагностика у детского офтальмолога</h2>
      <p>Методы подбираются по возрасту: картинки, объективная рефракция, циклоплегия по показаниям, осмотр глазного дна.</p>""",
}

RELATED = {
    "glaukoma": """<a class="link" href="/almaty/">Алматы филиал</a> ·
        <a class="link" href="/uslugi/">Услуги</a> ·
        <a class="link" href="/operatsiya-glaukoma-almaty/">Операция при глаукоме</a> ·
        <a class="link" href="/diagnostika-almaty/">Диагностика</a> ·
        <a class="link" href="/perimetriya-almaty/">Периметрия</a> ·
        <a class="link" href="/katarakta-almaty/">Катаракта</a> ·
        <a class="link" href="/setchatka-almaty/">Сетчатка</a> ·
        <a class="link" href="/doctor-musay/">Нурмухамед Мусай</a> ·
        <a class="link" href="/otzyvy-asiakoz-almaty/">Отзывы</a>""",
    "icl": """<a class="link" href="/almaty/">Алматы филиал</a> ·
        <a class="link" href="/uslugi/">Услуги</a> ·
        <a class="link" href="/lazer-almaty/">Лазерная коррекция</a> ·
        <a class="link" href="/diagnostika-almaty/">Диагностика</a> ·
        <a class="link" href="/miopiya-almaty/">Миопия</a> ·
        <a class="link" href="/astigmatizm-almaty/">Астигматизм</a> ·
        <a class="link" href="/doctor-mehmet-esat-teker/">Мехмет Есат Текер</a> ·
        <a class="link" href="/otzyvy-asiakoz-almaty/">Отзывы</a>""",
    "diagnostika": """<a class="link" href="/almaty/">Алматы филиал</a> ·
        <a class="link" href="/uslugi/">Услуги</a> ·
        <a class="link" href="/katarakta-almaty/">Катаракта</a> ·
        <a class="link" href="/lazer-almaty/">Лазер</a> ·
        <a class="link" href="/glaukoma-almaty/">Глаукома</a> ·
        <a class="link" href="/setchatka-almaty/">Сетчатка</a> ·
        <a class="link" href="/deti-almaty/">Детская офтальмология</a> ·
        <a class="link" href="/otzyvy-asiakoz-almaty/">Отзывы</a>""",
    "deti": """<a class="link" href="/almaty/">Алматы филиал</a> ·
        <a class="link" href="/uslugi/">Услуги</a> ·
        <a class="link" href="/kosoglazie/">Косоглазие</a> ·
        <a class="link" href="/miopiya-u-detey-almaty/">Миопия у детей</a> ·
        <a class="link" href="/ambliopiya-almaty/">Амблиопия</a> ·
        <a class="link" href="/profosmotr-pered-shkoloy-almaty/">Профосмотр перед школой</a> ·
        <a class="link" href="/doctor-aliya/">Алия Усманова</a> ·
        <a class="link" href="/otzyvy-asiakoz-almaty/">Отзывы</a>""",
}

HUBS: list[HubConfig] = [
    HubConfig(
        dx_id="glaukoma",
        slug="glaukoma-almaty",
        hero_class="glaukoma-hero",
        title="Глаукома в Алматы — диагностика, капли, лазер, операция | asiakoz",
        meta_desc="Лечение глаукомы в Алматы: тонометрия, периметрия, ОКТ, капли, лазер и операция. Диагностика от 20 000 ₸. Asiakoz, проспект Райымбека, 176а.",
        og_title="Глаукома в Алматы — диагностика и лечение | asiakoz",
        h1="Лечение глаукомы в Алматы: контроль давления и сохранение зрения",
        hero_p="""Глаукома повреждает зрительный нерв — часто без боли и заметных симптомов на ранних стадиях.
          В клинике Asiakoz в Алматы измеряем внутриглазное давление, оцениваем диск зрительного нерва и поля зрения,
          при необходимости выполняем ОКТ. Тактика — капли, лазер или
          <a class="link" href="/operatsiya-glaukoma-almaty/">операция</a> — по стадии и динамике после диагностики.""",
        hero_facts="""        <div class="hero-facts hero-facts--4" aria-label="Ключевые факты">
          <div class="hero-fact"><b>20 000 ₸</b><span>Полная диагностика и приём офтальмолога</span></div>
          <div class="hero-fact"><b>Давление + поля</b><span>Тонометрия, периметрия, ОКТ нерва</span></div>
          <div class="hero-fact"><b>Капли / лазер</b><span>Первые ступени лечения</span></div>
          <div class="hero-fact"><b>Операция</b><span>При недостаточном контроле — по показаниям</span></div>
        </div>""",
        wa_encoded="%D0%B3%D0%BB%D0%B0%D1%83%D0%BA%D0%BE%D0%BC%D0%B5%20%D0%B2%20%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B",
        breadcrumb='<a href="/">Главная</a> / <a href="/uslugi/">Услуги</a> / Глаукома в Алматы',
        schema_page_name="Глаукома в Алматы — диагностика и лечение | asiakoz",
        schema_entity_name="Лечение глаукомы в Алматы",
        image="/images/clinic-building.png",
        image_alt="Диагностика и лечение глаукомы в Asiakoz Алматы",
        doctor_href="/doctor-musay/",
        doctor_img="/images/doctor-musay.png",
        doctor_name="Нурмухамед Мусай",
        doctor_role="Главный врач · Глаукома · Алматы",
        med_trust="Нурмухамед Мусай, главный врач, офтальмохирург.",
        price_title="Стоимость диагностики и лечения глаукомы",
        price_sub="Диагностика — от 20 000 ₸. Стоимость капель, лазера и операции определяется после осмотра, периметрии и оценки стадии глаукомы.",
        price_op_label="Лечение",
        price_op_title="Операция при глаукоме",
        price_op_value="После диагностики",
        price_op_text="Точная стоимость зависит от метода (микроинвазивная хирургия, дренаж и др.) и клинической ситуации. Ориентир обсуждается на приёме.",
        cta_h2="Запишитесь на диагностику глаукомы в Алматы",
        cta_p="Полная диагностика и приём офтальмолога — от 20 000 ₸. После обследования врач объяснит стадию, целевое давление и план лечения (капли, лазер или операция).",
        related_html=RELATED["glaukoma"],
        city_switch_dx="glaukoma",
        section_overrides=GLAUKOMA_SECTIONS,
        extra_replacements=[
            (
                "<h2 class=\"section-title\">Почему выбирают asiakoz в Алматы</h2>",
                "<h2 class=\"section-title\">Почему выбирают Asiakoz для лечения глаукомы</h2>",
            ),
            (
                "Филиал asiakoz в Алматы специализируется на диагностике катаракты, факоэмульсификации и подборе искусственного хрусталика.",
                "В филиале Asiakoz в Алматы контролируют глаукому на всех стадиях: от первичной диагностики до лазера и хирургии.",
            ),
            (
                "<h2 class=\"section-title\">Что такое катаракта</h2>",
                "<h2 class=\"section-title\">Что такое глаукома</h2>",
            ),
            (
                "Катаракта — это помутнение естественного хрусталика глаза.",
                "Глаукома — хроническое заболевание, при котором повышается внутриглазное давление и повреждается зрительный нерв.",
            ),
            (
                "<h2 class=\"section-title\">Основные симптомы катаракты</h2>",
                "<h2 class=\"section-title\">Симптомы и признаки глаукомы</h2>",
            ),
            (
                "<h2 class=\"section-title\">Когда нужна операция при катаракте</h2>",
                "<h2 class=\"section-title\">Когда нужна операция при глаукоме</h2>",
            ),
            (
                "<h2 class=\"section-title\">Можно ли вылечить катаракту без операции</h2>",
                "<h2 class=\"section-title\">Можно ли вылечить глаукому каплями</h2>",
            ),
            (
                "<h2 class=\"section-title\">Диагностика перед операцией катаракты</h2>",
                "<h2 class=\"section-title\">Диагностика глаукомы в Алматы</h2>",
            ),
            (
                "<h2 class=\"section-title\">Похожие страницы</h2>",
                "<h2 class=\"section-title\">Полезные страницы</h2>",
            ),
        ],
    ),
    HubConfig(
        dx_id="icl",
        slug="icl-almaty",
        hero_class="icl-hero",
        title="ICL в Алматы — имплантация факичных линз | asiakoz",
        meta_desc="ICL в Алматы: имплантация факичной линзы при высокой миопии и тонкой роговице. Диагностика от 20 000 ₸. Asiakoz, проспект Райымбека, 176а.",
        og_title="ICL в Алматы — факичные линзы | asiakoz",
        h1="ICL в Алматы: имплантация факичной линзы при миопии и астигматизме",
        hero_p="""ICL (имплантация факичной линзы) — альтернатива
          <a class="link" href="/lazer-almaty/">лазерной коррекции</a> при высокой миопии, тонкой роговице или других показаниях.
          В клинике Asiakoz в Алматы проводим полную диагностику, биометрию и расчёт линзы перед имплантацией.
          Линзу можно извлечь при необходимости — решение принимает хирург после обследования.""",
        hero_facts="""        <div class="hero-facts hero-facts--4" aria-label="Ключевые факты">
          <div class="hero-fact"><b>20 000 ₸</b><span>Диагностика и приём хирурга</span></div>
          <div class="hero-fact"><b>Биометрия</b><span>Расчёт параметров ICL</span></div>
          <div class="hero-fact"><b>Обратимость</b><span>Линзу можно извлечь</span></div>
          <div class="hero-fact"><b>После диагностики</b><span>Точная стоимость и модель линзы</span></div>
        </div>""",
        wa_encoded="%D0%98%D0%A6%D0%9B%20%D0%B2%20%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B",
        breadcrumb='<a href="/">Главная</a> / <a href="/uslugi/">Услуги</a> / ICL в Алматы',
        schema_page_name="ICL в Алматы — факичные линзы | asiakoz",
        schema_entity_name="Имплантация ICL в Алматы",
        image="/images/clinic-almaty-laser.png",
        image_alt="ICL — имплантация факичной линзы в Asiakoz Алматы",
        doctor_href="/doctor-mehmet-esat-teker/",
        doctor_img="/images/doctor-mehmet-esat-teker.png",
        doctor_name="Мехмет Есат Текер",
        doctor_role="Офтальмохирург · ICL · Алматы",
        med_trust="Мехмет Есат Текер, офтальмохирург.",
        price_title="Стоимость диагностики и ICL",
        price_sub="Диагностика — от 20 000 ₸. Стоимость имплантации ICL зависит от модели линзы, диоптрий и результатов биометрии.",
        price_op_label="ICL",
        price_op_title="Имплантация факичной линзы",
        price_op_value="После диагностики",
        price_op_text="Точная сумма определяется после топографии, биометрии и выбора линзы. Обсуждается на консультации хирурга.",
        cta_h2="Запишитесь на диагностику перед ICL в Алматы",
        cta_p="Диагностика и приём офтальмохирурга — от 20 000 ₸. После обследования врач сравнит ICL и лазер, назовёт показания и ориентировочную стоимость.",
        related_html=RELATED["icl"],
        city_switch_dx=None,
        section_overrides=ICL_SECTIONS,
        extra_replacements=[
            (
                "<h2 class=\"section-title\">Что такое катаракта</h2>",
                "<h2 class=\"section-title\">Что такое ICL</h2>",
            ),
            (
                "Катаракта — это помутнение естественного хрусталика глаза.",
                "ICL — тонкая факичная линза, которая имплантируется внутрь глаза перед естественным хрусталиком для коррекции миопии и астигматизма.",
            ),
            (
                "<h2 class=\"section-title\">Основные симптомы катаракты</h2>",
                "<h2 class=\"section-title\">Кому подходит ICL</h2>",
            ),
            (
                "<h2 class=\"section-title\">Когда нужна операция при катаракте</h2>",
                "<h2 class=\"section-title\">ICL или лазер: как выбрать</h2>",
            ),
            (
                "<h2 class=\"section-title\">Можно ли вылечить катаракту без операции</h2>",
                "<h2 class=\"section-title\">Преимущества и ограничения ICL</h2>",
            ),
            (
                "<h2 class=\"section-title\">Диагностика перед операцией катаракты</h2>",
                "<h2 class=\"section-title\">Диагностика перед ICL</h2>",
            ),
        ],
    ),
    HubConfig(
        dx_id="diagnostika",
        slug="diagnostika-almaty",
        hero_class="diagnostika-hero",
        title="Диагностика зрения в Алматы — полное обследование | asiakoz",
        meta_desc="Полная диагностика зрения в Алматы: острота, давление, глазное дно, ОКТ по показаниям. От 20 000 ₸. Asiakoz, проспект Райымбека, 176а.",
        og_title="Диагностика зрения в Алматы | asiakoz",
        h1="Диагностика зрения в Алматы: полное обследование перед лечением",
        hero_p="""Перед любой операцией и при жалобах на зрение нужна диагностика, а не «запись сразу на лазер».
          В клинике Asiakoz в Алматы проверяем остроту зрения, рефракцию, внутриглазное давление, глазное дно;
          ОКТ, периметрия и другие методы — по задаче врача. После осмотра вы получаете понятный план:
          наблюдение, капли, лазер или направление к хирургу.""",
        hero_facts="""        <div class="hero-facts hero-facts--4" aria-label="Ключевые факты">
          <div class="hero-fact"><b>от 20 000 ₸</b><span>Полная диагностика и приём офтальмолога</span></div>
          <div class="hero-fact"><b>40 мин – 2 ч</b><span>В зависимости от объёма</span></div>
          <div class="hero-fact"><b>По показаниям</b><span>ОКТ, поля, топография — не «всё подряд»</span></div>
          <div class="hero-fact"><b>План лечения</b><span>Письменные рекомендации после осмотра</span></div>
        </div>""",
        wa_encoded="%D0%B4%D0%B8%D0%B0%D0%B3%D0%BD%D0%BE%D1%81%D1%82%D0%B8%D0%BA%D1%83%20%D0%B7%D1%80%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%B2%20%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B",
        breadcrumb='<a href="/">Главная</a> / <a href="/uslugi/">Услуги</a> / Диагностика зрения в Алматы',
        schema_page_name="Диагностика зрения в Алматы | asiakoz",
        schema_entity_name="Диагностика зрения в Алматы",
        image="/images/clinic-building.png",
        image_alt="Полная диагностика зрения в Asiakoz Алматы",
        doctor_href="/doctor-musay/",
        doctor_img="/images/doctor-musay.png",
        doctor_name="Нурмухамед Мусай",
        doctor_role="Главный врач · Диагностика · Алматы",
        med_trust="Нурмухамед Мусай, главный врач, офтальмохирург.",
        price_title="Стоимость диагностики зрения",
        price_sub="Полная диагностика и приём офтальмолога — от 20 000 ₸. Расширенный объём (ОКТ, поля, топография) определяется по показаниям и может влиять на итоговую сумму.",
        price_op_label="Расширенная",
        price_op_title="Расширенная диагностика",
        price_op_value="По показаниям",
        price_op_text="Состав обследований подбирается индивидуально: перед лазером, катарактой, глаукомой или для второго мнения.",
        cta_h2="Запишитесь на диагностику зрения в Алматы",
        cta_p="Диагностика и приём офтальмолога — от 20 000 ₸. После обследования врач объяснит результаты и предложит план лечения или наблюдения.",
        related_html=RELATED["diagnostika"],
        city_switch_dx="diagnostika",
        section_overrides=DIAGNOSTIKA_SECTIONS,
        extra_replacements=[
            (
                "<h2 class=\"section-title\">Что такое катаракта</h2>",
                "<h2 class=\"section-title\">Зачем нужна диагностика зрения</h2>",
            ),
            (
                "<h2 class=\"section-title\">Основные симптомы катаракты</h2>",
                "<h2 class=\"section-title\">Когда нужна диагностика</h2>",
            ),
            (
                "<h2 class=\"section-title\">Диагностика перед операцией катаракты</h2>",
                "<h2 class=\"section-title\">Что входит в диагностику</h2>",
            ),
        ],
    ),
    HubConfig(
        dx_id="deti",
        slug="deti-almaty",
        hero_class="deti-hero",
        title="Детский офтальмолог в Алматы — проверка зрения | asiakoz",
        meta_desc="Детский офтальмолог в Алматы: профосмотр, миопия, астигматизм, косоглазие, амблиопия. Asiakoz, проспект Райымбека, 176а.",
        og_title="Детский офтальмолог в Алматы | asiakoz",
        h1="Детский офтальмолог в Алматы: проверка зрения и лечение",
        hero_p="""Детское зрение нельзя «подождать до школы». В клинике Asiakoz в Алматы проверяем остроту, рефракцию,
          бинокулярность, исключаем амблиопию. Косоглазие и прогрессирующая миопия требуют графика наблюдения.
          При необходимости направляем к хирургу сети — после детского осмотра и полной диагностики.""",
        hero_facts="""        <div class="hero-facts hero-facts--4" aria-label="Ключевые факты">
          <div class="hero-fact"><b>Профосмотр</b><span>Перед садом и школой</span></div>
          <div class="hero-fact"><b>Миопия</b><span>Контроль прогрессии</span></div>
          <div class="hero-fact"><b>Косоглазие</b><span>Ранняя диагностика важна</span></div>
          <div class="hero-fact"><b>от 20 000 ₸</b><span>Диагностика по показаниям</span></div>
        </div>""",
        wa_encoded="%D0%B4%D0%B5%D1%82%D1%81%D0%BA%D0%BE%D0%BC%D1%83%20%D0%BE%D1%84%D1%82%D0%B0%D0%BB%D1%8C%D0%BC%D0%BE%D0%BB%D0%BE%D0%B3%D1%83%20%D0%B2%20%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B",
        breadcrumb='<a href="/">Главная</a> / <a href="/uslugi/">Услуги</a> / Детская офтальмология в Алматы',
        schema_page_name="Детский офтальмолог в Алматы | asiakoz",
        schema_entity_name="Детская офтальмология в Алматы",
        image="/images/clinic-building.png",
        image_alt="Детский офтальмолог в Asiakoz Алматы",
        doctor_href="/doctor-aliya/",
        doctor_img="/images/doctor-aliya.png",
        doctor_name="Алия Ганимуратовна Усманова",
        doctor_role="Офтальмохирург · Дети · Алматы",
        med_trust="Алия Усманова, офтальмохирург.",
        price_title="Стоимость приёма детского офтальмолога",
        price_sub="Стоимость осмотра и диагностики зависит от возраста ребёнка и объёма обследования. Ориентир — от 20 000 ₸ за расширенную диагностику.",
        price_op_label="Наблюдение",
        price_op_title="План лечения ребёнка",
        price_op_value="Индивидуально",
        price_op_text="Очки, пластырь при амблиопии, упражнения или направление на операцию — после осмотра детского офтальмолога.",
        cta_h2="Запишитесь к детскому офтальмологу в Алматы",
        cta_p="Опишите возраст ребёнка и жалобы в WhatsApp — администратор подберёт время приёма. При необходимости назначим расширенную диагностику.",
        related_html=RELATED["deti"],
        city_switch_dx="deti",
        section_overrides=DETI_SECTIONS,
        extra_replacements=[
            (
                "<h2 class=\"section-title\">Что такое катаракта</h2>",
                "<h2 class=\"section-title\">Почему важен детский осмотр</h2>",
            ),
            (
                "<h2 class=\"section-title\">Основные симптомы катаракты</h2>",
                "<h2 class=\"section-title\">Признаки проблем со зрением у детей</h2>",
            ),
            (
                "<h2 class=\"section-title\">Диагностика перед операцией катаракты</h2>",
                "<h2 class=\"section-title\">Диагностика у детского офтальмолога</h2>",
            ),
        ],
    ),
]


def main() -> None:
    for cfg in HUBS:
        ru, kk = render_hub(cfg)
        print(f"{cfg.slug}: RU {len(ru.splitlines())} lines, KK {len(kk.splitlines())} lines")


if __name__ == "__main__":
    main()
