#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
APP="$(cd "$(dirname "$0")/.." && pwd)"

cd "$APP"
npm run build

rm -rf "$ROOT/admin"
mkdir -p "$ROOT/admin"
cp -R "$APP/dist/"* "$ROOT/admin/"

echo "Deployed admin panel -> $ROOT/admin"
echo "URL: https://asiakoz.com/admin/"
