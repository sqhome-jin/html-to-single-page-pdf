# Single Page PDF Exporter（Chrome 擴充功能）

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md)

可將目前分頁匯出為單頁 PDF，並盡量保留原始版面與樣式的 Chrome 擴充功能。

## :sparkles: 功能

- 目前分頁單頁 PDF 匯出
- 支援 `left` / `right` / `top` / `bottom` 精準區域控制
- 支援頁面內視覺化捲動選區
- 匯出前自動隱藏浮動遮擋層，匯出後自動還原
- 支援 6 種介面語言與手動切換

支援語言：

- 🇺🇸 English
- 🇨🇳 简体中文
- 🇭🇰 繁體中文
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch

## :rocket: 本機載入

1. 開啟 Chrome，進入 `chrome://extensions`
2. 開啟 **開發人員模式**
3. 點擊 **載入未封裝項目**
4. 選擇此目錄

## :clipboard: 使用方式

1. 開啟任一網頁
2. 點擊擴充功能圖示
3. 視需要調整匯出區域
4. 點擊 **Export Current Tab** 儲存 PDF

彈出視窗選項：

- **Language**：預設跟隨瀏覽器語言，支援手動切換
- **Left/Right/Top/Bottom (px)**：精準邊界
- **Refresh Current Bounds**：重新整理頁面邊界
- **Start Scroll Range Selection**：進入視覺化選區
- **Ask file name before save**：是否在儲存前詢問檔名

## :wrench: 打包

### 產生 ZIP（用於 Chrome 商店上傳）

```bash
bash scripts/package-extension.sh
```

可選輸出目錄：

```bash
bash scripts/package-extension.sh ./release
```

### 產生 CRX

```bash
bash scripts/package-extension-crx.sh
```

可選輸出目錄與金鑰路徑：

```bash
bash scripts/package-extension-crx.sh ./dist ./dist/single-page-pdf-exporter.pem
```

說明：

- CRX 腳本會在 macOS 自動偵測 Chrome/Edge
- 首次執行會產生 `.pem`，請妥善保管以維持擴充功能識別穩定

## :lock: 隱私與資料

- 全流程於本機瀏覽器中完成
- 不依賴遠端 PDF 服務
- 不含分析或追蹤 SDK

參考：

- `privacy-policy.html`
- `store-assets/privacy-policy-template.md`
- `store-assets/chrome-web-store-privacy-form.en-US.md`
- `store-assets/chrome-web-store-privacy-form.zh-CN.md`

## :file_folder: 主要檔案

- `manifest.json`：擴充功能清單（MV3）
- `popup.html`：彈出視窗結構
- `popup.css`：彈出視窗樣式
- `popup.js`：彈出視窗邏輯、i18n、選區與匯出
- `background.js`：背景匯出流程（`Page.printToPDF`）
- `_locales/`：多語言字典
- `scripts/package-extension.sh`：ZIP 打包腳本
- `scripts/package-extension-crx.sh`：CRX 打包腳本

## :package: 商店素材

- 文案：`store-assets/chrome-web-store-listing.md`
- 英文文案：`store-assets/chrome-web-store-listing.en-US.md`
- 中文文案：`store-assets/chrome-web-store-listing.zh-CN.md`
- 中繼資料：`store-assets/chrome-web-store-metadata.json`
- 提交清單：`store-assets/chrome-web-store-submission-checklist.md`
- 支援頁：`store-assets/support.html`
- 截圖與橫幅：`store-assets/`

## :memo: 更新日誌

- [CHANGELOG.md](CHANGELOG.md)
- [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)
- [CHANGELOG.zh-TW.md](CHANGELOG.zh-TW.md)
- [CHANGELOG.es.md](CHANGELOG.es.md)
- [CHANGELOG.fr.md](CHANGELOG.fr.md)
- [CHANGELOG.de.md](CHANGELOG.de.md)

## :bust_in_silhouette: 中繼資訊

- Author: `SQHOME-SUN`
