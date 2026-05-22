import { useState } from "react";
import Logo from "./Logo";
import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { NAV_LINKS, PHONE_ALMATY, PHONE_ALMATY_HREF, WHATSAPP_URL } from "../data/content";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand/10 bg-white/95 backdrop-blur-lg shadow-[0_4px_24px_rgba(18,183,213,0.06)]">
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
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)] transition-all hover:-translate-y-0.5 hover:bg-[#20bd5a]"
            aria-label="Записаться в WhatsApp"
            title="Записаться в WhatsApp"
          >
            <WhatsAppIcon className="h-5 w-5" />
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
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-12 w-12 items-center justify-center self-start rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)]"
              aria-label="Записаться в WhatsApp"
              title="Записаться в WhatsApp"
            >
              <WhatsAppIcon className="h-6 w-6" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
