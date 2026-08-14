#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
APP="$(cd "$(dirname "$0")/.." && pwd)"

cd "$APP"

# Build without embedding token in JS bundle
export VITE_GITHUB_TOKEN=""
npm run build

rm -rf "$ROOT/admin"
mkdir -p "$ROOT/admin"
cp -R "$APP/dist/"* "$ROOT/admin/"

python3 "$APP/scripts/upload-admin-config.py" "$ROOT/admin/config.json"

echo "Deployed admin panel -> $ROOT/admin"
echo "URL: https://asiakoz.com/admin/"
