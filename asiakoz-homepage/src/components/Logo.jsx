import { useLang } from "../i18n/LanguageContext";

const MAIN_SITE = "https://asiakoz.com/";
const LOGO_SRC = `${import.meta.env.BASE_URL}images/logo-asiakoz.png`;

export default function Logo({ className = "", compact = false }) {
  const { lang } = useLang();
  const label = lang === "ru" ? "AsiaKoz — главный сайт" : "AsiaKoz — негізгі сайт";
  const href = lang === "kz" ? `${MAIN_SITE}kk/` : MAIN_SITE;

  return (
    <a
      href={href}
      className={`inline-flex max-w-[58%] items-center transition-opacity hover:opacity-85 sm:max-w-none ${className}`}
      aria-label={label}
    >
      <img
        src={LOGO_SRC}
        alt="AsiaKoz"
        className={`w-auto object-contain ${
          compact ? "h-7 sm:h-9" : "h-9 sm:h-10"
        }`}
        width={230}
        height={40}
        decoding="async"
      />
    </a>
  );
}
