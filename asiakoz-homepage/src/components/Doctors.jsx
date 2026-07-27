import Icon from "./Icon";
import WhatsAppIcon from "./WhatsAppIcon";
import { useLang } from "../i18n/LanguageContext";
import { waBookingUrl } from "../data/contacts";
import { assetUrl } from "../data/reviews";
import { doctorUrl } from "../lib/routes";
import { IS_LASER } from "../lib/branch";
import { trackEvent } from "../lib/analytics";

export default function Doctors() {
  const { lang, t } = useLang();
  const doctors = t.doctors.items;

  return (
    <section id="doctors" className="scroll-mt-24 scroll-mb-28 py-7 sm:py-10">
      <div className="section-container">
        <div className="mx-auto mb-4 max-w-2xl text-center sm:mb-6">
          <h2 className="section-title text-[1.4rem] sm:text-3xl">{t.doctors.title}</h2>
          <p className="mt-2 text-sm text-ink-muted sm:text-base">{t.doctors.subtitle}</p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 sm:gap-5">
          {doctors.map((d) => {
            const profileUrl = d.profileUrl || doctorUrl(d.id);
            const bookExtra =
              IS_LASER
                ? lang === "ru"
                  ? `Здравствуйте! Хочу записаться на консультацию по лазерной коррекции к доктору ${d.name}.`
                  : `Сәлеметсіз бе! Лазерлік коррекция бойынша ${d.name} дәрігеріне жазылғым келеді.`
                : lang === "ru"
                  ? `Врач: ${d.name}`
                  : `Дәрігер: ${d.name}`;
            const bookUrl = waBookingUrl(lang, bookExtra);
            const stats = (d.stats || []).slice(0, 4);

            return (
              <article
                key={d.id}
                className="flex flex-col overflow-hidden rounded-[1.5rem] border border-ink/[0.06] bg-white shadow-card"
              >
                <a href={profileUrl} className="flex flex-1 flex-col text-left">
                  <div className="relative max-h-[420px] overflow-hidden bg-gradient-to-b from-brand-soft to-surface-muted aspect-[4/5] sm:max-h-none">
                    <img
                      src={assetUrl(d.image)}
                      alt={d.name}
                      className="h-full max-h-[420px] w-full object-cover object-[center_15%] sm:max-h-none sm:object-top"
                      width={480}
                      height={600}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">
                      {d.name}
                    </h3>
                    <p className="mt-0.5 text-sm font-semibold text-brand-deep">{d.role}</p>

                    {stats.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-1.5">
                        {stats.map((stat) => (
                          <div
                            key={stat.label}
                            className="rounded-lg border border-brand/15 bg-brand-soft/50 px-2 py-1.5 text-center"
                          >
                            <p className="text-sm font-extrabold text-brand sm:text-base">
                              {stat.value}
                            </p>
                            <p className="mt-0.5 text-[10px] leading-snug text-ink-muted">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{d.lead}</p>

                    <span className="btn-ghost mt-3 self-start !px-0 text-sm">
                      {t.doctors.more}
                      <Icon name="arrow" className="h-4 w-4" />
                    </span>
                  </div>
                </a>

                <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                  <a
                    href={bookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      IS_LASER &&
                      trackEvent("laser_doctor_cta_click", {
                        language: lang,
                        doctor_name: d.name,
                        button_location: "doctors",
                      })
                    }
                    className="btn-primary min-h-11 w-full !py-3"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    {t.doctors.book}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
