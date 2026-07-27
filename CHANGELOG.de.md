# Änderungsprotokoll

[English](CHANGELOG.md) | [简体中文](CHANGELOG.zh-CN.md) | [繁體中文](CHANGELOG.zh-TW.md) | [Español](CHANGELOG.es.md) | [Français](CHANGELOG.fr.md) | [Deutsch](CHANGELOG.de.md)

Diese Datei dokumentiert alle wichtigen Änderungen des Projekts.

Das Format orientiert sich an den Prinzipien von Keep a Changelog.

## [1.0.2] - 2026-07-27

Patch-Release mit Fokus auf mehrsprachige UX und stabile Popup-Layouts.

### Added
- Mehrsprachige Laufzeitunterstützung für 6 Sprachen: English, 简体中文, 繁體中文, Español, Français und Deutsch.
- Manueller Sprachumschalter in der Popup-Kopfzeile mit flaggenbasierten Optionen.
- Traditionell-chinesisches Locale (`zh-TW`) hinzugefügt.

### Changed
- Kopfzeilenlayout des Popups optimiert: Sprachauswahl in dieselbe Zeile wie der Titel verschoben.
- Die Option für traditionelles Chinesisch verwendet jetzt die Hongkong-Flagge zur schnelleren visuellen Erkennung.
- Verbleibende chinesische UI-Texte und Richtungsbezeichnungen lokalisiert.

### Fixed
- "Springen" des Popups beim Sprachwechsel reduziert, indem Popup-Größe und internes Scrollverhalten stabilisiert wurden.

## [1.0.1] - 2026-07-27

Patch-Release mit Fokus auf Exportzuverlässigkeit und Packaging-Workflow.

### Fixed
- Verhindert, dass schwebende `fixed`- und `sticky`-Overlays den oberen Inhaltsbereich in exportierten PDFs überdecken.
- Temporäres Ausblenden und Wiederherstellen für potenzielle Overlay-Blocker während des Druckens ergänzt.

### Added
- Ein-Kommando-CRX-Packaging-Skript hinzugefügt.
- Fallback zur automatischen Browser-Erkennung unter macOS für CRX-Packaging hinzugefügt.

## [1.0.0] - 2026-07-22

Erste öffentliche Version.

### Added
- Initiale Chrome-Erweiterung (Manifest V3) zum Export des aktuellen Tabs als einseitiges PDF.
- Popup-UI für direkten Export und erweiterte Bereichssteuerung (`left`, `right`, `top`, `bottom`).
- Visueller Scroll-Auswahlmodus mit viewport-ausgerichteter grüner Hervorhebung.
- Sofortiger Export nach Klick auf Done im Auswahlmodus.
- Hintergrund-Exportpipeline mit Chrome DevTools Protocol (`Page.printToPDF`) sowie temporärer Zuschneide-/Wiederherstellungslogik.
- Option für Speichern-Dialog ("Ask file name before save").
- Vollständiges Icon-Set und Chrome Web Store Assets (Screenshots, Promo-Banner, Metadaten, Datenschutz-/Supportseiten).

### Changed
- Auswahlanpassung optimiert: Beim Hochscrollen wird `bottom` intuitiver verkleinert.
- Auswahl-Overlay auf den Inhalts-Viewport begrenzt, um visuelle Überlagerung mit Browser-UI zu vermeiden.
