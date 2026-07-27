# Registro de cambios

[English](CHANGELOG.md) | [简体中文](CHANGELOG.zh-CN.md) | [繁體中文](CHANGELOG.zh-TW.md) | [Español](CHANGELOG.es.md) | [Français](CHANGELOG.fr.md) | [Deutsch](CHANGELOG.de.md)

Este archivo documenta todos los cambios importantes del proyecto.

El formato se basa en los principios de Keep a Changelog.

## [1.0.2] - 2026-07-27

Versión de parche centrada en experiencia multilingüe y estabilidad del diseño del popup.

### Added
- Soporte multilingüe en tiempo de ejecución para 6 idiomas: English, 简体中文, 繁體中文, Español, Français y Deutsch.
- Selector manual de idioma en la cabecera del popup con opciones etiquetadas con banderas.
- Nuevo locale de chino tradicional (`zh-TW`).

### Changed
- Se optimizó el diseño de la cabecera del popup moviendo el selector de idioma a la misma línea del título.
- La opción de chino tradicional ahora usa la bandera de Hong Kong para identificación visual rápida.
- Se localizaron los textos restantes en chino y las etiquetas de dirección.

### Fixed
- Se redujo el efecto de "salto" del popup al cambiar de idioma estabilizando las dimensiones del popup y el comportamiento de desplazamiento interno.

## [1.0.1] - 2026-07-27

Versión de parche centrada en fiabilidad de exportación y flujo de empaquetado.

### Fixed
- Se evitó que superposiciones flotantes `fixed` y `sticky` cubrieran la parte superior del contenido en PDFs exportados.
- Se añadió ocultación temporal y restauración para posibles capas bloqueadoras durante la impresión.

### Added
- Script de empaquetado CRX con un solo comando.
- Mecanismo de detección automática de navegador en macOS para el empaquetado CRX.

## [1.0.0] - 2026-07-22

Primera versión pública.

### Added
- Extensión inicial de Chrome (Manifest V3) para exportar la pestaña actual como PDF de una sola página.
- UI de popup para exportación directa y controles avanzados de región (`left`, `right`, `top`, `bottom`).
- Modo visual de selección por desplazamiento con borde verde alineado al viewport.
- Flujo de exportación inmediata al hacer clic en Done en el modo de selección.
- Flujo de exportación en background con Chrome DevTools Protocol (`Page.printToPDF`) y lógica temporal de recorte/restauración.
- Opción para mostrar el diálogo de guardado ("Ask file name before save").
- Conjunto completo de iconos y materiales para Chrome Web Store (capturas, banner promocional, metadatos, páginas de privacidad/soporte).

### Changed
- Se optimizó el ajuste de selección para que el desplazamiento hacia arriba recorte `bottom` de forma más intuitiva.
- La capa de selección se limitó al viewport de contenido para evitar superposición visual con la UI del navegador.
