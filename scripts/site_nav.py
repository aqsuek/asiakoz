"""Unified site navigation — matches corporate homepage menu (RU/KK)."""

from __future__ import annotations

HEADER_NAV_RU = """      <nav class="header-nav" aria-label="Основная навигация">
        <a href="/#about">О клинике</a>
        <a href="/#services">Услуги</a>
        <a href="/#doctors">Врачи</a>
        <a href="/#reviews">Отзывы</a>
        <a href="/news/">Новости</a>
        <a href="/#contacts">Контакты</a>
      </nav>"""

HEADER_NAV_KK = """      <nav class="header-nav" aria-label="Негізгі навигация">
        <a href="/kk/#about">Клиника туралы</a>
        <a href="/kk/#services">Қызметтер</a>
        <a href="/kk/#doctors">Дәрігерлер</a>
        <a href="/kk/#reviews">Пікірлер</a>
        <a href="/kk/news/">Жаңалықтар</a>
        <a href="/kk/#contacts">Байланыс</a>
      </nav>"""

FOOTER_NAV_RU = """          <a href="/#about">О клинике</a>
          <a href="/#services">Услуги</a>
          <a href="/#doctors">Врачи</a>
          <a href="/#reviews">Отзывы</a>
          <a href="/news/">Новости</a>
          <a href="/#contacts">Контакты</a>"""

FOOTER_NAV_KK = """          <a href="/kk/#about">Клиника туралы</a>
          <a href="/kk/#services">Қызметтер</a>
          <a href="/kk/#doctors">Дәрігерлер</a>
          <a href="/kk/#reviews">Пікірлер</a>
          <a href="/kk/news/">Жаңалықтар</a>
          <a href="/kk/#contacts">Байланыс</a>"""


def header_nav_html(lang: str = "ru") -> str:
    return HEADER_NAV_KK if lang == "kk" else HEADER_NAV_RU


def footer_nav_html(lang: str = "ru") -> str:
    return FOOTER_NAV_KK if lang == "kk" else FOOTER_NAV_RU
