import { useEffect, useState } from "react";
import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { WHATSAPP_URL } from "../data/content";

export default function FixedWhatsApp() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 bg-brand px-4 py-3.5 text-sm font-semibold text-white shadow-[0_-4px_24px_rgba(18,183,213,0.35)] transition-colors hover:bg-brand-dark sm:py-4 sm:text-base"
      >
        <WhatsAppIcon className="h-5 w-5 shrink-0" />
        <span>Записаться в WhatsApp</span>
        <span className="hidden text-white/80 sm:inline">· Быстро ответим</span>
      </a>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="absolute -top-14 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand shadow-soft transition-all hover:border-brand hover:bg-brand-soft sm:right-6"
          aria-label="Наверх"
        >
          <Icon name="chevron" className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
