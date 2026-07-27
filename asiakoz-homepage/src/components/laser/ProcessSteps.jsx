import { useLang } from "../../i18n/LanguageContext";

export default function ProcessSteps() {
  const { t } = useLang();
  const p = t.laserProcess;
  if (!p?.steps?.length) return null;

  return (
    <section id="process" className="scroll-mt-24 bg-surface-muted py-10 sm:py-12">
      <div className="section-container">
        <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
          <h2 className="section-title text-[1.55rem] sm:text-3xl">{p.title}</h2>
          <p className="mt-2 text-sm text-ink-muted sm:text-base">{p.subtitle}</p>
        </div>
        <ol className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
          {p.steps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-[1.35rem] border border-ink/[0.06] bg-white p-4 shadow-soft sm:p-5"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 text-base font-bold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
