import { useEffect, useState } from "react";
import Logo from "./Logo";
import Icon from "./Icon";
import CityPickerButton from "./CityPickerButton";
import { languagePath, useLang } from "../i18n/LanguageContext";
import { CLINIC, waBookingUrl } from "../data/contacts";
import { homeUrl, newsUrl } from "../lib/routes";
import { IS_HOME, IS_LASER } from "../lib/branch";
import { showsPhoneCta } from "../lib/contactPolicy";
import { useCity } from "../context/CityContext";
import { phoneHref } from "../data/branches";
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
  : IS_HOME
    ? [
        { key: "about", hash: "#about" },
        { key: "services", hash: "#services" },
        { key: "doctors", hash: "#doctors" },
        { key: "reviews", hash: "#reviews" },
        { key: "news", href: newsUrl() },
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
  const { cityId, branch } = useCity();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [path, setPath] = useState("/");

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return undefined;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const bookHref = IS_LASER
    ? homeUrl("#booking")
    : IS_HOME
      ? waBookingUrl(lang, "", { branchId: cityId })
      : waBookingUrl(lang);

  const phone = IS_HOME
    ? { href: phoneHref(branch.phoneTel), display: branch.phoneDisplay }
    : CLINIC.phones[0];
  const showPhone = showsPhoneCta(cityId);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-ink/[0.06] bg-white/90 shadow-soft backdrop-blur-xl"
          : "bg-white/70 backdrop-blur-md"
      }`}
    >
      <div
        className={`section-container flex items-center justify-between gap-2 ${
          IS_HOME ? "h-16 sm:h-[68px]" : "h-14 sm:h-[68px]"
        }`}
      >
        <Logo compact={IS_HOME} />

        {IS_HOME ? <CityPickerButton className="min-w-0" /> : null}

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Navigation">
          {ANCHORS.map((item) => (
            <a
              key={item.key}
              href={item.href || homeUrl(item.hash)}
              className="text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
            >
              {t.nav[item.key] || item.key}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <div
            className="inline-flex rounded-full border border-ink/[0.08] bg-surface-muted p-0.5"
            role="group"
            aria-label="Language"
          >
            {["kz", "ru"].map((code) => {
              const href = languagePath(code, path);
              return (
              <a
                key={code}
                href={href}
                onClick={(e) => {
                  const target = languagePath(code, path);
                  if (target === path || target === `${path}` ) {
                    e.preventDefault();
                    setLang(code);
                  }
                  if (IS_LASER) trackEvent("laser_language_change", { language: code });
                }}
                className={`inline-flex h-11 min-w-[2.75rem] items-center justify-center rounded-full px-2 text-[10px] font-bold uppercase tracking-wide transition-all sm:min-w-11 sm:px-2.5 sm:text-[11px] ${
                  lang === code
                    ? "bg-white text-brand shadow-soft"
                    : "text-ink-faint hover:text-ink"
                }`}
                aria-current={lang === code ? "page" : undefined}
                hrefLang={code === "kz" ? "kk" : "ru"}
              >
                {code === "kz" ? "ҚАЗ" : "РУС"}
              </a>
              );
            })}
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
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-40 bg-ink/25 xl:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-50 border-t border-ink/[0.06] bg-white px-5 py-4 xl:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {ANCHORS.map((item) => (
              <a
                key={item.key}
                href={item.href || homeUrl(item.hash)}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-ink hover:bg-surface-muted"
              >
                {t.nav[item.key] || item.key}
              </a>
            ))}
          </nav>
          <div className="mt-3 grid gap-2">
            {showPhone && (
              <a
                href={phone.href}
                onClick={() =>
                  trackEvent("phone_click", {
                    city: IS_HOME ? cityId : undefined,
                    button_location: "header_menu",
                    page_url: window.location.href,
                  })
                }
                className="btn-outline min-h-12 w-full"
              >
                {phone.display}
              </a>
            )}
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
        </>
      )}
    </header>
  );
}
