import { useRef } from "react";
import Icon from "./Icon";
import ReviewVideo from "./ReviewVideo";
import { CLINIC } from "../data/contacts";
import { getVideoReviews } from "../data/reviews";
import { trackEvent } from "../lib/analytics";
import { IS_HOME, IS_LASER } from "../lib/branch";
import { useCity } from "../context/CityContext";
import { useLang } from "../i18n/LanguageContext";
import { MAIN_INSTAGRAM } from "../data/branches";

function VideoCard({ review, openLabel, playLabel, caption, cityLabel, onPlay, wide }) {
  return (
    <article
      className={`flex shrink-0 flex-col overflow-hidden border border-ink/[0.06] bg-white shadow-soft ${
        wide
          ? "w-[86vw] max-w-[300px] snap-center rounded-3xl"
          : "w-[min(220px,72vw)] snap-start rounded-[1.5rem] sm:w-[240px]"
      }`}
    >
      <ReviewVideo
        src={review.src}
        poster={review.poster}
        aspectClass={wide ? "" : "aspect-[9/16]"}
        maxHeightClass={wide ? "h-[min(420px,72vw)] w-full" : "max-h-[360px]"}
        className="w-full"
        playLabel={playLabel}
        onPlay={onPlay}
      />
      <div className="w-full space-y-1.5 p-3">
        {cityLabel && (
          <p className="text-[10px] font-semibold uppercase tracking-wider text-brand">{cityLabel}</p>
        )}
        <p className="text-sm font-semibold leading-snug text-ink">
          {review.title || caption}
        </p>
        {review.instagramUrl && (
          <a
            href={review.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            {openLabel}
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}

export default function Reviews({ skipFirst = false }) {
  const { lang, t } = useLang();
  const { cityId, branch } = useCity();
  const trackRef = useRef(null);
  const all = getVideoReviews();
  const videoReviews = skipFirst ? all.slice(1) : all;

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const styles = getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap) || 12;
    const step = card ? card.offsetWidth + gap : Math.min(280, el.clientWidth * 0.85);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (!videoReviews.length) return null;

  const igUrl = IS_HOME ? MAIN_INSTAGRAM.url : CLINIC.instagram.url;
  const gisUrl = IS_HOME ? branch.gis.searchUrl : CLINIC.gis.searchUrl;
  // Videos are from @asiakoz.shymkent — label city honestly, do not invent procedure
  const reviewCity =
    lang === "ru" ? "Шымкент" : "Шымкент";

  return (
    <section id="reviews" className="scroll-mt-header overflow-x-clip bg-surface-muted py-7 sm:py-10">
      <div className="section-container">
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="section-title text-[1.35rem] sm:text-3xl">{t.reviews.title}</h2>
            <p className="mt-2 text-sm text-ink-muted sm:text-base">{t.reviews.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink hover:border-brand/30 hover:text-brand"
              aria-label={lang === "kz" ? "Алдыңғы" : "Назад"}
            >
              <Icon name="chevronLeft" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white text-ink hover:border-brand/30 hover:text-brand"
              aria-label={lang === "kz" ? "Келесі" : "Вперёд"}
            >
              <Icon name="chevronRight" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className={`scrollbar-hide flex gap-3 overflow-x-auto overscroll-x-contain pb-2 snap-x snap-mandatory touch-pan-x sm:gap-4 ${
            IS_LASER
              ? "scroll-px-4 px-4 sm:scroll-px-5 sm:px-5"
              : "-mx-4 px-4 sm:-mx-5 sm:px-5"
          }`}
        >
          {videoReviews.map((review) => (
            <VideoCard
              key={review.id}
              review={review}
              wide={IS_LASER}
              openLabel={t.reviews.openInIg}
              playLabel={t.reviews.play || t.laserFeaturedReview?.play || "Play"}
              caption={t.reviews.caption}
              cityLabel={IS_HOME ? reviewCity : undefined}
              onPlay={() =>
                trackEvent(IS_LASER ? "laser_video_play" : "review_play", {
                  language: lang,
                  video_id: review.id,
                  city: IS_HOME ? cityId : undefined,
                  button_location: "reviews_slider",
                  page_url: window.location.href,
                })
              }
            />
          ))}
          {IS_LASER && <div className="w-4 shrink-0" aria-hidden />}
        </div>

        <div className="mt-5 flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3">
          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent(IS_LASER ? "laser_instagram_click" : "instagram_click", {
                language: lang,
                button_location: "reviews_instagram",
                city: IS_HOME ? cityId : undefined,
                page_url: window.location.href,
              })
            }
            className="btn-primary min-h-11"
          >
            {t.reviews.allOnIg}
            <Icon name="instagram" className="h-4 w-4" />
          </a>
          <a
            href={gisUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent(IS_LASER ? "laser_reviews_2gis_click" : "map_open", {
                language: lang,
                button_location: "reviews_2gis",
                city: IS_HOME ? cityId : undefined,
                page_url: window.location.href,
              })
            }
            className="btn-outline min-h-11"
          >
            {t.reviews.allOnGis}
            <Icon name="arrow" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
