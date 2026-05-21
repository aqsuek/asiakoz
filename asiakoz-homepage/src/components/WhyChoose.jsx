import Icon from "./Icon";
import { WHY_CHOOSE } from "../data/content";

export default function WhyChoose() {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24">
      <div className="section-container">
        <h2 className="mb-12 text-center text-2xl font-extrabold text-ink sm:text-3xl">
          Почему выбирают ASIAKÖZ?
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {WHY_CHOOSE.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center rounded-2xl border border-transparent p-4 text-center transition-colors hover:border-brand/15 hover:bg-brand-soft/50 sm:items-start sm:text-left"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <Icon name={item.icon} className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
