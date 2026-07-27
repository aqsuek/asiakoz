import Icon from "../Icon";
import { useLang } from "../../i18n/LanguageContext";

export default function CompactAdvantages() {
  const { t } = useLang();
  const a = t.laserAdvantages || t.advantages;
  if (!a?.items?.length) return null;

  return (
    <section id="about" className="scroll-mt-24 bg-surface-muted py-10 sm:py-12">
      <div className="section-container">
        <h2 className="section-title mb-6 text-center text-[1.55rem] sm:mb-8 sm:text-3xl">
          {a.title}
        </h2>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {a.items.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.25rem] border border-ink/[0.06] bg-white p-3.5 shadow-soft sm:p-5"
            >
              <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Icon name={item.icon} className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold leading-snug text-ink sm:text-base">{item.title}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-muted sm:text-sm">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
