import ReviewVideo from "../ReviewVideo";
import { useLang } from "../../i18n/LanguageContext";
import { getVideoReviews } from "../../data/reviews";
import { trackEvent } from "../../lib/analytics";
import { homeUrl } from "../../lib/routes";

export default function FeaturedReview() {
  const { lang, t } = useLang();
  const review = getVideoReviews()[0];

  if (!review) return null;

  return (
    <section id="featured-review" className="scroll-mt-24 scroll-mb-28 py-6 sm:py-8">
      <div className="section-container">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="section-title text-[1.4rem] sm:text-3xl">
            {t.laserFeaturedReview?.title}
          </h2>
          <p className="mt-2 text-sm text-ink-muted sm:text-base">
            {t.laserFeaturedReview?.subtitle}
          </p>
        </div>

        <div className="relative mx-auto mt-5 max-w-[260px] overflow-hidden rounded-[1.35rem] border border-ink/[0.06] bg-white shadow-card sm:max-w-[300px]">
          <ReviewVideo
            src={review.src}
            poster={review.poster}
            aspectClass="aspect-[9/16]"
            maxHeightClass="max-h-[520px] sm:max-h-[560px]"
            playLabel={t.laserFeaturedReview?.play || "Play"}
            compact
            onPlay={() =>
              trackEvent("laser_video_play", {
                language: lang,
                video_id: review.id,
                button_location: "featured_review",
              })
            }
          />
        </div>

        <div className="mt-4 pb-1 text-center">
          <a href={homeUrl("#booking")} className="btn-primary min-h-12">
            {t.laserFeaturedReview?.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
