import Icon from "../Icon";
import { useLang } from "../../i18n/LanguageContext";

export default function CompactAdvantages() {
  const { t } = useLang();
  const a = t.laserAdvantages || t.advantages;
  if (!a?.items?.length) return null;

  return (
    <section id="about" className="scroll-mt-24 scroll-mb-28 bg-surface-muted py-7 sm:py-10">
      <div className="section-container">
        <h2 className="section-title mb-4 text-center text-[1.4rem] sm:mb-6 sm:text-3xl">
          {a.title}
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {a.items.map((item) => (
            <article
              key={item.title}
              className="flex h-full flex-col rounded-xl border border-ink/[0.06] bg-white p-3 shadow-soft sm:rounded-[1.25rem] sm:p-4"
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <Icon name={item.icon} className="h-4 w-4" />
              </div>
              <h3 className="text-[13px] font-bold leading-snug text-ink sm:text-base">
                {item.title}
              </h3>
              <p className="mt-1 flex-1 text-[11px] leading-relaxed text-ink-muted sm:text-sm">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
