#!/usr/bin/env bash
set -euo pipefail

APP="$(cd "$(dirname "$0")/.." && pwd)"
LIVE="$(cd "$APP/.." && pwd)"
TARGET="$LIVE/laser"
DOCTOR_IDS=(mehmet-esat-teker orel-talip)

cd "$APP"
VITE_BASE=/laser/ VITE_BRANCH=laser npm run build

rm -rf "$TARGET"
mkdir -p "$TARGET"
cp -R "$APP/dist/"* "$TARGET/"

# Landing does not need Shymkent review mp4s from public/
rm -rf "$TARGET/videos"

# Only images used by this landing (review videos already at /images/lazer-almaty/)
rm -rf "$TARGET/images"
mkdir -p "$TARGET/images/doctors"
cp "$APP/public/images/clinic-almaty-laser.png" "$TARGET/images/"
cp "$APP/public/images/logo-asiakoz.png" "$TARGET/images/"
cp "$APP/public/images/doctors/mehmet-esat-teker.png" "$TARGET/images/doctors/"
cp "$APP/public/images/doctors/orel-talip.png" "$TARGET/images/doctors/"

if [[ ! -f "$TARGET/index.html" ]]; then
  echo "ERROR: dist/index.html missing" >&2
  exit 1
fi

for id in "${DOCTOR_IDS[@]}"; do
  mkdir -p "$TARGET/doctor/$id"
  cp "$TARGET/index.html" "$TARGET/doctor/$id/index.html"
done

# SEO meta for /laser/
INDEX="$TARGET/index.html"
python3 - "$INDEX" <<'PY'
import re, sys
from pathlib import Path
p = Path(sys.argv[1])
t = p.read_text(encoding="utf-8")
t = re.sub(r'asiakoz-build" content="[^"]*"', 'asiakoz-build" content="2026-07-27-laser-cro-v1"', t, count=1)
t = t.replace("https://asiakoz.com/shymkent/", "https://asiakoz.com/laser/")
t = re.sub(
    r"<title>[^<]*</title>",
    "<title>Лазерная коррекция зрения в Алматы — AsiaKoz</title>",
    t,
    count=1,
)
t = re.sub(
    r'name="description" content="[^"]*"',
    'name="description" content="Лазерная коррекция зрения в Алматы у турецких офтальмохирургов. Полная диагностика, индивидуальный подбор метода и запись в AsiaKoz."',
    t,
    count=1,
)
t = re.sub(
    r'property="og:title" content="[^"]*"',
    'property="og:title" content="Лазерная коррекция зрения в Алматы — AsiaKoz"',
    t,
    count=1,
)
t = re.sub(
    r'property="og:url" content="[^"]*"',
    'property="og:url" content="https://asiakoz.com/laser/"',
    t,
    count=1,
)
p.write_text(t, encoding="utf-8")
PY

SITEMAP="$LIVE/sitemap.xml"
if [[ -f "$SITEMAP" ]] && ! grep -q 'asiakoz.com/laser/' "$SITEMAP"; then
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' 's|</urlset>|  <url>\
    <loc>https://asiakoz.com/laser/</loc>\
    <changefreq>weekly</changefreq>\
    <priority>0.95</priority>\
  </url>\
</urlset>|' "$SITEMAP"
  else
    sed -i 's|</urlset>|  <url>\n    <loc>https://asiakoz.com/laser/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.95</priority>\n  </url>\n</urlset>|' "$SITEMAP"
  fi
  echo "Added /laser/ to sitemap.xml"
fi

echo "Deployed Laser promo landing -> $TARGET"
echo "URL: https://asiakoz.com/laser/"
echo "Doctor pages:"
for id in "${DOCTOR_IDS[@]}"; do
  echo "  https://asiakoz.com/laser/doctor/$id/"
done
