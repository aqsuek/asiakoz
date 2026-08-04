import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "../i18n/LanguageContext";
import { waBookingUrl } from "../data/contacts";
import { assetUrl } from "../data/reviews";
import { doctorUrl } from "../lib/routes";
import { IS_HOME, IS_LASER } from "../lib/branch";
import { useCity } from "../context/CityContext";
import { trackEvent } from "../lib/analytics";

function DoctorCard({ doctor, lang, t, cityId }) {
  const profileUrl = doctor.profileUrl || doctorUrl(doctor.id);
  const doctorCity =
    Array.isArray(doctor.cities) && doctor.cities.length ? doctor.cities[0] : cityId;
  const bookExtra = IS_LASER
    ? lang === "ru"
      ? `Здравствуйте! Хочу записаться на консультацию по лазерной коррекции к доктору ${doctor.name}.`
      : `Сәлеметсіз бе! Лазерлік коррекция бойынша ${doctor.name} дәрігеріне жазылғым келеді.`
    : lang === "ru"
      ? `Врач: ${doctor.name}`
      : `Дәрігер: ${doctor.name}`;
  const bookUrl = waBookingUrl(lang, bookExtra, IS_HOME ? { branchId: doctorCity } : {});
  const stats = (doctor.stats || []).slice(0, IS_HOME ? 3 : 4);

  return (
    <article
      className={`box-border flex shrink-0 flex-col overflow-hidden border border-ink/[0.06] bg-white shadow-soft sm:w-[320px] lg:w-[480px] lg:flex-row lg:snap-start ${
        IS_LASER
          ? "w-[calc(100vw-3rem)] max-w-[340px] snap-center rounded-[1.35rem] shadow-card"
          : IS_HOME
            ? "w-[min(300px,86vw)] snap-center rounded-[1.5rem]"
            : "w-[min(340px,88vw)] snap-center rounded-[1.35rem] shadow-card"
      }`}
    >
      <a
        href={profileUrl}
        onClick={() =>
          trackEvent("doctor_open", {
            doctor_id: doctor.id,
            doctor_name: doctor.name,
            city: IS_HOME ? doctorCity : undefined,
            page_url: window.location.href,
          })
        }
        className={`relative block aspect-[3/4] w-full shrink-0 overflow-hidden bg-gradient-to-b from-brand-soft to-surface-muted lg:aspect-auto lg:self-stretch ${
          IS_HOME ? "lg:w-[168px] lg:min-h-[240px]" : "lg:w-[200px] lg:min-h-[280px]"
        }`}
      >
        <img
          src={assetUrl(doctor.image)}
          alt={doctor.name}
          className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
          width={400}
          height={500}
          loading="lazy"
          decoding="async"
        />
      </a>

      <div className={`flex min-w-0 flex-1 flex-col ${IS_HOME ? "p-3 sm:p-4" : "p-3.5 sm:p-5"}`}>
        <a
          href={profileUrl}
          onClick={() =>
            trackEvent("doctor_open", {
              doctor_id: doctor.id,
              doctor_name: doctor.name,
              city: IS_HOME ? doctorCity : undefined,
              page_url: window.location.href,
            })
          }
          className="min-w-0 text-left"
        >
          {doctor.branch && (
            <p className="text-[10px] font-semibold uppercase tracking-wider text-brand">
              {doctor.branch}
            </p>
          )}
          <h3 className="mt-0.5 break-words font-display text-base font-extrabold tracking-tight text-ink sm:text-lg">
            {doctor.name}
          </h3>
          <p className="mt-0.5 text-sm font-semibold text-brand-deep">{doctor.role}</p>
          {doctor.experience && IS_HOME && (
            <p className="mt-1 text-xs text-ink-muted">{doctor.experience}</p>
          )}

          {stats.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {stats.map((stat) => (
                <span
                  key={`${stat.value}-${stat.label || ""}`}
                  className="inline-flex max-w-full items-baseline gap-1 rounded-full border border-brand/15 bg-brand-soft/60 px-2 py-1 text-[11px] text-ink-muted"
                >
                  <span className="shrink-0 font-extrabold text-brand">{stat.value}</span>
                  {stat.label ? <span className="min-w-0 leading-none">{stat.label}</span> : null}
                </span>
              ))}
            </div>
          )}

          <p className="mt-2 line-clamp-2 text-sm leading-snug text-ink-muted">{doctor.lead}</p>

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
            trackEvent(IS_LASER ? "laser_doctor_cta_click" : "doctor_booking_click", {
              language: lang,
              doctor_name: doctor.name,
              doctor_id: doctor.id,
              city: IS_HOME ? doctorCity : undefined,
              button_location: "doctors",
              page_url: window.location.href,
            })
          }
          className="btn-primary mt-3 min-h-11 w-full shrink-0 !px-3 !py-2.5 text-[13px] sm:text-sm"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0" />
          <span className="truncate">{t.doctors.book}</span>
        </a>
      </div>
    </article>
  );
}

export default function Doctors() {
  const { lang, t } = useLang();
  const { cityId } = useCity();
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Network home shows all active-branch doctors; city picker does not filter this strip.
  const allDoctors = t.doctors.items || [];
  const doctors = allDoctors;

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const styles = getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap) || 12;
    const step = card ? card.offsetWidth + gap : Math.min(340, el.clientWidth * 0.9);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    const onScroll = () => {
      const card = el.querySelector("article");
      if (!card) return;
      const styles = getComputedStyle(el);
      const gap = parseFloat(styles.columnGap || styles.gap) || 12;
      const step = card.offsetWidth + gap;
      setActiveIdx(Math.round(el.scrollLeft / step));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [doctors.length]);

  if (!allDoctors.length) return null;

  const showArrows = doctors.length > 1;

  return (
    <section id="doctors" className="scroll-mt-header overflow-x-clip py-7 sm:py-10">
      <div className="section-container">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="section-title text-[1.35rem] sm:text-3xl">{t.doctors.title}</h2>
            <p className="mt-2 text-sm text-ink-muted sm:text-base">{t.doctors.subtitle}</p>
          </div>
          {showArrows && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:border-brand/30 hover:text-brand"
                aria-label={lang === "kz" ? "Алдыңғы" : "Назад"}
              >
                <Icon name="chevronLeft" className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:border-brand/30 hover:text-brand"
                aria-label={lang === "kz" ? "Келесі" : "Вперёд"}
              >
                <Icon name="chevronRight" className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {doctors.length === 0 ? (
        <div className="section-container">
          <p className="rounded-[1.5rem] border border-ink/[0.06] bg-surface-muted px-5 py-6 text-sm text-ink-muted">
            {t.doctors.empty}
          </p>
        </div>
      ) : (
        <>
          <div
            ref={trackRef}
            className="scrollbar-hide flex gap-3 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-1 snap-x snap-mandatory touch-pan-x sm:gap-4 sm:scroll-px-5 sm:px-5 lg:px-[max(1.25rem,calc((100vw-1200px)/2+2rem))]"
          >
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                lang={lang}
                t={t}
                cityId={cityId}
              />
            ))}
            <div className="w-4 shrink-0 sm:w-5" aria-hidden />
          </div>
          {doctors.length > 1 && (
            <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
              {doctors.map((d, i) => (
                <span
                  key={d.id}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIdx ? "w-5 bg-brand" : "w-1.5 bg-ink/15"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
