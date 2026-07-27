# Single Page PDF Exporter（Chrome 扩展）

[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md)

一个将当前标签页导出为单页 PDF 的 Chrome 扩展，并尽量保留原始布局与样式。

## ✨ 功能

- 当前标签页单页 PDF 导出
- 支持 `left` / `right` / `top` / `bottom` 精确区域控制
- 支持页面内可视化滚动选区
- 导出前自动隐藏浮动遮挡层，导出后自动恢复
- 支持 6 种界面语言与手动切换

支持语言：

- 🇺🇸 English
- 🇨🇳 简体中文
- 🇭🇰 繁體中文
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch

## 🚀 本地加载

1. 打开 Chrome，进入 `chrome://extensions`
2. 开启 **开发者模式**
3. 点击 **加载已解压的扩展程序**
4. 选择本目录

## 📋 使用方法

1. 打开任意网页
2. 点击扩展图标
3. 如需可调整导出区域
4. 点击 **Export Current Tab** 保存 PDF

弹窗选项：

- **Language**：默认跟随浏览器语言，支持手动切换
- **Left/Right/Top/Bottom (px)**：精确边界
- **Refresh Current Bounds**：刷新页面边界
- **Start Scroll Range Selection**：进入可视化选区
- **Ask file name before save**：是否在保存前询问文件名

## 🔧 打包

### 生成 ZIP（用于 Chrome 商店上传）

```bash
bash scripts/package-extension.sh
```

可选输出目录：

```bash
bash scripts/package-extension.sh ./release
```

### 生成 CRX

```bash
bash scripts/package-extension-crx.sh
```

可选输出目录与密钥路径：

```bash
bash scripts/package-extension-crx.sh ./dist ./dist/single-page-pdf-exporter.pem
```

说明：

- CRX 脚本会在 macOS 自动检测 Chrome/Edge
- 首次会生成 `.pem`，请妥善保管以保持扩展身份稳定

## 🔒 隐私与数据

- 全流程在本地浏览器中完成
- 不依赖远程 PDF 服务
- 不包含分析或跟踪 SDK

参考：

- `privacy-policy.html`
- `store-assets/privacy-policy-template.md`
- `store-assets/chrome-web-store-privacy-form.en-US.md`
- `store-assets/chrome-web-store-privacy-form.zh-CN.md`

## 📁 关键文件

- `manifest.json`：扩展清单（MV3）
- `popup.html`：弹窗结构
- `popup.css`：弹窗样式
- `popup.js`：弹窗逻辑、i18n、选区与导出
- `background.js`：后台导出流程（`Page.printToPDF`）
- `_locales/`：多语言词典
- `scripts/package-extension.sh`：ZIP 打包脚本
- `scripts/package-extension-crx.sh`：CRX 打包脚本

## 📦 商店素材

- 文案：`store-assets/chrome-web-store-listing.md`
- 英文文案：`store-assets/chrome-web-store-listing.en-US.md`
- 中文文案：`store-assets/chrome-web-store-listing.zh-CN.md`
- 元数据：`store-assets/chrome-web-store-metadata.json`
- 提交清单：`store-assets/chrome-web-store-submission-checklist.md`
- 支持页：`store-assets/support.html`
- 截图与横幅：`store-assets/`

## 📝 变更日志

- [CHANGELOG.md](CHANGELOG.md)
- [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)
- [CHANGELOG.zh-TW.md](CHANGELOG.zh-TW.md)
- [CHANGELOG.es.md](CHANGELOG.es.md)
- [CHANGELOG.fr.md](CHANGELOG.fr.md)
- [CHANGELOG.de.md](CHANGELOG.de.md)

## 👤 元信息

- Author: `SQHOME-SUN`
