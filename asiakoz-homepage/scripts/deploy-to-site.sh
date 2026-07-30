#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
APP="$(cd "$(dirname "$0")/.." && pwd)"

cd "$APP"
# Corporate homepage at site root — Shymkent/Aktau visual system
VITE_BASE=/ VITE_BRANCH=home npm run build

# Backup previous homepage once
if [[ -f "$ROOT/index.html" && ! -f "$ROOT/index.legacy.html" ]]; then
  cp "$ROOT/index.html" "$ROOT/index.legacy.html"
  echo "Backed up index.html -> index.legacy.html"
fi

# Deploy build output
cp "$APP/dist/index.html" "$ROOT/index.html"
mkdir -p "$ROOT/assets"
rm -rf "$ROOT/assets/home"
mkdir -p "$ROOT/assets/home"
cp -R "$APP/dist/assets/"* "$ROOT/assets/home/"

# Patch asset paths in index.html (vite uses /assets/ — isolate to /assets/home/)
if [[ "$(uname)" == "Darwin" ]]; then
  sed -i '' 's|/assets/|/assets/home/|g' "$ROOT/index.html"
else
  sed -i 's|/assets/|/assets/home/|g' "$ROOT/index.html"
fi

# Public media for hero / doctors / reviews
if [[ -d "$APP/public/images" ]]; then
  mkdir -p "$ROOT/images"
  cp -R "$APP/public/images/"* "$ROOT/images/" 2>/dev/null || true
fi
if [[ -d "$APP/public/videos" ]]; then
  mkdir -p "$ROOT/videos"
  cp -R "$APP/public/videos/"* "$ROOT/videos/" 2>/dev/null || true
fi

# SEO meta for corporate homepage (source index.html is Shymkent-default)
python3 - "$ROOT/index.html" <<'PY'
from pathlib import Path
import sys
import re

p = Path(sys.argv[1])
t = p.read_text(encoding="utf-8")

title = "AsiaKoz — офтальмологические клиники · Алматы, Актау"
desc = (
    "AsiaKoz — глазные клиники с турецкими офтальмохирургами. "
    "Работаем в Алматы и Актау. Шымкент — открытие скоро. "
    "Запись: WhatsApp +7 700 360 01 80."
)
desc_kz = (
    "AsiaKoz — түрік офтальмохирургтері бар көз клиникалары. "
    "Алматы мен Ақтауда жұмыс істейміз. Шымкентте жақында ашыламыз. "
    "Жазылу: WhatsApp +7 700 360 01 80."
)
url = "https://asiakoz.com/"

t = t.replace("https://asiakoz.com/shymkent/", url)
t = re.sub(r"<title>[^<]*</title>", f"<title>{title}</title>", t, count=1)
t = re.sub(
    r'(<meta\s+name="description"\s+content=")[^"]*(")',
    rf'\1{desc}\2',
    t,
    count=1,
    flags=re.DOTALL,
)
# multiline description block
t = re.sub(
    r'(name="description"\s*\n\s*content=")[^"]*(")',
    rf'\1{desc}\2',
    t,
    count=1,
)
t = re.sub(
    r'(property="og:title" content=")[^"]*(")',
    rf'\1{title}\2',
    t,
    count=1,
)
t = re.sub(
    r'(property="og:description"\s*\n\s*content=")[^"]*(")',
    rf'\1{desc_kz}\2',
    t,
    count=1,
)
t = re.sub(
    r'(property="og:url" content=")[^"]*(")',
    rf'\1{url}\2',
    t,
    count=1,
)
t = re.sub(
    r'(name="twitter:title" content=")[^"]*(")',
    rf'\1{title}\2',
    t,
    count=1,
)
t = re.sub(
    r'(name="twitter:description"\s*\n\s*content=")[^"]*(")',
    rf'\1{desc}\2',
    t,
    count=1,
)
t = re.sub(
    r'(name="theme-color" content=")[^"]*(")',
    r'\1#00A9C1\2',
    t,
    count=1,
)
t = re.sub(
    r'(name="asiakoz-build" content=")[^"]*(")',
    r'\1home-corporate-v1\2',
    t,
    count=1,
)

# Replace JSON-LD MedicalClinic block with Organization / network
ld = '''{
        "@context": "https://schema.org",
        "@type": "MedicalOrganization",
        "name": "AsiaKoz",
        "alternateName": ["Азиякөз", "Asiakoz", "Азиякоз"],
        "description": "Офтальмологические клиники AsiaKoz в Алматы и Актау. Шымкент — открытие скоро.",
        "url": "https://asiakoz.com/",
        "logo": "https://asiakoz.com/images/logo.png",
        "image": "https://asiakoz.com/images/logo.png",
        "telephone": ["+77003600180", "+77758630180"],
        "medicalSpecialty": "Ophthalmology",
        "sameAs": [
          "https://www.instagram.com/asiakoz.clinic/"
        ],
        "areaServed": [
          {"@type": "City", "name": "Алматы"},
          {"@type": "City", "name": "Актау"}
        ]
      }'''
t = re.sub(
    r'<script type="application/ld\+json">\s*\{.*?\}\s*</script>',
    f'<script type="application/ld+json">\n      {ld}\n    </script>',
    t,
    count=1,
    flags=re.DOTALL,
)

p.write_text(t, encoding="utf-8")
print("Patched SEO for corporate homepage")
PY

# Append compliance.js if missing
if ! grep -q 'compliance.js' "$ROOT/index.html"; then
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' 's|</body>|  <script src="/js/compliance.js?v=7"></script>\n</body>|' "$ROOT/index.html"
  else
    sed -i 's|</body>|  <script src="/js/compliance.js?v=7"></script>\n</body>|' "$ROOT/index.html"
  fi
fi

echo "Deployed corporate homepage -> $ROOT"
echo "URL: https://asiakoz.com/"

# Keep technical SEO (canonical/noindex/sitemap) consistent after deploy
python3 "$ROOT/scripts/build-seo.py"
