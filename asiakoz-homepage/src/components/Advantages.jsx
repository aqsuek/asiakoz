import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { useLang } from "../i18n/LanguageContext";

export default function Advantages() {
  const { lang, t } = useLang();
  const items = t.advantages.items || [];
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const styles = getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap) || 12;
    const step = card ? card.offsetWidth + gap : Math.min(320, el.clientWidth * 0.9);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    const onScroll = () => {
      const card = el.querySelector("article");
      if (!card) return;
      const styles = getComputedStyle(el);
      const gap = parseFloat(styles.columnGap || styles.gap) || 12;
      const step = card.offsetWidth + gap;
      setActiveIdx(Math.round(el.scrollLeft / step));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  if (!items.length) return null;

  const showArrows = items.length > 1;

  return (
    <section id="about" className="scroll-mt-header overflow-x-clip py-6 sm:py-10">
      <div className="section-container">
        <div className="mb-3 flex items-end justify-between gap-3 sm:mb-4">
          <h2 className="section-title text-[1.35rem] sm:text-3xl">{t.advantages.title}</h2>
          {showArrows && (
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:border-brand/30 hover:text-brand sm:h-11 sm:w-11"
                aria-label={lang === "kz" ? "Алдыңғы" : "Назад"}
              >
                <Icon name="chevronLeft" className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:border-brand/30 hover:text-brand sm:h-11 sm:w-11"
                aria-label={lang === "kz" ? "Келесі" : "Вперёд"}
              >
                <Icon name="chevronRight" className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        ref={trackRef}
        className="scrollbar-hide flex gap-3 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-1 snap-x snap-mandatory touch-pan-x sm:gap-4 sm:scroll-px-5 sm:px-5 lg:px-[max(1.25rem,calc((100vw-1200px)/2+2rem))]"
      >
        {items.map((item, i) => (
          <article
            key={item.title}
            className="flex w-[min(300px,82vw)] shrink-0 snap-start flex-row items-start gap-3 rounded-2xl border border-ink/[0.06] bg-white px-3.5 py-3.5 shadow-soft sm:w-[min(340px,40vw)] sm:rounded-[1.35rem] sm:px-5 sm:py-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand sm:h-11 sm:w-11 sm:rounded-2xl">
              <Icon name={item.icon} className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-brand/80">
                {i + 1}/{items.length}
              </div>
              <h3 className="text-[15px] font-bold leading-snug text-ink sm:text-base">{item.title}</h3>
              <p className="mt-1 text-xs leading-snug text-ink-muted sm:text-sm sm:leading-relaxed">
                {item.text}
              </p>
            </div>
          </article>
        ))}
        <div className="w-4 shrink-0 sm:w-5" aria-hidden />
      </div>

      {showArrows && (
        <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
          {items.map((item, i) => (
            <span
              key={item.title}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIdx ? "w-5 bg-brand" : "w-1.5 bg-ink/15"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
