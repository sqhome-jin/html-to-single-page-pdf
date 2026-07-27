# Single Page PDF Exporter (Chrome Extension)

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md)

A Chrome extension that exports the current tab as a single-page PDF while preserving layout and styles as much as possible.

## :sparkles: Features

- Single-page PDF export for the current tab.
- Precise region controls with `left` / `right` / `top` / `bottom`.
- Visual scroll-range selection mode with on-page overlay.
- Automatic hide-and-restore of floating blockers during export.
- Multilingual UI (6 languages) with manual language switch in popup.

Supported UI languages:

- 🇺🇸 English
- 🇨🇳 简体中文
- 🇭🇰 繁體中文
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch

## :rocket: Load Locally

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder.

## :clipboard: Usage

1. Open any web page.
2. Click the extension icon.
3. Adjust region if needed.
4. Click **Export Current Tab** and save the PDF.

Popup options:

- **Language**: defaults to browser language, supports manual switching.
- **Left/Right/Top/Bottom (px)**: exact export boundaries.
- **Refresh Current Bounds**: reload page boundary values.
- **Start Scroll Range Selection**: interactive visual selection on page.
- **Ask file name before save**: toggle save dialog behavior.

## :wrench: Build Packages

### Build ZIP (Chrome Web Store upload)

```bash
bash scripts/package-extension.sh
```

Optional output directory:

```bash
bash scripts/package-extension.sh ./release
```

### Build CRX

```bash
bash scripts/package-extension-crx.sh
```

Optional output directory and key path:

```bash
bash scripts/package-extension-crx.sh ./dist ./dist/single-page-pdf-exporter.pem
```

Notes:

- The CRX script auto-detects Chrome/Edge on macOS.
- First run creates a `.pem` key. Keep it safe to preserve extension identity.

## :lock: Privacy & Data

- Export happens locally in the browser.
- No remote PDF generation service is required.
- No analytics or tracking SDK is included.

See:

- `privacy-policy.html`
- `store-assets/privacy-policy-template.md`
- `store-assets/chrome-web-store-privacy-form.en-US.md`
- `store-assets/chrome-web-store-privacy-form.zh-CN.md`

## :file_folder: Key Files

- `manifest.json`: Extension manifest (MV3)
- `popup.html`: Popup structure
- `popup.css`: Popup styles
- `popup.js`: Popup logic, i18n, selection, export flow
- `background.js`: Background export pipeline (`Page.printToPDF`)
- `_locales/`: Translation dictionaries
- `scripts/package-extension.sh`: ZIP packaging script
- `scripts/package-extension-crx.sh`: CRX packaging script

## :package: Store Assets

- Listing copy: `store-assets/chrome-web-store-listing.md`
- Listing copy (EN): `store-assets/chrome-web-store-listing.en-US.md`
- Listing copy (ZH-CN): `store-assets/chrome-web-store-listing.zh-CN.md`
- Metadata JSON: `store-assets/chrome-web-store-metadata.json`
- Submission checklist: `store-assets/chrome-web-store-submission-checklist.md`
- Support page: `store-assets/support.html`
- Screenshots and banner: `store-assets/`

## :memo: Release Notes

- [CHANGELOG.md](CHANGELOG.md)
- [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)
- [CHANGELOG.zh-TW.md](CHANGELOG.zh-TW.md)
- [CHANGELOG.es.md](CHANGELOG.es.md)
- [CHANGELOG.fr.md](CHANGELOG.fr.md)
- [CHANGELOG.de.md](CHANGELOG.de.md)

## :bust_in_silhouette: Metadata

- Author: `SQHOME-SUN`
