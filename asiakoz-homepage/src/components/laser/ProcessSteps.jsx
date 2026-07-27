import { useLang } from "../../i18n/LanguageContext";

export default function ProcessSteps() {
  const { t } = useLang();
  const p = t.laserProcess;
  if (!p?.steps?.length) return null;

  return (
    <section id="process" className="scroll-mt-24 scroll-mb-28 bg-surface-muted py-7 sm:py-10">
      <div className="section-container">
        <div className="mx-auto mb-4 max-w-2xl text-center sm:mb-6">
          <h2 className="section-title text-[1.4rem] sm:text-3xl">{p.title}</h2>
          <p className="mt-2 text-sm text-ink-muted sm:text-base">{p.subtitle}</p>
        </div>

        {/* Mobile timeline */}
        <ol className="relative mx-auto max-w-lg space-y-0 sm:hidden">
          <span
            className="absolute bottom-2 left-[15px] top-2 w-px bg-brand/25"
            aria-hidden
          />
          {p.steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-3 py-2.5 pl-1">
              <span className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-extrabold text-white">
                {i + 1}
              </span>
              <div className="min-w-0 pt-0.5">
                <h3 className="text-sm font-bold text-ink">{step.title}</h3>
                <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Desktop compact cards */}
        <ol className="mx-auto hidden max-w-4xl gap-3 sm:grid sm:grid-cols-2">
          {p.steps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-[1.25rem] border border-ink/[0.06] bg-white p-4 shadow-soft"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-extrabold text-white">
                {i + 1}
              </span>
              <h3 className="mt-2 text-base font-bold text-ink">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
