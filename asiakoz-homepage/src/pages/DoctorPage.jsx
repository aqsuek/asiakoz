import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import WhatsAppIcon from "../components/WhatsAppIcon";
import { useLang } from "../i18n/LanguageContext";
import { waBookingUrl } from "../data/contacts";
import { assetUrl } from "../data/reviews";
import { CLINIC } from "../data/contacts";
import { homeUrl } from "../lib/routes";
import { IS_HOME } from "../lib/branch";
import { getDoctorById } from "../lib/doctors";

export default function DoctorPage({ doctorId }) {
  const { lang, t } = useLang();
  const [remoteDoctor, setRemoteDoctor] = useState(IS_HOME ? undefined : null);

  useEffect(() => {
    if (!IS_HOME) return undefined;
    let cancelled = false;
    getDoctorById(doctorId, lang).then((item) => {
      if (!cancelled) setRemoteDoctor(item || null);
    });
    return () => {
      cancelled = true;
    };
  }, [doctorId, lang]);

  const doctor = IS_HOME ? remoteDoctor : t.doctors.items.find((item) => item.id === doctorId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [doctorId]);

  useEffect(() => {
    if (!doctor) return undefined;
    const prev = document.title;
    document.title = `${doctor.name} — AsiaKoz ${CLINIC.city}`;
    return () => {
      document.title = prev;
    };
  }, [doctor]);

  if (IS_HOME && remoteDoctor === undefined) {
    return (
      <section className="section-container py-20 text-center">
        <p className="text-ink-muted">{t.news?.loading || "Жүктелуде…"}</p>
      </section>
    );
  }

  if (!doctor) {
    return (
      <section className="section-container py-20 text-center">
        <h1 className="section-title">
          {lang === "ru" ? "Врач не найден" : "Дәрігер табылмады"}
        </h1>
        <a href={homeUrl("#doctors")} className="btn-primary mt-6 inline-flex">
          {t.doctors.back}
        </a>
      </section>
    );
  }

  const bookUrl = waBookingUrl(
    lang,
    lang === "ru" ? `Врач: ${doctor.name}` : `Дәрігер: ${doctor.name}`,
  );

  return (
    <section className="pb-16 pt-6 sm:pb-20 sm:pt-8">
      <div className="section-container">
        <a href={homeUrl("#doctors")} className="btn-ghost !px-0">
          <Icon name="chevronLeft" className="h-4 w-4" />
          {t.doctors.back}
        </a>

        <article className="mt-5 overflow-hidden rounded-[1.75rem] border border-ink/[0.06] bg-white shadow-card">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[320px] bg-gradient-to-b from-brand-soft to-surface-muted sm:min-h-[420px]">
              <img
                src={assetUrl(doctor.image)}
                alt={doctor.name}
                className="h-full w-full object-cover object-top"
                width={720}
                height={900}
              />
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                {doctor.branch}
                {doctor.temporaryActive ? (
                  <span className="ml-1.5 normal-case text-brand-deep/80">
                    · {lang === "ru" ? "временно" : "уақытша"}
                  </span>
                ) : null}
              </p>
              <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                {doctor.name}
              </h1>
              <p className="mt-2 text-base font-semibold text-brand-deep">{doctor.role}</p>
              <p className="mt-1 text-sm text-ink-muted">{doctor.experience}</p>

              <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">{doctor.lead}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{doctor.bio}</p>

              {doctor.stats?.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {doctor.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-ink/[0.06] bg-surface-muted px-3 py-3 text-center"
                    >
                      <p className="text-lg font-extrabold text-brand sm:text-xl">{stat.value}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-ink-faint sm:text-xs">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <a
                href={bookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-8 w-full sm:w-auto sm:self-start"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {t.doctors.book}
                <Icon name="arrow" className="h-4 w-4" />
              </a>
            </div>
          </div>

          {doctor.specialties?.length > 0 && (
            <div className="border-t border-ink/[0.06] p-6 sm:p-8 lg:p-10">
              <p className="text-sm font-bold text-ink">{t.doctors.specialization}</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {doctor.specialties.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-2xl border border-ink/[0.06] bg-surface-muted/60 px-4 py-3.5"
                  >
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.text}</p>
                  </li>
                ))}
              </ul>

              {doctor.tags?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {doctor.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-brand/15 bg-brand-soft/70 px-3 py-1 text-xs font-semibold text-brand"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
