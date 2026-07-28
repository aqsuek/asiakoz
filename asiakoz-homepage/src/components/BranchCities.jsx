import Icon from "./Icon";
import { useLang } from "../i18n/LanguageContext";
import { useCity } from "../context/CityContext";
import { branchCityName } from "../data/branches";
import { trackEvent } from "../lib/analytics";

export default function BranchCities() {
  const { lang, t } = useLang();
  const { cityId, setCityId, branches } = useCity();
  const block = t.branchCities;
  const picker = t.cityPicker || {};

  return (
    <section id="branches" className="scroll-mt-header py-6 sm:py-8">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-title text-[1.35rem] sm:text-3xl">{block.title}</h2>
          {block.subtitle && (
            <p className="mt-2 text-sm text-ink-muted sm:text-base">{block.subtitle}</p>
          )}
        </div>

        <div
          className="mt-5 flex gap-2 overflow-x-auto overscroll-x-contain pb-1 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0"
          role="tablist"
          aria-label={picker.label || block.title}
        >
          {branches.map((branch) => {
            const selected = cityId === branch.id;
            const soon = branch.status === "coming_soon";
            const name = branchCityName(branch, lang);
            return (
              <button
                key={branch.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setCityId(branch.id)}
                className={`relative flex min-h-[72px] min-w-[148px] snap-start flex-col items-start rounded-[1.35rem] border px-4 py-3.5 text-left transition-all sm:min-w-0 ${
                  selected
                    ? "border-brand bg-brand-soft/70 shadow-soft"
                    : "border-ink/[0.08] bg-white hover:border-brand/25"
                }`}
              >
                <span className="flex w-full items-center justify-between gap-2">
                  <span className="text-[15px] font-bold text-ink">{name}</span>
                  {soon && (
                    <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                      {picker.soon || "Скоро"}
                    </span>
                  )}
                </span>
                <span className="mt-1 text-xs text-ink-muted">
                  {soon ? picker.soonBadge : picker.open}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {branches
            .filter((b) => b.status === "open")
            .map((branch) => (
              <a
                key={branch.id}
                href={branch.pageHref}
                onClick={() =>
                  trackEvent("service_open", {
                    city: branch.id,
                    target: "branch_page",
                    page_url: window.location.href,
                  })
                }
                className="inline-flex min-h-11 items-center gap-1 rounded-full border border-ink/10 bg-white px-3.5 text-sm font-semibold text-ink-muted transition-colors hover:border-brand/30 hover:text-brand"
              >
                {branchCityName(branch, lang)} — {picker.pageCta}
                <Icon name="arrow" className="h-3.5 w-3.5" />
              </a>
            ))}
          <a
            href="/laser/"
            className="inline-flex min-h-11 items-center gap-1 rounded-full border border-brand/20 bg-brand-soft/50 px-3.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
          >
            {picker.laserCta}
            <Icon name="zap" className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
