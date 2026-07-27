import { useState } from "react";
import Icon from "../Icon";
import { useLang } from "../../i18n/LanguageContext";

export default function LaserMethods() {
  const { t } = useLang();
  const m = t.laserMethods;
  const [openId, setOpenId] = useState(m?.items?.[0]?.id || null);

  if (!m?.items?.length) return null;

  return (
    <section id="methods" className="scroll-mt-24 scroll-mb-28 py-7 sm:py-10">
      <div className="section-container">
        <div className="mx-auto mb-4 max-w-2xl text-center sm:mb-6">
          <h2 className="section-title text-[1.4rem] sm:text-3xl">{m.title}</h2>
          <p className="mt-2 text-sm text-ink-muted sm:text-base">{m.subtitle}</p>
        </div>

        {/* Mobile accordion */}
        <div className="space-y-2 sm:hidden">
          {m.items.map((item) => {
            const open = openId === item.id;
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-ink/[0.06] bg-white shadow-soft"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : item.id)}
                >
                  <span className="text-sm font-bold text-ink">{item.title}</span>
                  <Icon
                    name="chevron"
                    className={`h-4 w-4 shrink-0 text-brand transition-transform ${open ? "" : "rotate-180"}`}
                  />
                </button>
                {open && (
                  <div className="border-t border-ink/[0.05] px-3.5 pb-3.5 pt-2">
                    <p className="text-sm leading-relaxed text-ink-muted">{item.text}</p>
                    {item.feature && (
                      <p className="mt-1.5 text-xs font-medium text-brand-deep">{item.feature}</p>
                    )}
                    {item.forWhom && (
                      <p className="mt-1 text-xs text-ink-faint">{item.forWhom}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop compact grid */}
        <div className="hidden gap-3 sm:grid sm:grid-cols-2">
          {m.items.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.25rem] border border-ink/[0.06] bg-white p-4 shadow-soft"
            >
              <h3 className="text-base font-bold text-ink">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.text}</p>
              {item.feature && (
                <p className="mt-2 text-xs font-medium text-brand-deep">{item.feature}</p>
              )}
              {item.forWhom && (
                <p className="mt-1 text-xs text-ink-faint">{item.forWhom}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
