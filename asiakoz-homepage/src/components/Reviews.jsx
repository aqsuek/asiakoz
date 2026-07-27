import { useRef } from "react";
import Icon from "./Icon";
import ReviewVideo from "./ReviewVideo";
import { CLINIC } from "../data/contacts";
import { getVideoReviews } from "../data/reviews";
import { trackEvent } from "../lib/analytics";
import { IS_LASER } from "../lib/branch";
import { useLang } from "../i18n/LanguageContext";

function VideoCard({ review, openLabel, playLabel, onPlay, wide }) {
  return (
    <article
      className={`shrink-0 overflow-hidden rounded-3xl border border-ink/[0.06] bg-white shadow-soft ${
        wide
          ? "w-[min(320px,86vw)] snap-center"
          : "w-[min(240px,78vw)] snap-start sm:w-[260px]"
      }`}
    >
      <ReviewVideo
        src={review.src}
        poster={review.poster}
        aspectClass="aspect-[9/16]"
        maxHeightClass="max-h-[420px]"
        playLabel={playLabel}
        onPlay={onPlay}
      />
      {review.instagramUrl && (
        <div className="space-y-2 p-3">
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
    const card = el.querySelector("article");
    const step = card ? card.offsetWidth + 16 : Math.min(280, el.clientWidth * 0.85);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (!videoReviews.length) return null;

  return (
    <section id="reviews" className="scroll-mt-24 scroll-mb-28 overflow-x-clip bg-surface-muted py-8 sm:py-10">
      <div className="section-container">
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="section-title text-[1.4rem] sm:text-3xl">{t.reviews.title}</h2>
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
          className={`scrollbar-hide flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory touch-pan-x sm:gap-4 ${
            IS_LASER
              ? "scroll-px-4 px-1 sm:scroll-px-5"
              : "-mx-4 px-4 sm:-mx-5 sm:px-5"
          }`}
        >
          {videoReviews.map((review) => (
            <VideoCard
              key={review.id}
              review={review}
              wide={IS_LASER}
              openLabel={t.reviews.openInIg}
              playLabel={t.laserFeaturedReview?.play || "Play"}
              onPlay={() =>
                IS_LASER &&
                trackEvent("laser_video_play", {
                  language: lang,
                  video_id: review.id,
                  button_location: "reviews_slider",
                })
              }
            />
          ))}
          {IS_LASER && <div className="w-1 shrink-0" aria-hidden />}
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
