/** Real Instagram video reviews from @asiakoz.shymkent */
import { BRANCH } from "../lib/branch";

export const VIDEO_REVIEWS = [
  {
    id: "DYou5Ktoqkl",
    src: "videos/reviews/01-DYou5Ktoqkl.mp4",
    date: "2026-05-22",
    instagramUrl: "https://www.instagram.com/reel/DYou5Ktoqkl/",
  },
  {
    id: "DZUqNcboscU",
    src: "videos/reviews/02-DZUqNcboscU.mp4",
    date: "2026-06-08",
    instagramUrl: "https://www.instagram.com/reel/DZUqNcboscU/",
  },
  {
    id: "DZpfC4Qoh60",
    src: "videos/reviews/03-DZpfC4Qoh60.mp4",
    date: "2026-06-16",
    instagramUrl: "https://www.instagram.com/reel/DZpfC4Qoh60/",
  },
  {
    id: "DZsDMSRoamU",
    src: "videos/reviews/04-DZsDMSRoamU.mp4",
    date: "2026-06-17",
    instagramUrl: "https://www.instagram.com/reel/DZsDMSRoamU/",
  },
  {
    id: "DZuvG3lorl8",
    src: "videos/reviews/05-DZuvG3lorl8.mp4",
    date: "2026-06-18",
    instagramUrl: "https://www.instagram.com/reel/DZuvG3lorl8/",
  },
  {
    id: "DapNUyyoTSL",
    src: "videos/reviews/06-DapNUyyoTSL.mp4",
    date: "2026-07-11",
    instagramUrl: "https://www.instagram.com/reel/DapNUyyoTSL/",
  },
  {
    id: "DazzIhloOdX",
    src: "videos/reviews/07-DazzIhloOdX.mp4",
    date: "2026-07-15",
    instagramUrl: "https://www.instagram.com/reel/DazzIhloOdX/",
  },
  {
    id: "DbNsQssobuX",
    src: "videos/reviews/08-DbNsQssobuX.mp4",
    date: "2026-07-25",
    instagramUrl: "https://www.instagram.com/reel/DbNsQssobuX/",
  },
];

export const LASER_VIDEO_REVIEWS = Array.from({ length: 10 }, (_, i) => ({
  id: `laser-${i + 1}`,
  // Absolute paths — live site assets at /images/lazer-almaty/
  src: `/images/lazer-almaty/videos/video-${i + 1}.mp4`,
  poster: `/images/lazer-almaty/posters/video-${i + 1}.jpg`,
}));

export function getVideoReviews() {
  return BRANCH === "laser" || BRANCH === "almaty" ? LASER_VIDEO_REVIEWS : VIDEO_REVIEWS;
}

export function assetUrl(path) {
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${path.replace(/^\//, "")}`;
}
