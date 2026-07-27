import Icon from "./Icon";
import { useLang } from "../i18n/LanguageContext";

export default function Advantages() {
  const { t } = useLang();

  return (
    <section id="about" className="scroll-mt-24 py-16 sm:py-20">
      <div className="section-container">
        <h2 className="section-title mb-10 text-center">{t.advantages.title}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.advantages.items.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-ink/[0.06] bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <Icon name={item.icon} className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
