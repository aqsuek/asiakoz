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
    <>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_24px_rgba(37,211,102,0.45)] transition-all hover:-translate-y-0.5 hover:bg-[#20bd5a] hover:shadow-[0_10px_28px_rgba(37,211,102,0.5)] sm:bottom-6 sm:right-6"
        aria-label="Записаться в WhatsApp"
        title="Записаться в WhatsApp"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed z-50 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand shadow-soft transition-all hover:border-brand hover:bg-brand-soft bottom-[5.25rem] right-4 sm:bottom-[5.5rem] sm:right-6"
          aria-label="Наверх"
        >
          <Icon name="chevron" className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
