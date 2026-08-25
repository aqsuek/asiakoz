import { useLang } from "../i18n/LanguageContext";

export default function CityLenses() {
  const { t } = useLang();
  const block = t.cityLenses;
  if (!block?.items?.length) return null;

  return (
    <section id="lenses" className="scroll-mt-24 py-7 sm:py-10">
      <div className="section-container">
        <div className="mx-auto mb-5 max-w-3xl text-center">
          <h2 className="section-title text-[1.4rem] sm:text-3xl">{block.title}</h2>
          {block.subtitle ? (
            <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">{block.subtitle}</p>
          ) : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {block.items.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.35rem] border border-ink/[0.06] bg-white p-5 shadow-soft"
            >
              <h3 className="text-base font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.text}</p>
            </article>
          ))}
        </div>
        {block.note ? (
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-ink-muted">
            {block.note}{" "}
            {block.ctaHref && block.cta ? (
              <a href={block.ctaHref} className="font-semibold text-brand">
                {block.cta}
              </a>
            ) : null}
          </p>
        ) : null}
      </div>
    </section>
  );
}
