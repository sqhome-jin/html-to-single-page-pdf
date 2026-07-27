# Journal des modifications

[English](CHANGELOG.md) | [简体中文](CHANGELOG.zh-CN.md) | [繁體中文](CHANGELOG.zh-TW.md) | [Español](CHANGELOG.es.md) | [Français](CHANGELOG.fr.md) | [Deutsch](CHANGELOG.de.md)

Ce fichier documente toutes les évolutions importantes du projet.

Le format suit les principes de Keep a Changelog.

## [1.0.2] - 2026-07-27

Version corrective axée sur l'expérience multilingue et la stabilité de la mise en page du popup.

### Added
- Prise en charge multilingue à l'exécution pour 6 langues : English, 简体中文, 繁體中文, Español, Français et Deutsch.
- Ajout d'un sélecteur manuel de langue dans l'en-tête du popup avec options identifiées par drapeaux.
- Ajout de la locale chinois traditionnel (`zh-TW`).

### Changed
- Optimisation de la mise en page de l'en-tête du popup en plaçant le sélecteur de langue sur la même ligne que le titre.
- L'option chinois traditionnel utilise désormais le drapeau de Hong Kong pour une identification visuelle rapide.
- Localisation des derniers fragments de texte chinois et des libellés de direction.

### Fixed
- Réduction de l'effet de "saut" du popup lors du changement de langue en stabilisant les dimensions du popup et le défilement interne.

## [1.0.1] - 2026-07-27

Version corrective axée sur la fiabilité de l'export et le flux de packaging.

### Fixed
- Empêchement des superpositions flottantes `fixed` et `sticky` de masquer la partie haute du contenu dans les PDF exportés.
- Ajout d'un mécanisme temporaire de masquage/restauration pour les couches susceptibles de bloquer l'impression.

### Added
- Ajout d'un script de packaging CRX en une commande.
- Ajout d'un repli de détection automatique du navigateur sur macOS pour le packaging CRX.

## [1.0.0] - 2026-07-22

Première version publique.

### Added
- Extension Chrome initiale (Manifest V3) pour exporter l'onglet courant en PDF sur une seule page.
- UI popup pour l'export direct et les contrôles avancés de zone (`left`, `right`, `top`, `bottom`).
- Mode visuel de sélection par défilement avec bordure verte alignée sur le viewport.
- Export immédiat après clic sur Done en mode sélection.
- Pipeline d'export en arrière-plan via Chrome DevTools Protocol (`Page.printToPDF`) avec logique temporaire de recadrage/restauration.
- Option d'affichage de la boîte de dialogue d'enregistrement ("Ask file name before save").
- Ensemble complet d'icônes et de ressources Chrome Web Store (captures, bannière promo, métadonnées, pages confidentialité/support).

### Changed
- Optimisation du réglage de sélection : le défilement vers le haut réduit `bottom` de manière plus intuitive.
- La couche de sélection est limitée au viewport de contenu pour éviter le chevauchement visuel avec l'UI du navigateur.
