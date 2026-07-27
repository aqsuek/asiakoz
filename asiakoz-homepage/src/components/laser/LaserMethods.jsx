import { useLang } from "../../i18n/LanguageContext";

export default function LaserMethods() {
  const { t } = useLang();
  const m = t.laserMethods;
  if (!m?.items?.length) return null;

  return (
    <section id="methods" className="scroll-mt-24 py-10 sm:py-12">
      <div className="section-container">
        <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
          <h2 className="section-title text-[1.55rem] sm:text-3xl">{m.title}</h2>
          <p className="mt-2 text-sm text-ink-muted sm:text-base">{m.subtitle}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {m.items.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.35rem] border border-ink/[0.06] bg-white p-4 shadow-soft sm:p-5"
            >
              <h3 className="text-base font-bold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.text}</p>
              {item.forWhom && (
                <p className="mt-2 text-xs font-medium text-brand-deep">{item.forWhom}</p>
              )}
              {item.recovery && (
                <p className="mt-1 text-xs text-ink-faint">{item.recovery}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
