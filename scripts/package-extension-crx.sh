#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MANIFEST_PATH="$ROOT_DIR/manifest.json"

if ! command -v rsync >/dev/null 2>&1; then
  echo "Error: rsync command is required but not found." >&2
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

find_chrome_bin() {
  if [ -n "${CHROME_BIN:-}" ] && [ -x "${CHROME_BIN}" ]; then
    echo "${CHROME_BIN}"
    return 0
  fi

  local candidates=(
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary"
    "/Applications/Chromium.app/Contents/MacOS/Chromium"
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
  )

  local path
  for path in "${candidates[@]}"; do
    if [ -x "$path" ]; then
      echo "$path"
      return 0
    fi
  done

  return 1
}

CHROME_EXECUTABLE="$(find_chrome_bin || true)"
if [ -z "$CHROME_EXECUTABLE" ]; then
  echo "Error: Could not find a Chrome/Chromium executable." >&2
  echo "Set CHROME_BIN to an executable path, for example:" >&2
  echo "  CHROME_BIN='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' bash scripts/package-extension-crx.sh" >&2
  exit 1
fi

VERSION="$(node -e "const fs=require('fs'); const p=process.argv[1]; const m=JSON.parse(fs.readFileSync(p,'utf8')); process.stdout.write(m.version || '0.0.0');" "$MANIFEST_PATH")"
OUTPUT_DIR="${1:-$ROOT_DIR/dist}"
DEFAULT_KEY_PATH="$OUTPUT_DIR/single-page-pdf-exporter.pem"
KEY_PATH="${2:-$DEFAULT_KEY_PATH}"
CRX_NAME="single-page-pdf-exporter-v${VERSION}.crx"

mkdir -p "$OUTPUT_DIR"
OUTPUT_DIR="$(cd "$OUTPUT_DIR" && pwd)"
CRX_PATH="$OUTPUT_DIR/$CRX_NAME"

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
  --exclude '*.zip' \
  --exclude '*.crx' \
  --exclude '*.pem'

if [ ! -f "$STAGE_DIR/manifest.json" ]; then
  echo "Error: staged package does not contain manifest.json" >&2
  exit 1
fi

PACK_ARGS=("--pack-extension=$STAGE_DIR")
if [ -f "$KEY_PATH" ]; then
  PACK_ARGS+=("--pack-extension-key=$KEY_PATH")
fi

"$CHROME_EXECUTABLE" "${PACK_ARGS[@]}"

GENERATED_CRX="${STAGE_DIR}.crx"
GENERATED_PEM="${STAGE_DIR}.pem"

if [ ! -f "$GENERATED_CRX" ]; then
  echo "Error: Chrome did not generate a .crx file." >&2
  exit 1
fi

rm -f "$CRX_PATH"
mv "$GENERATED_CRX" "$CRX_PATH"

if [ -f "$GENERATED_PEM" ]; then
  mkdir -p "$(dirname "$KEY_PATH")"
  mv "$GENERATED_PEM" "$KEY_PATH"
fi

echo "CRX package created: $CRX_PATH"
if [ -f "$KEY_PATH" ]; then
  echo "Signing key: $KEY_PATH"
fi
