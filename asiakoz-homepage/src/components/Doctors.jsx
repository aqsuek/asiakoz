import { useRef } from "react";
import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "../i18n/LanguageContext";
import { waBookingUrl } from "../data/contacts";
import { assetUrl } from "../data/reviews";
import { doctorUrl } from "../lib/routes";
import { IS_LASER } from "../lib/branch";
import { trackEvent } from "../lib/analytics";

function DoctorCard({ doctor, lang, t }) {
  const profileUrl = doctor.profileUrl || doctorUrl(doctor.id);
  const bookExtra = IS_LASER
    ? lang === "ru"
      ? `Здравствуйте! Хочу записаться на консультацию по лазерной коррекции к доктору ${doctor.name}.`
      : `Сәлеметсіз бе! Лазерлік коррекция бойынша ${doctor.name} дәрігеріне жазылғым келеді.`
    : lang === "ru"
      ? `Врач: ${doctor.name}`
      : `Дәрігер: ${doctor.name}`;
  const bookUrl = waBookingUrl(lang, bookExtra);
  const stats = (doctor.stats || []).slice(0, 4);

  return (
    <article className="flex w-[min(300px,85vw)] shrink-0 snap-center flex-col overflow-hidden rounded-[1.35rem] border border-ink/[0.06] bg-white shadow-card sm:w-[340px] lg:w-[520px] lg:flex-row lg:snap-start">
      <a
        href={profileUrl}
        className="relative block shrink-0 overflow-hidden bg-gradient-to-b from-brand-soft to-surface-muted lg:w-[200px] lg:min-h-[280px]"
      >
        <img
          src={assetUrl(doctor.image)}
          alt={doctor.name}
          className="aspect-[4/5] max-h-[240px] w-full object-cover object-[center_15%] sm:max-h-[260px] lg:absolute lg:inset-0 lg:aspect-auto lg:max-h-none lg:h-full"
          width={400}
          height={500}
          loading="lazy"
          decoding="async"
        />
      </a>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <a href={profileUrl} className="text-left">
          {doctor.branch && (
            <p className="text-[10px] font-semibold uppercase tracking-wider text-brand">
              {doctor.branch}
            </p>
          )}
          <h3 className="mt-0.5 font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">
            {doctor.name}
          </h3>
          <p className="mt-0.5 text-sm font-semibold text-brand-deep">{doctor.role}</p>

          {stats.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {stats.map((stat) => (
                <span
                  key={stat.label}
                  className="inline-flex items-baseline gap-1 rounded-full border border-brand/15 bg-brand-soft/60 px-2.5 py-1 text-[11px] text-ink-muted"
                >
                  <span className="font-extrabold text-brand">{stat.value}</span>
                  <span className="leading-none">{stat.label}</span>
                </span>
              ))}
            </div>
          )}

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-muted">
            {doctor.lead}
          </p>

          <span className="btn-ghost mt-2 self-start !px-0 text-sm">
            {t.doctors.more}
            <Icon name="arrow" className="h-4 w-4" />
          </span>
        </a>

        <a
          href={bookUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            IS_LASER &&
            trackEvent("laser_doctor_cta_click", {
              language: lang,
              doctor_name: doctor.name,
              button_location: "doctors",
            })
          }
          className="btn-primary mt-4 min-h-11 w-full !py-2.5"
        >
          <WhatsAppIcon className="h-4 w-4" />
          {t.doctors.book}
        </a>
      </div>
    </article>
  );
}

export default function Doctors() {
  const { lang, t } = useLang();
  const doctors = t.doctors.items;
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = card ? card.offsetWidth + 16 : Math.min(340, el.clientWidth * 0.9);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (!doctors?.length) return null;

  const showArrows = doctors.length > 1;

  return (
    <section id="doctors" className="scroll-mt-24 scroll-mb-28 py-7 sm:py-10">
      <div className="section-container">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="section-title text-[1.4rem] sm:text-3xl">{t.doctors.title}</h2>
            <p className="mt-2 text-sm text-ink-muted sm:text-base">{t.doctors.subtitle}</p>
          </div>
          {showArrows && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:border-brand/30 hover:text-brand"
                aria-label="Prev"
              >
                <Icon name="chevronLeft" className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:border-brand/30 hover:text-brand"
                aria-label="Next"
              >
                <Icon name="chevronRight" className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div
          ref={trackRef}
          className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 snap-x snap-mandatory touch-pan-x sm:-mx-5 sm:gap-4 sm:px-5 lg:justify-start"
        >
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} lang={lang} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
