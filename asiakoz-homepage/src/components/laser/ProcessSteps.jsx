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

        <ol className="relative mx-auto max-w-lg sm:grid sm:max-w-4xl sm:grid-cols-2 sm:gap-3">
          <span
            className="absolute bottom-2 left-[15px] top-2 w-px bg-brand/25 sm:hidden"
            aria-hidden
          />
          {p.steps.map((step, i) => (
            <li
              key={step.title}
              className="relative flex gap-3 py-2.5 pl-1 sm:block sm:rounded-[1.25rem] sm:border sm:border-ink/[0.06] sm:bg-white sm:p-4 sm:shadow-soft"
            >
              <span className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-extrabold text-white sm:h-7 sm:w-7">
                {i + 1}
              </span>
              <div className="min-w-0 pt-0.5 sm:mt-2 sm:pt-0">
                <h3 className="text-sm font-bold text-ink sm:text-base">{step.title}</h3>
                <p className="mt-0.5 text-[13px] leading-snug text-ink-muted sm:mt-1 sm:text-sm sm:leading-relaxed">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
