# Changelog

All notable changes to this project will be documented in this file.

## [1.0.1] - 2026-07-27

### Fixed
- Prevented floating `fixed/sticky` overlays from covering upper content in exported PDFs by temporarily hiding likely blockers during print and restoring them afterward.

### Added
- Added one-command CRX packaging script with macOS browser auto-detection fallback.

## [1.0.0] - 2026-07-22

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

### Notes
- This is the first public release baseline for publishing and versioned distribution.
