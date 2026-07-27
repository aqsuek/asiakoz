#!/usr/bin/env bash
set -euo pipefail

APP="$(cd "$(dirname "$0")/.." && pwd)"
LIVE="$(cd "$APP/.." && pwd)"
TARGET="$LIVE/almaty"
DOCTOR_IDS=(mehmet-esat-teker orel-talip aliya)

cd "$APP"
VITE_BASE=/almaty/ VITE_BRANCH=almaty npm run build

rm -rf "$TARGET"
mkdir -p "$TARGET"
cp -R "$APP/dist/"* "$TARGET/"

# Reviews for Almaty are absolute /images/lazer-almaty/ — no need to ship Shymkent mp4s
rm -rf "$TARGET/videos"

if [[ ! -f "$TARGET/index.html" ]]; then
  echo "ERROR: dist/index.html missing" >&2
  exit 1
fi

for id in "${DOCTOR_IDS[@]}"; do
  mkdir -p "$TARGET/doctor/$id"
  cp "$TARGET/index.html" "$TARGET/doctor/$id/index.html"
done

INDEX="$TARGET/index.html"
python3 - "$INDEX" <<'PY'
import re, sys
from pathlib import Path
p = Path(sys.argv[1])
t = p.read_text(encoding="utf-8")
t = re.sub(r'asiakoz-build" content="[^"]*"', 'asiakoz-build" content="2026-07-27-almaty-v4"', t, count=1)
t = t.replace("https://asiakoz.com/shymkent/", "https://asiakoz.com/almaty/")
t = re.sub(
    r"<title>[^<]*</title>",
    "<title>AsiaKoz Алматы — офтальмологиялық орталық</title>",
    t,
    count=1,
)
p.write_text(t, encoding="utf-8")
PY

SITEMAP="$LIVE/sitemap.xml"
if [[ -f "$SITEMAP" ]] && ! grep -q 'asiakoz.com/almaty/' "$SITEMAP"; then
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' 's|</urlset>|  <url>\
    <loc>https://asiakoz.com/almaty/</loc>\
    <changefreq>weekly</changefreq>\
    <priority>0.95</priority>\
  </url>\
</urlset>|' "$SITEMAP"
  else
    sed -i 's|</urlset>|  <url>\n    <loc>https://asiakoz.com/almaty/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.95</priority>\n  </url>\n</urlset>|' "$SITEMAP"
  fi
  echo "Added /almaty/ to sitemap.xml"
fi

echo "Deployed Almaty landing -> $TARGET"
echo "URL: https://asiakoz.com/almaty/"
echo "Doctor pages:"
for id in "${DOCTOR_IDS[@]}"; do
  echo "  https://asiakoz.com/almaty/doctor/$id/"
done
