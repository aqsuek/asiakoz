import { useRef, useState } from "react";
import Icon from "../Icon";
import { useLang } from "../../i18n/LanguageContext";
import { getVideoReviews, assetUrl } from "../../data/reviews";
import { trackEvent } from "../../lib/analytics";
import { homeUrl } from "../../lib/routes";

export default function FeaturedReview({ skipFirst = false }) {
  const { lang, t } = useLang();
  const videos = getVideoReviews();
  const review = skipFirst ? videos[0] : videos[0];
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  if (!review) return null;

  const onPlay = () => {
    const el = videoRef.current;
    if (!el) return;
    el.play();
    setPlaying(true);
    trackEvent("laser_video_play", {
      language: lang,
      video_id: review.id,
      button_location: "featured_review",
    });
  };

  return (
    <section id="featured-review" className="scroll-mt-24 py-8 sm:py-10">
      <div className="section-container">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="section-title text-[1.55rem] sm:text-3xl">
            {t.laserFeaturedReview?.title}
          </h2>
          <p className="mt-2 text-sm text-ink-muted sm:text-base">
            {t.laserFeaturedReview?.subtitle}
          </p>
        </div>

        <div className="relative mx-auto mt-6 max-w-[280px] overflow-hidden rounded-[1.5rem] border border-ink/[0.06] bg-black shadow-card sm:max-w-[320px]">
          <div className="relative aspect-[9/16]">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={assetUrl(review.src)}
              playsInline
              controls={playing}
              preload="none"
              controlsList="nodownload noplaybackrate"
              onPlay={() => setPlaying(true)}
            />
            {!playing && (
              <button
                type="button"
                onClick={onPlay}
                className="absolute inset-0 flex items-center justify-center bg-ink/25"
                aria-label={t.laserFeaturedReview?.play || "Play"}
              >
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand shadow-float">
                  <Icon name="arrow" className="h-7 w-7" />
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 text-center">
          <a href={homeUrl("#booking")} className="btn-primary min-h-12">
            {t.laserFeaturedReview?.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
