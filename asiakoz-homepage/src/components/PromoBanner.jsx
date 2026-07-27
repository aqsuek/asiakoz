import { useEffect, useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import { homeUrl } from "../lib/routes";

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

function getPromoSpots() {
  const now = new Date();
  const key = `promo_laser_spots_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, "0")}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved) return Number(saved);
  } catch {
    /* ignore */
  }
  const spots = 12 + (now.getDate() % 5);
  try {
    localStorage.setItem(key, String(spots));
  } catch {
    /* ignore */
  }
  return spots;
}

export default function PromoBanner() {
  const { lang, t } = useLang();
  const [spots, setSpots] = useState(12);

  useEffect(() => {
    setSpots(getPromoSpots());
  }, []);

  if (!t.promo) return null;

  const now = new Date();
  const monthName = lang === "ru" ? MONTHS_RU[now.getMonth()] : MONTHS_KZ[now.getMonth()];
  const title = t.promo.title.replace("{month}", monthName);

  return (
    <section id="promo" className="scroll-mt-24 pt-6 sm:pt-8">
      <div className="section-container">
        <div className="flex flex-col items-start justify-between gap-4 rounded-[1.5rem] bg-gradient-to-r from-red-600 to-red-700 px-5 py-4 text-white shadow-[0_8px_24px_rgba(220,38,38,0.3)] sm:flex-row sm:items-center sm:px-6">
          <div>
            <p className="text-base font-bold leading-snug sm:text-[17px]">{title}</p>
            <p className="mt-1.5 text-sm opacity-95">
              {t.promo.spots}{" "}
              <span className="text-lg font-extrabold">{spots}</span>
            </p>
          </div>
          <a
            href={homeUrl("#booking")}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
          >
            {t.promo.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
