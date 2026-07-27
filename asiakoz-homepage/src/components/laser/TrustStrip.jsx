import { useLang } from "../../i18n/LanguageContext";

export default function TrustStrip() {
  const { t } = useLang();
  const items = t.laserTrust?.items || [];
  if (!items.length) return null;

  return (
    <section className="pb-4 sm:pb-6" aria-label={t.laserTrust?.title || "Trust"}>
      <div className="section-container">
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={`${item.value}-${item.label}`}
              className="flex min-h-[76px] flex-col justify-center rounded-xl border border-ink/[0.06] bg-white px-2.5 py-2.5 text-center shadow-soft sm:min-h-[88px] sm:rounded-2xl sm:px-4 sm:py-3.5"
            >
              <p className="text-sm font-extrabold leading-tight text-brand sm:text-lg">
                {item.value}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-ink-muted sm:text-xs">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
