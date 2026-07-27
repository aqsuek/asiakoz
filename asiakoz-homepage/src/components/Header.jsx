import { useEffect, useState } from "react";
import Logo from "./Logo";
import Icon from "./Icon";
import { useLang } from "../i18n/LanguageContext";
import { CLINIC, waBookingUrl } from "../data/contacts";
import { homeUrl } from "../lib/routes";
import { IS_LASER } from "../lib/branch";
import { trackEvent } from "../lib/analytics";

const ANCHORS = IS_LASER
  ? [
      { key: "about", hash: "#promo" },
      { key: "services", hash: "#suitability" },
      { key: "doctors", hash: "#doctors" },
      { key: "reviews", hash: "#reviews" },
      { key: "faq", hash: "#faq" },
      { key: "contacts", hash: "#contacts" },
    ]
  : [
      { key: "about", hash: "#about" },
      { key: "services", hash: "#services" },
      { key: "doctors", hash: "#doctors" },
      { key: "reviews", hash: "#reviews" },
      { key: "contacts", hash: "#contacts" },
    ];

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bookHref = IS_LASER ? homeUrl("#booking") : waBookingUrl(lang);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-ink/[0.06] bg-white/90 shadow-soft backdrop-blur-xl"
          : "bg-white/70 backdrop-blur-md"
      }`}
    >
      <div className="section-container flex h-14 items-center justify-between gap-3 sm:h-[68px]">
        <Logo />

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Navigation">
          {ANCHORS.map((item) => (
            <a
              key={item.hash}
              href={homeUrl(item.hash)}
              className="text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
            >
              {t.nav[item.key] || item.key}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="inline-flex rounded-full border border-ink/[0.08] bg-surface-muted p-0.5"
            role="group"
            aria-label="Language"
          >
            {["kz", "ru"].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setLang(code);
                  if (IS_LASER) trackEvent("laser_language_change", { language: code });
                }}
                className={`min-h-9 min-w-9 rounded-full px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide transition-all ${
                  lang === code
                    ? "bg-white text-brand shadow-soft"
                    : "text-ink-faint hover:text-ink"
                }`}
                aria-pressed={lang === code}
              >
                {code}
              </button>
            ))}
          </div>

          <a
            href={bookHref}
            {...(!IS_LASER ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="btn-primary hidden !px-4 !py-2.5 text-[13px] lg:inline-flex"
          >
            {t.nav.book}
          </a>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink xl:hidden"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/[0.06] bg-white px-5 py-4 xl:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {ANCHORS.map((item) => (
              <a
                key={item.hash}
                href={homeUrl(item.hash)}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-ink hover:bg-surface-muted"
              >
                {t.nav[item.key] || item.key}
              </a>
            ))}
          </nav>
          <div className="mt-3 grid gap-2">
            <a href={CLINIC.phones[0].href} className="btn-outline min-h-12 w-full">
              {CLINIC.phones[0].display}
            </a>
            <a
              href={bookHref}
              {...(!IS_LASER ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onClick={() => setOpen(false)}
              className="btn-primary min-h-12 w-full"
            >
              {t.nav.book}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
