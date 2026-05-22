import SectionHeading from "./SectionHeading";
import { PROCESS_STEPS } from "../data/content";

export default function Process() {
  return (
    <section id="process" className="relative overflow-hidden bg-section-fade py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-brand-mesh opacity-80"
        aria-hidden
      />

      <div className="section-container relative">
        <SectionHeading
          label="Как мы работаем"
          title="Как проходит лечение?"
          className="mb-12"
        />

        <div className="section-panel">
          <div className="relative">
            <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-gradient-to-r from-brand/10 via-brand/40 to-brand/10 lg:block" />

            <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS_STEPS.map((step, index) => (
                <li key={step.step} className="relative text-center">
                  {index < PROCESS_STEPS.length - 1 && (
                    <span
                      className="absolute -right-4 top-8 hidden font-bold text-brand/50 lg:inline"
                      aria-hidden
                    >
                      →
                    </span>
                  )}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-xl font-extrabold text-white shadow-float ring-4 ring-brand/15">
                    {step.step}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
