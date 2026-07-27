import { useEffect, useState } from "react";
import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { WHATSAPP_URL } from "../data/content";

export default function FixedWhatsApp() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_32px_rgba(37,211,102,0.4)] transition-all hover:scale-105 hover:shadow-[0_12px_40px_rgba(37,211,102,0.5)] sm:bottom-6 sm:right-6"
        aria-label="Записаться в WhatsApp"
        title="Записаться в WhatsApp"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </a>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-[5.25rem] right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink shadow-soft transition-all hover:border-brand/30 hover:text-brand sm:bottom-[5.5rem] sm:right-6"
          aria-label="Наверх"
        >
          <Icon name="chevron" className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
