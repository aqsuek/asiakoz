#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
APP="$(cd "$(dirname "$0")/.." && pwd)"

cd "$APP"
node scripts/inject-clinic-schema.cjs index.html
npm run build
node scripts/inject-clinic-schema.cjs dist/index.html

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

node "$APP/scripts/inject-clinic-schema.cjs" "$ROOT/index.html"

# Append compliance.js (footer legal, cookie banner)
if ! grep -q 'compliance.js' "$ROOT/index.html"; then
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' 's|</body>|  <script src="/js/compliance.js?v=6"></script>\n</body>|' "$ROOT/index.html"
  else
    sed -i 's|</body>|  <script src="/js/compliance.js?v=6"></script>\n</body>|' "$ROOT/index.html"
  fi
fi

echo "Deployed homepage to $ROOT"
echo "  index.html"
echo "  assets/home/*"
