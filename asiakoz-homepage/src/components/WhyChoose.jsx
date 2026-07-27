import Icon from "./Icon";
import SectionHeading from "./SectionHeading";
import { WHY_CHOOSE } from "../data/content";

export default function WhyChoose() {
  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="section-container-wide">
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            align="left"
            label="О клинике"
            title="Почему выбирают Азиякоз"
            subtitle="Турецкая офтальмология в Казахстане — сложные операции, современное оборудование и внимание к каждому пациенту."
            className="lg:sticky lg:top-28"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {WHY_CHOOSE.map((item) => (
              <div key={item.title} className="card-surface p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <Icon name={item.icon} className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
