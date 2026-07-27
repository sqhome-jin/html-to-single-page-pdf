# Single Page PDF Exporter (Chrome Extension)

A Chrome extension that exports the current tab into a single-page PDF while preserving page layout and styles as much as possible.

## Folder

This extension is self-contained in this directory and can be packaged independently for Chrome Web Store publishing.

## Load Locally

1. Open Chrome and go to `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder.

## Usage

1. Open any web page.
2. Click the extension icon.
3. Click **Export Current Tab**.
4. Save the generated PDF.

Optional settings in popup:
- **Left/Right/Top/Bottom (px)**: precise region coordinates, auto-filled and editable.
- **Refresh Current Bounds**: manually refresh current full-page boundaries.
- **Start Scroll Range Selection**: enter visual selection mode with clear green highlight area (no blur glass layer).
- Clicking **Start Scroll Range Selection** closes popup automatically so you can see overlay clearly.
- After clicking **Done**, extension immediately runs **Export Current Tab** and shows the system save dialog for file name/location.
- In selection mode, scrolling up reduces `bottom` (instead of changing `top`), making range trimming more intuitive.
- Selection range is calculated from the web content viewport only (excluding browser chrome like menu/address bar).
- **Ask file name before save**: toggle save dialog.

## Notes

- The extension uses Chrome DevTools Protocol (`Page.printToPDF`) to produce high-fidelity PDF output.
- For local `file://` pages, enable **Allow access to file URLs** in extension details.
- Some highly dynamic pages (infinite scroll, lazy-loaded blocks) may require scrolling/loading content first.

## Files

- `manifest.json`: Extension manifest (MV3)
- `icons/icon16.png`, `icons/icon32.png`, `icons/icon48.png`, `icons/icon128.png`: colorful glass-style extension icons
- `popup.html`: Popup UI
- `popup.css`: Popup styles
- `popup.js`: Core export logic

## Metadata

- Author: `SQHOME-SUN`

## Store Assets

- Listing copy: `store-assets/chrome-web-store-listing.md`
- Listing copy (EN): `store-assets/chrome-web-store-listing.en-US.md`
- Listing copy (ZH-CN): `store-assets/chrome-web-store-listing.zh-CN.md`
- Metadata JSON: `store-assets/chrome-web-store-metadata.json`
- Submission checklist: `store-assets/chrome-web-store-submission-checklist.md`
- Privacy policy template: `store-assets/privacy-policy-template.md`
- Privacy policy page: `store-assets/privacy-policy.html`
- Privacy form answers (ZH-CN): `store-assets/chrome-web-store-privacy-form.zh-CN.md`
- Privacy form answers (EN-US): `store-assets/chrome-web-store-privacy-form.en-US.md`
- Support page: `store-assets/support.html`
- Screenshots: `store-assets/screenshot-1-region-selection.png`, `store-assets/screenshot-2-precise-bounds.png`, `store-assets/screenshot-3-save-dialog.png`, `store-assets/screenshot-4-feature-overview.png`
- Promo banner: `store-assets/promo-banner-1400x560.png`

## Publish To Chrome Web Store

### Build Upload ZIP

Run this command from the extension folder:

bash scripts/package-extension.sh

Optional: pass a custom output directory:

bash scripts/package-extension.sh ./release

The script creates a clean ZIP package and excludes local-only files such as store assets, docs, git metadata, and helper scripts.

### Build CRX Package

Run this command from the extension folder:

bash scripts/package-extension-crx.sh

Optional: pass custom output directory and signing key path:

bash scripts/package-extension-crx.sh ./dist ./dist/single-page-pdf-exporter.pem

Notes:
- This script auto-detects Chrome on macOS. If needed, set `CHROME_BIN` manually.
- First run generates a `.pem` key; keep it safe, because reusing this key keeps a stable extension ID.

1. Prepare store assets (icon, screenshots, description).
2. Zip this folder content (do not zip parent folder).
3. Go to Chrome Web Store Developer Dashboard.
4. Upload ZIP package.
5. Fill listing metadata and submit review.

### Recommended before publishing

- Verify permissions and description consistency in `manifest.json` and store listing text.
- Test export on common sites and local `file://` pages.
- Confirm save dialog and filename flow on macOS/Windows.
- Re-check screenshot/banner visuals and locale-specific listing content before submit.
