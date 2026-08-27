import Icon from "./Icon";
import { useLang } from "../i18n/LanguageContext";
import { useCity } from "../context/CityContext";
import {
  branchAddress,
  branchCityName,
  isComingSoon,
  phoneHref,
} from "../data/branches";
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
          className="mt-5 flex gap-3 overflow-x-auto overscroll-x-contain pb-1 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3"
          role="tablist"
          aria-label={picker.label || block.title}
        >
          {branches.map((branch) => {
            const selected = cityId === branch.id;
            const soon = isComingSoon(branch);
            const name = branchCityName(branch, lang);
            const address = branchAddress(branch, lang);
            const summary = lang === "ru" ? branch.summaryRu : branch.summaryKz;
            return (
              <article
                key={branch.id}
                className={`relative min-w-[260px] snap-start rounded-[1.35rem] border bg-white p-4 shadow-soft transition-all sm:min-w-0 ${
                  selected
                    ? "border-brand bg-brand-soft/70 shadow-soft"
                    : "border-ink/[0.08] bg-white hover:border-brand/25"
                }`}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setCityId(branch.id)}
                  className="absolute inset-0 z-0 rounded-[1.35rem]"
                  aria-label={name}
                />
                <div className="relative z-10">
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="text-[16px] font-bold text-ink">{name}</span>
                    {soon && (
                      <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                        {picker.soon || "Скоро"}
                      </span>
                    )}
                  </span>
                  <p className="mt-2 text-sm leading-snug text-ink-muted">{address}</p>
                  {summary ? (
                    <p className="mt-1 text-sm leading-snug text-ink-muted">{summary}</p>
                  ) : null}
                  {branch.id !== "almaty" && (
                    <a
                      href={phoneHref(branch.phoneTel)}
                      className="mt-2 block text-sm font-semibold text-brand hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {branch.phoneDisplay}
                    </a>
                  )}
                  {!summary && (
                    <p className="mt-1 text-sm leading-snug text-ink-muted">
                      {soon
                        ? lang === "ru"
                          ? "Скоро открытие. Идет предварительная запись"
                          : "Жақында ашылады. Алдын ала жазылу жүріп жатыр"
                        : picker.activeLabel}
                    </p>
                  )}
                </div>
                <div className="relative z-10 mt-3 flex flex-wrap gap-2">
                  {!soon && (
                    <a
                      href={lang === "kz" ? branch.kkHref : branch.pageHref}
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
                    </a>
                  )}
                  <a
                    href={`https://wa.me/${branch.whatsapp.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent("whatsapp_click", {
                        city: branch.id,
                        button_location: soon ? "branches_prebook" : "branches_book",
                        page_url: window.location.href,
                      })
                    }
                    className="inline-flex min-h-11 items-center gap-1 rounded-full border border-brand/20 bg-brand-soft/50 px-3.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
                  >
                    {soon ? picker.prebookCta : picker.bookCta}
                    <Icon name="arrow" className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
