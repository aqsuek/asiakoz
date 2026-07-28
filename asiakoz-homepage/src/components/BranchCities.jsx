import Icon from "./Icon";
import { useLang } from "../i18n/LanguageContext";

export default function BranchCities() {
  const { t } = useLang();
  const block = t.branchCities;
  if (!block?.items?.length) return null;

  return (
    <section id="branches" className="scroll-mt-24 scroll-mb-28 py-7 sm:py-10">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-title text-[1.4rem] sm:text-3xl">{block.title}</h2>
          {block.subtitle && (
            <p className="mt-2 text-sm text-ink-muted sm:text-base">{block.subtitle}</p>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {block.items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="flex flex-col rounded-[1.35rem] border border-ink/[0.06] bg-white px-5 py-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-card"
            >
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <Icon name={item.icon || "map"} className="h-5 w-5" />
              </span>
              <span className="text-base font-bold text-ink">{item.city}</span>
              <span className="mt-1 text-sm leading-snug text-ink-muted">{item.text}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                {item.cta}
                <Icon name="arrow" className="h-4 w-4" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
