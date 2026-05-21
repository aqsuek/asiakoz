import { useRef } from "react";
import useEyeTracking from "../hooks/useEyeTracking";

const MAX_PUPIL = 11;

function Eye({ offset, side, className = "" }) {
  const pupilX = offset.x * MAX_PUPIL;
  const pupilY = offset.y * MAX_PUPIL * 0.85;

  return (
    <svg
      viewBox="0 0 120 120"
      className={`eye-breathe ${className}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={`iris-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5ed4e8" />
          <stop offset="100%" stopColor="#12B7D5" />
        </linearGradient>
        <filter id={`glow-${side}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="60" cy="60" rx="52" ry="36" fill="white" opacity="0.95" />
      <ellipse
        cx="60"
        cy="60"
        rx="52"
        ry="36"
        fill="none"
        stroke="#12B7D5"
        strokeWidth="2"
        opacity="0.35"
      />
      <circle cx="60" cy="60" r="22" fill={`url(#iris-${side})`} filter={`url(#glow-${side})`} />
      <circle cx="60" cy="60" r="16" fill="#0e9bb5" opacity="0.25" />
      <g transform={`translate(${pupilX} ${pupilY})`}>
        <circle cx="60" cy="60" r="9" fill="#1a2b3c" />
        <circle cx="63" cy="57" r="3" fill="white" opacity="0.9" />
      </g>
      <path
        d="M12 58 Q60 18 108 58"
        fill="none"
        stroke="#12B7D5"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export default function EyeHeroAnimation() {
  const wrapRef = useRef(null);
  const offset = useEyeTracking(wrapRef, true);

  return (
    <div
      ref={wrapRef}
      className="eye-hero-wrap pointer-events-none absolute -right-4 top-8 z-0 hidden -translate-y-0 md:block md:top-1/2 md:-translate-y-1/2 lg:-right-8 xl:-right-4"
      aria-hidden
    >
      <div className="relative h-[280px] w-[320px] xl:h-[340px] xl:w-[380px]">
        <div className="absolute inset-0 rounded-full bg-brand/10 blur-3xl eye-glow-pulse" />
        <div className="absolute left-2 top-8 flex gap-3 xl:gap-5">
          <Eye offset={offset} side="l" className="h-[100px] w-[100px] xl:h-[120px] xl:w-[120px]" />
          <Eye offset={offset} side="r" className="h-[100px] w-[100px] xl:h-[120px] xl:w-[120px]" />
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/70 px-4 py-1.5 text-center text-[10px] font-semibold uppercase tracking-widest text-brand/80 backdrop-blur-sm">
          Смотрим на ваше зрение
        </div>
      </div>
    </div>
  );
}
