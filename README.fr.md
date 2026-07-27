# Single Page PDF Exporter (Extension Chrome)

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md)

Une extension Chrome qui exporte l'onglet actif en PDF sur une seule page, en conservant au mieux la mise en page et les styles.

## ✨ Fonctionnalités

- Export PDF en une seule page pour l'onglet actif.
- Contrôle précis de zone avec `left` / `right` / `top` / `bottom`.
- Sélection visuelle par défilement directement dans la page.
- Masquage temporaire des couches flottantes bloquantes pendant l'export.
- Interface multilingue (6 langues) avec changement manuel dans le popup.

Langues prises en charge:

- 🇺🇸 English
- 🇨🇳 简体中文
- 🇭🇰 繁體中文
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch

## 🚀 Chargement local

1. Ouvrez Chrome et allez sur `chrome://extensions`.
2. Activez le **Developer mode**.
3. Cliquez sur **Load unpacked**.
4. Sélectionnez ce dossier.

## 📋 Utilisation

1. Ouvrez une page web.
2. Cliquez sur l'icône de l'extension.
3. Ajustez la zone si nécessaire.
4. Cliquez sur **Export Current Tab** puis enregistrez le PDF.

Options du popup:

- **Language** : suit la langue du navigateur par défaut, avec changement manuel.
- **Left/Right/Top/Bottom (px)** : limites exactes d'export.
- **Refresh Current Bounds** : recharge les limites détectées.
- **Start Scroll Range Selection** : sélection visuelle interactive.
- **Ask file name before save** : active/désactive la boîte d'enregistrement.

## 🔧 Packaging

### Générer un ZIP (upload Chrome Web Store)

```bash
bash scripts/package-extension.sh
```

Dossier de sortie optionnel:

```bash
bash scripts/package-extension.sh ./release
```

### Générer un CRX

```bash
bash scripts/package-extension-crx.sh
```

Dossier et clé optionnels:

```bash
bash scripts/package-extension-crx.sh ./dist ./dist/single-page-pdf-exporter.pem
```

Notes:

- Le script CRX détecte automatiquement Chrome/Edge sur macOS.
- La première exécution génère une clé `.pem`. Conservez-la pour garder la même identité d'extension.

## 🔒 Confidentialité et données

- Le traitement se fait localement dans le navigateur.
- Aucun service PDF distant n'est requis.
- Aucun SDK d'analyse ou de tracking n'est inclus.

Voir:

- `privacy-policy.html`
- `store-assets/privacy-policy-template.md`
- `store-assets/chrome-web-store-privacy-form.en-US.md`
- `store-assets/chrome-web-store-privacy-form.zh-CN.md`

## 📁 Fichiers clés

- `manifest.json` : manifeste de l'extension (MV3)
- `popup.html` : structure du popup
- `popup.css` : styles du popup
- `popup.js` : logique du popup, i18n, sélection et export
- `background.js` : flux d'export en arrière-plan (`Page.printToPDF`)
- `_locales/` : dictionnaires de traduction
- `scripts/package-extension.sh` : script ZIP
- `scripts/package-extension-crx.sh` : script CRX

## 📦 Ressources Store

- Texte principal : `store-assets/chrome-web-store-listing.md`
- Texte EN : `store-assets/chrome-web-store-listing.en-US.md`
- Texte ZH-CN : `store-assets/chrome-web-store-listing.zh-CN.md`
- Métadonnées : `store-assets/chrome-web-store-metadata.json`
- Checklist : `store-assets/chrome-web-store-submission-checklist.md`
- Support : `store-assets/support.html`
- Captures et bannière : `store-assets/`

## 📝 Changelog

- [CHANGELOG.md](CHANGELOG.md)
- [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)
- [CHANGELOG.zh-TW.md](CHANGELOG.zh-TW.md)
- [CHANGELOG.es.md](CHANGELOG.es.md)
- [CHANGELOG.fr.md](CHANGELOG.fr.md)
- [CHANGELOG.de.md](CHANGELOG.de.md)

## 👤 Métadonnées

- Author: `SQHOME-SUN`
