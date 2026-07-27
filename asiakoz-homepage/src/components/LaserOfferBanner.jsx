import { useLang } from "../i18n/LanguageContext";
import Icon from "./Icon";

const MONTHS_KZ = [
  "қаңтар",
  "ақпан",
  "наурыз",
  "сәуір",
  "мамыр",
  "маусым",
  "шілде",
  "тамыз",
  "қыркүйек",
  "қазан",
  "қараша",
  "желтоқсан",
];

const MONTHS_RU = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

export default function LaserOfferBanner() {
  const { lang, t } = useLang();
  if (!t.laserOffer) return null;

  const now = new Date();
  const monthName = lang === "ru" ? MONTHS_RU[now.getMonth()] : MONTHS_KZ[now.getMonth()];
  const title = t.laserOffer.title.replace("{month}", monthName);

  return (
    <section id="laser-offer" className="scroll-mt-24 pt-6 sm:pt-8">
      <div className="section-container">
        <a
          href="/laser/"
          className="group flex flex-col items-start justify-between gap-4 rounded-[1.5rem] bg-gradient-to-r from-red-600 to-red-700 px-5 py-4 text-white shadow-[0_8px_24px_rgba(220,38,38,0.3)] transition-transform duration-300 hover:-translate-y-0.5 sm:flex-row sm:items-center sm:px-6"
        >
          <div>
            <p className="text-base font-bold leading-snug sm:text-[17px]">{title}</p>
            {t.laserOffer.subtitle && (
              <p className="mt-1.5 text-sm opacity-95">{t.laserOffer.subtitle}</p>
            )}
          </div>
          <span className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-red-600 transition-colors group-hover:bg-red-50">
            {t.laserOffer.cta}
            <Icon name="arrow" className="h-4 w-4" />
          </span>
        </a>
      </div>
    </section>
  );
}
