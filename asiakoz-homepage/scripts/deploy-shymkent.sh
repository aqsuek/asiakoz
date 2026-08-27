#!/usr/bin/env bash
set -euo pipefail

APP="$(cd "$(dirname "$0")/.." && pwd)"
LIVE="$(cd "$APP/.." && pwd)"
TARGET="$LIVE/shymkent"
DOCTOR_IDS=(kadyr-kyrboga)

cd "$APP"
VITE_BASE=/shymkent/ VITE_BRANCH=shymkent npm run build

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
python3 - "$INDEX" <<'PY'
import re, sys
from pathlib import Path
p = Path(sys.argv[1])
t = p.read_text(encoding="utf-8")
t = re.sub(r'asiakoz-build" content="[^"]*"', 'asiakoz-build" content="2026-08-28-shymkent-v1"', t, count=1)
t = t.replace("https://asiakoz.com/", "https://asiakoz.com/shymkent/")
t = re.sub(
    r"<title>[^<]*</title>",
    "<title>AsiaKoz Шымкент — офтальмологиялық клиника</title>",
    t,
    count=1,
)
p.write_text(t, encoding="utf-8")
PY

echo "Deployed Shymkent landing -> $TARGET"
echo "URL: https://asiakoz.com/shymkent/"

python3 "$LIVE/scripts/build-seo.py"

for id in "${DOCTOR_IDS[@]}"; do
  mkdir -p "$TARGET/doctor/$id"
  cp "$TARGET/index.html" "$TARGET/doctor/$id/index.html"
done

python3 - <<PY
from pathlib import Path
import re
root = Path(r"""$LIVE""")
canon = {
  "kadyr-kyrboga": "https://asiakoz.com/doctor-kadyr-kyrboga/",
}
for doc_id, url in canon.items():
  ru = root / "shymkent" / "doctor" / doc_id / "index.html"
  if not ru.exists():
    continue
  for p in (ru, root / "kk" / "shymkent" / "doctor" / doc_id / "index.html"):
    if p != ru:
      p.parent.mkdir(parents=True, exist_ok=True)
      p.write_text(ru.read_text(encoding="utf-8"), encoding="utf-8")
    html = p.read_text(encoding="utf-8")
    if 'name="robots"' in html:
      html = re.sub(r'(name="robots" content=")[^"]*(")', r'\1noindex, follow\2', html, count=1, flags=re.I)
    else:
      html = html.replace("</title>", '</title>\n  <meta name="robots" content="noindex, follow" />', 1)
    html = re.sub(r'(rel="canonical" href=")[^"]*(")', rf'\1{url}\2', html, count=1, flags=re.I)
    p.write_text(html, encoding="utf-8")
print("shymkent doctor shells synced")
PY

echo "Doctor pages:"
for id in "${DOCTOR_IDS[@]}"; do
  echo "  https://asiakoz.com/shymkent/doctor/$id/"
done
