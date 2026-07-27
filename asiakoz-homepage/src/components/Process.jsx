import SectionHeading from "./SectionHeading";
import { PROCESS_STEPS } from "../data/content";

export default function Process() {
  return (
    <section id="process" className="bg-surface-muted py-16 sm:py-24">
      <div className="section-container-wide">
        <SectionHeading
          label="Как мы работаем"
          title="Путь к здоровому зрению"
          subtitle="Четыре простых шага — от диагностики до полного восстановления"
          className="mb-12"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step) => (
            <div key={step.step} className="process-step">
              <span className="text-3xl font-extrabold text-brand/20">{step.step}</span>
              <h3 className="text-lg font-bold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
