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
    <section id="doctors" className="scroll-mt-24 py-10 sm:py-12">
      <div className="section-container">
        <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
          <h2 className="section-title text-[1.55rem] sm:text-3xl">{t.doctors.title}</h2>
          <p className="mt-2 text-sm text-ink-muted sm:text-base">{t.doctors.subtitle}</p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 sm:gap-5">
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
            const tags = (d.tags || []).slice(0, 3);
            const stats = (d.stats || []).slice(0, 4);

            return (
              <article
                key={d.id}
                className="flex flex-col overflow-hidden rounded-[1.75rem] border border-ink/[0.06] bg-white shadow-card transition-transform duration-300 hover:-translate-y-0.5"
              >
                <a href={profileUrl} className="flex flex-1 flex-col text-left">
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-brand-soft to-surface-muted">
                    <img
                      src={assetUrl(d.image)}
                      alt={d.name}
                      className="h-full w-full object-cover object-top"
                      width={480}
                      height={600}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">
                      {d.branch}
                    </p>
                    <h3 className="mt-1.5 font-display text-xl font-extrabold tracking-tight text-ink">
                      {d.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-brand-deep">{d.role}</p>

                    {stats.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {stats.map((stat) => (
                          <div
                            key={stat.label}
                            className="rounded-xl border border-brand/15 bg-brand-soft/50 px-2.5 py-2 text-center"
                          >
                            <p className="text-base font-extrabold text-brand">{stat.value}</p>
                            <p className="mt-0.5 text-[10px] leading-snug text-ink-muted">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                      {d.lead}
                    </p>

                    {tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-brand/15 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-brand"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <span className="btn-ghost mt-4 self-start !px-0">
                      {t.doctors.more}
                      <Icon name="arrow" className="h-4 w-4" />
                    </span>
                  </div>
                </a>

                <div className="px-5 pb-5 sm:px-6 sm:pb-6">
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
                    className="btn-primary min-h-12 w-full"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    {t.doctors.book}
                    <Icon name="arrow" className="h-4 w-4" />
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
