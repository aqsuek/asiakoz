import { useEffect, useId, useState } from "react";
import Icon from "../Icon";
import { useLang } from "../../i18n/LanguageContext";

export default function LaserFAQ() {
  const { t } = useLang();
  const faq = t.laserFaq;
  const [open, setOpen] = useState(0);
  const baseId = useId();

  useEffect(() => {
    if (!faq?.items?.length) return undefined;
    const scriptId = "laser-faq-jsonld";
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    };
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = scriptId;
    el.text = JSON.stringify(data);
    document.head.appendChild(el);
    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [faq]);

  if (!faq?.items?.length) return null;

  return (
    <section id="faq" className="scroll-mt-24 scroll-mb-28 py-7 sm:py-10">
      <div className="section-container">
        <div className="mx-auto mb-4 max-w-2xl text-center">
          <h2 className="section-title text-[1.4rem] sm:text-3xl">{faq.title}</h2>
        </div>
        <div className="mx-auto max-w-2xl divide-y divide-ink/[0.08] rounded-[1.5rem] border border-ink/[0.06] bg-white px-2 shadow-soft sm:px-4">
          {faq.items.map((item, i) => {
            const panelId = `${baseId}-panel-${i}`;
            const buttonId = `${baseId}-btn-${i}`;
            const isOpen = open === i;
            return (
              <div key={item.q} className="px-2 py-1">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex min-h-12 w-full items-center justify-between gap-3 py-3 text-left text-sm font-bold text-ink sm:text-[15px]"
                  >
                    {item.q}
                    <Icon
                      name="chevron"
                      className={`h-4 w-4 shrink-0 text-brand transition-transform ${isOpen ? "" : "rotate-180"}`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="pb-3 text-sm leading-relaxed text-ink-muted"
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
