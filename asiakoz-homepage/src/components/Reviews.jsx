import { useRef } from "react";
import Icon from "./Icon";
import { CLINIC } from "../data/contacts";
import { getVideoReviews, assetUrl } from "../data/reviews";
import { trackEvent } from "../lib/analytics";
import { IS_LASER } from "../lib/branch";
import { useLang } from "../i18n/LanguageContext";

function VideoCard({ review, openLabel }) {
  return (
    <article className="w-[260px] shrink-0 snap-start overflow-hidden rounded-3xl border border-ink/[0.06] bg-white shadow-soft sm:w-[280px]">
      <div className="relative aspect-[9/16] bg-surface-muted">
        <video
          className="h-full w-full object-cover"
          src={assetUrl(review.src)}
          playsInline
          controls
          preload="none"
          controlsList="nodownload noplaybackrate"
        />
      </div>
      {review.instagramUrl && (
        <div className="space-y-2 p-4">
          <a
            href={review.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            {openLabel}
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </article>
  );
}

export default function Reviews({ skipFirst = false }) {
  const { lang, t } = useLang();
  const trackRef = useRef(null);
  const all = getVideoReviews();
  const videoReviews = skipFirst ? all.slice(1) : all;

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(300, el.clientWidth * 0.85), behavior: "smooth" });
  };

  if (!videoReviews.length) return null;

  return (
    <section id="reviews" className="scroll-mt-24 bg-surface-muted py-10 sm:py-12">
      <div className="section-container">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="section-title text-[1.55rem] sm:text-3xl">{t.reviews.title}</h2>
            <p className="mt-2 text-sm text-ink-muted sm:text-base">{t.reviews.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink hover:border-brand/30 hover:text-brand"
              aria-label="Prev"
            >
              <Icon name="chevronLeft" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink hover:border-brand/30 hover:text-brand"
              aria-label="Next"
            >
              <Icon name="chevronRight" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="scrollbar-hide -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 snap-x snap-mandatory"
        >
          {videoReviews.map((review) => (
            <VideoCard
              key={review.id}
              review={review}
              openLabel={t.reviews.openInIg}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={CLINIC.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              IS_LASER &&
              trackEvent("laser_instagram_click", {
                language: lang,
                button_location: "reviews",
              })
            }
            className="btn-primary min-h-12"
          >
            {t.reviews.allOnIg}
            <Icon name="instagram" className="h-4 w-4" />
          </a>
          <a
            href={CLINIC.gis.searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              IS_LASER &&
              trackEvent("laser_reviews_2gis_click", {
                language: lang,
                button_location: "reviews",
              })
            }
            className="btn-outline min-h-12"
          >
            {t.reviews.allOnGis}
            <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
