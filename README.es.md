# Single Page PDF Exporter (Extensión de Chrome)

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md)

Una extensión de Chrome que exporta la pestaña actual como PDF de una sola página, conservando el diseño y los estilos lo mejor posible.

## :sparkles: Funciones

- Exportación de PDF en una sola página para la pestaña actual.
- Control preciso de región con `left` / `right` / `top` / `bottom`.
- Selección visual por desplazamiento directamente en la página.
- Ocultación temporal de capas flotantes bloqueadoras durante la exportación.
- Interfaz multilingüe (6 idiomas) con cambio manual en el popup.

Idiomas compatibles:

- 🇺🇸 English
- 🇨🇳 简体中文
- 🇭🇰 繁體中文
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch

## :rocket: Carga local

1. Abre Chrome y ve a `chrome://extensions`.
2. Activa **Developer mode**.
3. Haz clic en **Load unpacked**.
4. Selecciona esta carpeta.

## :clipboard: Uso

1. Abre cualquier página web.
2. Haz clic en el icono de la extensión.
3. Ajusta la región si lo necesitas.
4. Haz clic en **Export Current Tab** y guarda el PDF.

Opciones del popup:

- **Language**: por defecto usa el idioma del navegador, con cambio manual.
- **Left/Right/Top/Bottom (px)**: límites exactos de exportación.
- **Refresh Current Bounds**: actualiza los límites detectados.
- **Start Scroll Range Selection**: selección visual interactiva.
- **Ask file name before save**: activa/desactiva el diálogo de guardado.

## :wrench: Empaquetado

### Generar ZIP (subida a Chrome Web Store)

```bash
bash scripts/package-extension.sh
```

Directorio de salida opcional:

```bash
bash scripts/package-extension.sh ./release
```

### Generar CRX

```bash
bash scripts/package-extension-crx.sh
```

Directorio y clave opcionales:

```bash
bash scripts/package-extension-crx.sh ./dist ./dist/single-page-pdf-exporter.pem
```

Notas:

- El script CRX detecta Chrome/Edge automáticamente en macOS.
- En la primera ejecución se genera una clave `.pem`. Guárdala para mantener la identidad de la extensión.

## :lock: Privacidad y datos

- El procesamiento se realiza localmente en el navegador.
- No requiere servicios remotos para generar PDF.
- No incluye SDK de analítica ni rastreo.

Ver:

- `privacy-policy.html`
- `store-assets/privacy-policy-template.md`
- `store-assets/chrome-web-store-privacy-form.en-US.md`
- `store-assets/chrome-web-store-privacy-form.zh-CN.md`

## :file_folder: Archivos clave

- `manifest.json`: manifiesto de extensión (MV3)
- `popup.html`: estructura del popup
- `popup.css`: estilos del popup
- `popup.js`: lógica del popup, i18n, selección y exportación
- `background.js`: flujo de exportación en background (`Page.printToPDF`)
- `_locales/`: diccionarios de traducción
- `scripts/package-extension.sh`: script de ZIP
- `scripts/package-extension-crx.sh`: script de CRX

## :package: Recursos de tienda

- Texto principal: `store-assets/chrome-web-store-listing.md`
- Texto EN: `store-assets/chrome-web-store-listing.en-US.md`
- Texto ZH-CN: `store-assets/chrome-web-store-listing.zh-CN.md`
- Metadata: `store-assets/chrome-web-store-metadata.json`
- Checklist: `store-assets/chrome-web-store-submission-checklist.md`
- Soporte: `store-assets/support.html`
- Capturas y banner: `store-assets/`

## :memo: Changelog

- [CHANGELOG.md](CHANGELOG.md)
- [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)
- [CHANGELOG.zh-TW.md](CHANGELOG.zh-TW.md)
- [CHANGELOG.es.md](CHANGELOG.es.md)
- [CHANGELOG.fr.md](CHANGELOG.fr.md)
- [CHANGELOG.de.md](CHANGELOG.de.md)

## :bust_in_silhouette: Metadata

- Author: `SQHOME-SUN`
