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
if [[ -f "$APP/public/data/posts.json" ]]; then
  mkdir -p "$ROOT/data"
  cp "$APP/public/data/posts.json" "$ROOT/data/posts.json"
fi

# SPA shells for /news/ and article slugs (corporate homepage)
mkdir -p "$ROOT/news"
cp "$ROOT/index.html" "$ROOT/news/index.html"
mkdir -p "$ROOT/kk/news"
cp "$ROOT/index.html" "$ROOT/kk/news/index.html"
if command -v python3 >/dev/null 2>&1; then
  python3 - "$ROOT/data/posts.json" "$ROOT/index.html" <<'PY'
import json
import sys
from pathlib import Path

posts_file = Path(sys.argv[1])
shell = Path(sys.argv[2]).read_text(encoding="utf-8")
root = shell_path = Path(sys.argv[2]).parent
posts = []
if posts_file.exists():
    posts = json.loads(posts_file.read_text(encoding="utf-8"))
for post in posts:
    slug = post.get("slug")
    if not slug:
        continue
    for rel in (f"news/{slug}", f"kk/news/{slug}"):
        dest_dir = root / rel
        dest_dir.mkdir(parents=True, exist_ok=True)
        (dest_dir / "index.html").write_text(shell, encoding="utf-8")
print(f"News SPA shells: {len(posts)} posts")
PY
fi

# SEO meta for corporate homepage (source index.html is Shymkent-default)
python3 - "$ROOT/index.html" <<'PY'
from pathlib import Path
import sys
import re

p = Path(sys.argv[1])
t = p.read_text(encoding="utf-8")

title = "AsiaKoz — офтальмологические клиники · Алматы, Актау, Шымкент"
desc = (
    "AsiaKoz — глазные клиники с турецкими офтальмохирургами. "
    "Работаем в Алматы, Актау и Шымкенте. "
    "Запись: WhatsApp +7 700 360 01 80."
)
desc_kz = (
    "AsiaKoz — түрік офтальмохирургтері бар көз клиникалары. "
    "Алматы, Ақтау және Шымкентте жұмыс істейміз. "
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
        "description": "Офтальмологические клиники AsiaKoz в Алматы, Актау и Шымкенте.",
        "url": "https://asiakoz.com/",
        "logo": "https://asiakoz.com/images/logo.png",
        "image": "https://asiakoz.com/images/logo.png",
        "telephone": ["+77008880180", "+77003600180", "+77758630180", "+77080750180"],
        "medicalSpecialty": "Ophthalmology",
        "sameAs": [
          "https://www.instagram.com/asiakoz.clinic/"
        ],
        "areaServed": [
          {"@type": "City", "name": "Алматы"},
          {"@type": "City", "name": "Актау"},
          {"@type": "City", "name": "Шымкент"}
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

# Recopy news SPA shells after homepage SEO so /news/ still loads the same app
if [[ -f "$ROOT/index.html" ]]; then
  mkdir -p "$ROOT/news" "$ROOT/kk/news"
  cp "$ROOT/index.html" "$ROOT/news/index.html"
  cp "$ROOT/index.html" "$ROOT/kk/news/index.html"
  if [[ -f "$ROOT/data/posts.json" ]]; then
    python3 - "$ROOT/data/posts.json" "$ROOT/index.html" <<'PY'
import json
import sys
from pathlib import Path

posts_file = Path(sys.argv[1])
shell = Path(sys.argv[2]).read_text(encoding="utf-8")
root = Path(sys.argv[2]).parent
posts = json.loads(posts_file.read_text(encoding="utf-8")) if posts_file.exists() else []
for post in posts:
    slug = post.get("slug")
    if not slug:
        continue
    for rel in (f"news/{slug}", f"kk/news/{slug}"):
        dest_dir = root / rel
        dest_dir.mkdir(parents=True, exist_ok=True)
        (dest_dir / "index.html").write_text(shell, encoding="utf-8")
print(f"News SPA shells refreshed: {len(posts)} posts")
PY
  fi
fi
