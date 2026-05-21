import { useState } from "react";
import Logo from "./Logo";
import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { NAV_LINKS, PHONE_ALMATY, PHONE_ALMATY_HREF, WHATSAPP_URL } from "../data/content";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/90 backdrop-blur-lg">
      <div className="section-container flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Основная навигация">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-brand"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <div className="text-right">
            <a
              href={PHONE_ALMATY_HREF}
              className="text-sm font-bold text-ink transition-colors hover:text-brand"
            >
              {PHONE_ALMATY}
            </a>
            <p className="flex items-center justify-end gap-1 text-xs text-ink-faint">
              <Icon name="clock" className="h-3.5 w-3.5 text-brand" />
              Пн–Пт 09:00–17:00, Сб до 14:00
            </p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand/25 bg-white px-4 py-2.5 text-sm font-semibold text-brand transition-all hover:border-brand hover:bg-brand-soft"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Записаться в WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="inline-flex rounded-xl border border-slate-200 p-2 text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
        >
          <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <nav className="section-container flex flex-col gap-1 py-4" aria-label="Мобильная навигация">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-brand-soft hover:text-brand"
              >
                {link.label}
              </a>
            ))}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary mt-2">
              <WhatsAppIcon className="h-4 w-4" />
              Записаться в WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
