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

INDEX="$TARGET/index.html"
bash "$(dirname "$0")/append-compliance.sh" "$INDEX"

echo "Deployed Aktau landing -> $TARGET"
echo "URL: https://asiakoz.com/aktau/"

# Keep technical SEO (canonical/noindex/sitemap) consistent after deploy
python3 "$LIVE/scripts/build-seo.py"

# Re-copy doctor shells from patched index so phones/schema match Aktau (not Shymkent template)
for id in "${DOCTOR_IDS[@]}"; do
  mkdir -p "$TARGET/doctor/$id"
  cp "$TARGET/index.html" "$TARGET/doctor/$id/index.html"
done
python3 - <<PY
from pathlib import Path
import re
root = Path("$LIVE")
canon = {
  "ali-keskin": "https://asiakoz.com/doctor-ali-keskin/",
  "erol-joshkun": "https://asiakoz.com/doctor-erol/",
  "nazgul-sagyndykova": "https://asiakoz.com/doctor-nazgul/",
}
for doc_id, url in canon.items():
  p = root / "aktau" / "doctor" / doc_id / "index.html"
  if not p.exists():
    continue
  html = p.read_text(encoding="utf-8")
  html = re.sub(r'(name="robots" content=")[^"]*(")', r'\1noindex, follow\2', html, count=1, flags=re.I)
  if 'name="robots"' not in html:
    html = html.replace("</title>", '</title>\n  <meta name="robots" content="noindex, follow" />', 1)
  html = re.sub(r'(rel="canonical" href=")[^"]*(")', rf'\1{url}\2', html, count=1, flags=re.I)
  p.write_text(html, encoding="utf-8")
  # KK mirror
  kp = root / "kk" / "aqtau" / "doctor" / doc_id / "index.html"
  if kp.exists():
    kp.write_text(html, encoding="utf-8")
print("aktau doctor shells synced")
PY
