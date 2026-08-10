#!/usr/bin/env bash
set -euo pipefail

APP="$(cd "$(dirname "$0")/.." && pwd)"
# Live site root = parent of asiakoz-homepage (tomorrows-script)
LIVE="$(cd "$APP/.." && pwd)"
TARGET="$LIVE/shymkent"
# Coming soon: no assigned city doctors yet
DOCTOR_IDS=()

cd "$APP"
npm run build

rm -rf "$TARGET"
mkdir -p "$TARGET"
cp -R "$APP/dist/"* "$TARGET/"

# Public media (videos, doctor photos) if present
if [[ -d "$APP/public/videos" ]]; then
  mkdir -p "$TARGET/videos"
  cp -R "$APP/public/videos/"* "$TARGET/videos/"
fi
if [[ -d "$APP/public/images" ]]; then
  mkdir -p "$TARGET/images"
  cp -R "$APP/public/images/"* "$TARGET/images/"
fi

if [[ ! -f "$TARGET/index.html" ]]; then
  echo "ERROR: dist/index.html missing" >&2
  exit 1
fi

# SPA routes for doctor pages (GitHub Pages needs a real index.html per path)
if ((${#DOCTOR_IDS[@]})); then
  for id in "${DOCTOR_IDS[@]}"; do
    mkdir -p "$TARGET/doctor/$id"
    cp "$TARGET/index.html" "$TARGET/doctor/$id/index.html"
  done
fi

SITEMAP="$LIVE/sitemap.xml"
if [[ -f "$SITEMAP" ]] && ! grep -q 'asiakoz.com/shymkent/' "$SITEMAP"; then
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' 's|</urlset>|  <url>\
    <loc>https://asiakoz.com/shymkent/</loc>\
    <changefreq>weekly</changefreq>\
    <priority>0.95</priority>\
  </url>\
</urlset>|' "$SITEMAP"
  else
    sed -i 's|</urlset>|  <url>\n    <loc>https://asiakoz.com/shymkent/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.95</priority>\n  </url>\n</urlset>|' "$SITEMAP"
  fi
  echo "Added /shymkent/ to sitemap.xml"
fi

echo "Deployed Shymkent landing -> $TARGET"
echo "URL: https://asiakoz.com/shymkent/"
if ((${#DOCTOR_IDS[@]})); then
  echo "Doctor pages:"
  for id in "${DOCTOR_IDS[@]}"; do
    echo "  https://asiakoz.com/shymkent/doctor/$id/"
  done
else
  echo "Doctor pages: none yet"
fi

# Keep technical SEO (canonical/noindex/sitemap) consistent after deploy
python3 "$LIVE/scripts/build-seo.py"
