# Single Page PDF Exporter (Chrome-Erweiterung)

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md)

Eine Chrome-Erweiterung, die den aktuellen Tab als einseitiges PDF exportiert und Layout sowie Stil bestmöglich beibehält.

## :sparkles: Funktionen

- Einseitiger PDF-Export für den aktuellen Tab.
- Präzise Bereichssteuerung mit `left` / `right` / `top` / `bottom`.
- Visuelle Scroll-Auswahl direkt auf der Seite.
- Temporäres Ausblenden von schwebenden Blocker-Overlays während des Exports.
- Mehrsprachige Oberfläche (6 Sprachen) mit manuellem Sprachwechsel im Popup.

Unterstützte Sprachen:

- 🇺🇸 English
- 🇨🇳 简体中文
- 🇭🇰 繁體中文
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch

## :rocket: Lokal laden

1. Chrome öffnen und `chrome://extensions` aufrufen.
2. **Developer mode** aktivieren.
3. Auf **Load unpacked** klicken.
4. Dieses Verzeichnis auswählen.

## :clipboard: Verwendung

1. Beliebige Webseite öffnen.
2. Auf das Erweiterungssymbol klicken.
3. Bei Bedarf Exportbereich anpassen.
4. Auf **Export Current Tab** klicken und PDF speichern.

Popup-Optionen:

- **Language**: Standard ist Browsersprache, manuelle Umschaltung möglich.
- **Left/Right/Top/Bottom (px)**: exakte Exportgrenzen.
- **Refresh Current Bounds**: ermittelte Grenzen aktualisieren.
- **Start Scroll Range Selection**: interaktive visuelle Bereichsauswahl.
- **Ask file name before save**: Speicherdialog ein-/ausschalten.

## :wrench: Paketerstellung

### ZIP erstellen (für Chrome Web Store Upload)

```bash
bash scripts/package-extension.sh
```

Optionales Ausgabeverzeichnis:

```bash
bash scripts/package-extension.sh ./release
```

### CRX erstellen

```bash
bash scripts/package-extension-crx.sh
```

Optionales Ausgabeverzeichnis und Schlüsselpfad:

```bash
bash scripts/package-extension-crx.sh ./dist ./dist/single-page-pdf-exporter.pem
```

Hinweise:

- Das CRX-Skript erkennt Chrome/Edge auf macOS automatisch.
- Beim ersten Lauf wird ein `.pem`-Schlüssel erzeugt. Sicher aufbewahren, um die Erweiterungs-ID stabil zu halten.

## :lock: Datenschutz und Daten

- Verarbeitung erfolgt lokal im Browser.
- Kein externer PDF-Dienst erforderlich.
- Kein Analytics- oder Tracking-SDK enthalten.

Siehe:

- `privacy-policy.html`
- `store-assets/privacy-policy-template.md`
- `store-assets/chrome-web-store-privacy-form.en-US.md`
- `store-assets/chrome-web-store-privacy-form.zh-CN.md`

## :file_folder: Wichtige Dateien

- `manifest.json`: Erweiterungsmanifest (MV3)
- `popup.html`: Popup-Struktur
- `popup.css`: Popup-Stile
- `popup.js`: Popup-Logik, i18n, Auswahl und Export
- `background.js`: Hintergrund-Exportpipeline (`Page.printToPDF`)
- `_locales/`: Übersetzungsdateien
- `scripts/package-extension.sh`: ZIP-Skript
- `scripts/package-extension-crx.sh`: CRX-Skript

## :package: Store-Assets

- Haupttext: `store-assets/chrome-web-store-listing.md`
- EN-Text: `store-assets/chrome-web-store-listing.en-US.md`
- ZH-CN-Text: `store-assets/chrome-web-store-listing.zh-CN.md`
- Metadaten: `store-assets/chrome-web-store-metadata.json`
- Checkliste: `store-assets/chrome-web-store-submission-checklist.md`
- Support: `store-assets/support.html`
- Screenshots und Banner: `store-assets/`

## :memo: Changelog

- [CHANGELOG.md](CHANGELOG.md)
- [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)
- [CHANGELOG.zh-TW.md](CHANGELOG.zh-TW.md)
- [CHANGELOG.es.md](CHANGELOG.es.md)
- [CHANGELOG.fr.md](CHANGELOG.fr.md)
- [CHANGELOG.de.md](CHANGELOG.de.md)

## :bust_in_silhouette: Metadaten

- Author: `SQHOME-SUN`
