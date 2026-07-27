import { useLang } from "../../i18n/LanguageContext";
import { homeUrl } from "../../lib/routes";
import { trackEvent } from "../../lib/analytics";

export default function Suitability() {
  const { lang, t } = useLang();
  const s = t.laserSuitability;
  if (!s) return null;

  return (
    <section id="suitability" className="scroll-mt-24 scroll-mb-28 bg-surface-muted py-7 sm:py-10">
      <div className="section-container">
        <div className="mx-auto max-w-2xl rounded-[1.5rem] border border-ink/[0.06] bg-white p-4 shadow-soft sm:p-7">
          <h2 className="section-title text-[1.4rem] sm:text-3xl">{s.title}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{s.text}</p>
          <ul className="mt-5 space-y-2.5">
            {s.points?.map((point) => (
              <li key={point} className="flex gap-2.5 text-sm text-ink sm:text-[15px]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-ink-faint">{s.note}</p>
          <a
            href={homeUrl("#booking")}
            onClick={() =>
              trackEvent("laser_hero_cta_click", {
                language: lang,
                button_location: "suitability",
              })
            }
            className="btn-primary mt-6 min-h-12 w-full sm:w-auto"
          >
            {s.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
