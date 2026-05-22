import Icon from "./Icon";
import SectionHeading from "./SectionHeading";
import { WHY_CHOOSE } from "../data/content";

export default function WhyChoose() {
  return (
    <section id="about" className="section-tint py-16 sm:py-20 lg:py-24">
      <div className="section-container">
        <SectionHeading
          label="Преимущества"
          title="Почему выбирают ASIAKÖZ?"
          className="mb-12"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {WHY_CHOOSE.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center rounded-2xl border border-brand/10 bg-white/80 p-5 text-center shadow-soft backdrop-blur-sm transition-all hover:border-brand/25 hover:bg-white hover:shadow-float sm:items-start sm:p-6 sm:text-left"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-card">
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
