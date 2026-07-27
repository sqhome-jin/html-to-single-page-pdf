# Changelog

[English](CHANGELOG.md) | [简体中文](CHANGELOG.zh-CN.md) | [繁體中文](CHANGELOG.zh-TW.md) | [Español](CHANGELOG.es.md) | [Français](CHANGELOG.fr.md) | [Deutsch](CHANGELOG.de.md)

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog principles.

## [1.0.2] - 2026-07-27

Patch release focused on multilingual UX and popup layout stability.

### Added
- Added multilingual runtime support for 6 languages: English, Simplified Chinese, Traditional Chinese, Spanish, French, and German.
- Added manual language switch in the popup header with flag-labeled options.
- Added Traditional Chinese locale (`zh-TW`) with dedicated translations.

### Changed
- Optimized popup header layout by moving the language selector to the same row as the title.
- Updated Traditional Chinese option to use the Hong Kong flag for quick visual identification.
- Localized remaining Chinese UI text fragments and direction labels.

### Fixed
- Reduced popup "jump" effect when switching languages by stabilizing popup dimensions and internal scrolling behavior.

## [1.0.1] - 2026-07-27

Patch release focused on export reliability and packaging workflow.

### Fixed
- Prevented floating `fixed` and `sticky` overlays from covering top content in exported PDFs.
- Added temporary hide-and-restore handling for likely overlay blockers during print.

### Added
- Added one-command CRX packaging script.
- Added macOS browser auto-detection fallback for CRX packaging.

## [1.0.0] - 2026-07-22

Initial public release.

### Added
- Initial Chrome Extension (Manifest V3) for exporting the current tab as a single-page PDF.
- Popup UI for direct export and advanced region controls (`left`, `right`, `top`, `bottom`).
- Visual scroll range selection mode with viewport-aligned overlay and green highlight border.
- Immediate export flow after clicking Done in selection mode.
- Background worker export pipeline using Chrome DevTools Protocol (`Page.printToPDF`) with temporary crop-and-restore logic.
- Optional save dialog toggle via "Ask file name before save".
- Complete icon set and Chrome Web Store listing assets (screenshots, promo banner, metadata, privacy/support pages).

### Changed
- Selection adjustment behavior optimized so upward scrolling trims from `bottom` for a more intuitive workflow.
- Selection overlay constrained to content viewport to avoid browser UI overlap perception.
