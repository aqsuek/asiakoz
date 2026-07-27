import { useLang } from "../../i18n/LanguageContext";

export default function TrustStrip() {
  const { t } = useLang();
  const items = t.laserTrust?.items || [];
  if (!items.length) return null;

  return (
    <section className="pb-6 sm:pb-8" aria-label={t.laserTrust?.title || "Trust"}>
      <div className="section-container">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-ink/[0.06] bg-white px-3 py-3 text-center shadow-soft sm:px-4 sm:py-4"
            >
              <p className="text-base font-extrabold text-brand sm:text-lg">{item.value}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-ink-muted sm:text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
