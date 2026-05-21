import { PROCESS_STEPS } from "../data/content";

export default function Process() {
  return (
    <section id="process" className="bg-section-fade py-16 sm:py-20 lg:py-24">
      <div className="section-container">
        <h2 className="mb-12 text-center text-2xl font-extrabold text-ink sm:text-3xl">
          Как проходит лечение?
        </h2>

        <div className="relative">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent lg:block" />

          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, index) => (
              <li key={step.step} className="relative text-center">
                {index < PROCESS_STEPS.length - 1 && (
                  <span
                    className="absolute -right-4 top-8 hidden text-brand/40 lg:inline"
                    aria-hidden
                  >
                    →
                  </span>
                )}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-xl font-extrabold text-white shadow-card">
                  {step.step}
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
