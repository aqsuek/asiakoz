import { useLang } from "../i18n/LanguageContext";

const MAIN_SITE = "https://asiakoz.com/";
const LOGO_SRC = `${import.meta.env.BASE_URL}images/logo-asiakoz.png`;

export default function Logo({ className = "" }) {
  const { lang } = useLang();
  const label = lang === "ru" ? "AsiaKoz — главный сайт" : "AsiaKoz — негізгі сайт";

  return (
    <a
      href={MAIN_SITE}
      className={`inline-flex items-center transition-opacity hover:opacity-85 ${className}`}
      aria-label={label}
    >
      <img
        src={LOGO_SRC}
        alt="AsiaKoz"
        className="h-9 w-auto object-contain sm:h-10"
        width={230}
        height={40}
        decoding="async"
      />
    </a>
  );
}
