import { useEffect } from "react";
import Icon from "./Icon";
import { useLang } from "../i18n/LanguageContext";

export default function CityFAQ() {
  const { t } = useLang();
  const faq = t.cityFaq;

  useEffect(() => {
    if (!faq?.items?.length) return undefined;
    const scriptId = "city-faq-jsonld";
    document.getElementById(scriptId)?.remove();

    const data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
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
          {faq.subtitle ? (
            <p className="mt-2 text-sm text-ink-muted sm:text-base">{faq.subtitle}</p>
          ) : null}
        </div>
        <div className="mx-auto max-w-2xl divide-y divide-ink/[0.08] rounded-[1.5rem] border border-ink/[0.06] bg-white px-2 shadow-soft sm:px-4">
          {faq.items.map((item, i) => (
            <details key={item.q} className="group px-2 py-1" open={i === 0}>
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-left text-sm font-bold text-ink marker:content-none sm:text-[15px] [&::-webkit-details-marker]:hidden">
                {item.q}
                <Icon
                  name="chevron"
                  className="h-4 w-4 shrink-0 text-brand transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="pb-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
