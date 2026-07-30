#!/usr/bin/env bash
set -euo pipefail

APP="$(cd "$(dirname "$0")/.." && pwd)"
LIVE="$(cd "$APP/.." && pwd)"
TARGET="$LIVE/aktau"
DOCTOR_IDS=(ali-keskin erol-joshkun nazgul-sagyndykova)

cd "$APP"
VITE_BASE=/aktau/ VITE_BRANCH=aqtau npm run build

rm -rf "$TARGET"
mkdir -p "$TARGET"
cp -R "$APP/dist/"* "$TARGET/"

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

for id in "${DOCTOR_IDS[@]}"; do
  mkdir -p "$TARGET/doctor/$id"
  cp "$TARGET/index.html" "$TARGET/doctor/$id/index.html"
done

echo "Deployed Aktau landing -> $TARGET"
echo "URL: https://asiakoz.com/aktau/"

# Keep technical SEO (canonical/noindex/sitemap) consistent after deploy
python3 "$LIVE/scripts/build-seo.py"
