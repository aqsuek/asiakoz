import { useEffect, useState } from "react";
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

const ROTATE_MS = 5000;

export default function LaserOfferBanner() {
  const { lang, t } = useLang();
  const offers = t.promoOffers || (t.laserOffer ? [t.laserOffer] : []);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (offers.length < 2 || paused) return undefined;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % offers.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [offers.length, paused]);

  if (!offers.length) return null;

  const now = new Date();
  const monthName = lang === "ru" ? MONTHS_RU[now.getMonth()] : MONTHS_KZ[now.getMonth()];
  const offer = offers[index % offers.length];
  const title = (offer.title || "").replace("{month}", monthName);

  return (
    <section id="laser-offer" className="scroll-mt-24 pt-6 sm:pt-8">
      <div className="section-container">
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <a
            href={offer.href || "/laser/"}
            className="group flex flex-col items-start justify-between gap-4 rounded-[1.5rem] bg-gradient-to-r from-red-600 to-red-700 px-5 py-4 text-white shadow-[0_8px_24px_rgba(220,38,38,0.3)] transition-transform duration-300 hover:-translate-y-0.5 sm:flex-row sm:items-center sm:px-6"
          >
            <div key={offer.id || index} className="animate-fadeSlide">
              <p className="text-base font-bold leading-snug sm:text-[17px]">{title}</p>
              {offer.subtitle && (
                <p className="mt-1.5 text-sm opacity-95">{offer.subtitle}</p>
              )}
            </div>
            <span className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-red-600 transition-colors group-hover:bg-red-50">
              {offer.cta}
              <Icon name="arrow" className="h-4 w-4" />
            </span>
          </a>

          {offers.length > 1 && (
            <div className="mt-3 flex items-center justify-center gap-2">
              {offers.map((item, i) => (
                <button
                  key={item.id || i}
                  type="button"
                  aria-label={item.cta || `Offer ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-red-600" : "w-2 bg-red-600/35 hover:bg-red-600/55"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
