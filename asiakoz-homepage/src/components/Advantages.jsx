import Icon from "./Icon";
import { useLang } from "../i18n/LanguageContext";
import { IS_HOME } from "../lib/branch";

export default function Advantages() {
  const { t } = useLang();
  const items = t.advantages.items || [];
  // Home: show 3 compact cards (skip first globe OR keep 4 with map as "two branches")
  // Spec wants the "two branches" card copy + compact layout for all cards.
  const homeItems = IS_HOME ? items : items;

  return (
    <section id="about" className="scroll-mt-header py-8 sm:py-12">
      <div className="section-container">
        <h2 className="section-title mb-5 text-center text-[1.35rem] sm:mb-8 sm:text-3xl">
          {t.advantages.title}
        </h2>

        <div
          className={
            IS_HOME
              ? "flex gap-3 overflow-x-auto overscroll-x-contain pb-1 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4"
              : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          }
        >
          {homeItems.map((item) => (
            <article
              key={item.title}
              className={
                IS_HOME
                  ? "min-w-[240px] snap-start rounded-[1.5rem] border border-ink/[0.06] bg-white p-5 shadow-soft sm:min-w-0 sm:p-6"
                  : "rounded-3xl border border-ink/[0.06] bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
              }
            >
              <div
                className={`mb-3 flex items-center justify-center rounded-2xl bg-brand-soft text-brand ${
                  IS_HOME ? "h-12 w-12" : "mb-4 h-11 w-11"
                }`}
              >
                <Icon name={item.icon} className={IS_HOME ? "h-5 w-5" : "h-5 w-5"} />
              </div>
              <h3 className="text-base font-bold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-snug text-ink-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
