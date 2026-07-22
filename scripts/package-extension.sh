#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MANIFEST_PATH="$ROOT_DIR/manifest.json"

if ! command -v zip >/dev/null 2>&1; then
  echo "Error: zip command is required but not found." >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Error: node command is required but not found." >&2
  exit 1
fi

if [ ! -f "$MANIFEST_PATH" ]; then
  echo "Error: manifest.json was not found at $MANIFEST_PATH" >&2
  exit 1
fi

VERSION="$(node -e "const fs=require('fs'); const p=process.argv[1]; const m=JSON.parse(fs.readFileSync(p,'utf8')); process.stdout.write(m.version || '0.0.0');" "$MANIFEST_PATH")"
OUTPUT_DIR="${1:-$ROOT_DIR/dist}"
PACKAGE_NAME="single-page-pdf-exporter-v${VERSION}.zip"

mkdir -p "$OUTPUT_DIR"
PACKAGE_PATH="$(cd "$OUTPUT_DIR" && pwd)/$PACKAGE_NAME"
rm -f "$PACKAGE_PATH"

STAGE_DIR="$(mktemp -d)"
trap 'rm -rf "$STAGE_DIR"' EXIT

rsync -a "$ROOT_DIR/" "$STAGE_DIR/" \
  --exclude '.git/' \
  --exclude '.DS_Store' \
  --exclude '.gitignore' \
  --exclude 'dist/' \
  --exclude 'store-assets/' \
  --exclude 'scripts/' \
  --exclude 'README.md' \
  --exclude 'CHANGELOG.md' \
  --exclude 'LICENSE' \
  --exclude 'generate-icons.py' \
  --exclude 'icons/*.svg' \
  --exclude '*.zip'

if [ ! -f "$STAGE_DIR/manifest.json" ]; then
  echo "Error: staged package does not contain manifest.json" >&2
  exit 1
fi

(
  cd "$STAGE_DIR"
  zip -qr "$PACKAGE_PATH" .
)

echo "Package created: $PACKAGE_PATH"
