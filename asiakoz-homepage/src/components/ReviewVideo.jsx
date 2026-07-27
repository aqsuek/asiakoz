import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { assetUrl } from "../data/reviews";

/**
 * Lazy video with poster — does not load media until play.
 * Falls back to soft placeholder if poster fails.
 */
export default function ReviewVideo({
  src,
  poster,
  className = "",
  aspectClass = "aspect-[9/16]",
  maxHeightClass = "",
  playLabel = "Play",
  onPlay,
  compact = false,
}) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);

  const posterSrc = poster ? assetUrl(poster) : null;

  const start = () => {
    if (mediaFailed) return;
    const el = videoRef.current;
    if (!el) return;
    if (!el.src) {
      el.src = assetUrl(src);
      el.load();
    }
    el.play().catch(() => setMediaFailed(true));
    setPlaying(true);
    onPlay?.();
  };

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b from-brand-soft to-surface-muted ${aspectClass} ${maxHeightClass} ${className}`}
    >
      {posterSrc && !posterFailed && !playing && (
        <img
          src={posterSrc}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover ${compact ? "object-[center_20%]" : "object-cover"}`}
          loading="lazy"
          decoding="async"
          onError={() => setPosterFailed(true)}
        />
      )}

      {(!posterSrc || posterFailed) && !playing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-brand-soft via-white to-surface-muted px-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand">AsiaKoz</span>
          <span className="text-sm text-ink-muted">{playLabel}</span>
        </div>
      )}

      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover ${playing ? "opacity-100" : "opacity-0"}`}
        playsInline
        controls={playing}
        preload="none"
        controlsList="nodownload noplaybackrate"
        poster={posterSrc || undefined}
        onPlay={() => setPlaying(true)}
        onError={() => setMediaFailed(true)}
      />

      {mediaFailed && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-muted px-4 text-center text-sm text-ink-muted">
          Видео временно недоступно
        </div>
      )}

      {!playing && !mediaFailed && (
        <button
          type="button"
          onClick={start}
          className="absolute inset-0 z-10 flex items-center justify-center bg-ink/20"
          aria-label={playLabel}
        >
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand shadow-float sm:h-16 sm:w-16">
            <Play className="h-6 w-6 fill-current sm:h-7 sm:w-7" strokeWidth={0} aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
}
