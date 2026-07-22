# Chrome Web Store Privacy Form (Ready to Paste)

Extension: Single Page PDF Exporter  
Developer: SQHOME-SUN

## Single Purpose

The single purpose of this extension is to let users export the current tab, or a user-selected region of the page, as a single-page PDF while preserving layout and styles as much as possible. The extension only performs region selection, print parameter handling, and local file saving, and does not provide unrelated functionality.

## Justification for Requested Permissions

### activeTab
Used only when the user actively clicks the extension and starts export. It provides temporary access to the current active tab so the extension can read page bounds and run the export flow. It does not access other tabs.

### scripting
Used to inject and run page-side logic required for export (such as selection overlay, boundary calculation, and temporary pre-export style adjustments/restoration). It runs only on the current active page.

### debugger
Used to call Chrome DevTools Protocol Page.printToPDF for high-fidelity PDF generation, including single-page output based on user-selected bounds. This permission is used only to implement local export capability.

### downloads
Used to save generated PDF files to the user's device through the browser download flow, including the Save As dialog when enabled.

### storage
Used to store small amounts of local extension settings and temporary state (for example selected bounds and save-dialog preference). It is not used for cross-site tracking and is not uploaded to developer servers.

## Do You Use Remote Code?

Selection: No, I am not using remote code.

Reason: All JavaScript/CSS/assets needed to run the extension are packaged inside the extension bundle. The extension does not execute code from external script tags, remote modules, remotely fetched eval strings, or remote Wasm.

## Data Usage

User data currently or in the future collected: None.

Explanation: The extension does not collect, store, transmit, or sell personal information. Page processing and PDF generation happen locally in the user's browser, and output files are saved directly by the user on their own device.

If the form requires additional text, you can paste:
This extension does not collect any user data. It processes the current page locally to generate a PDF and does not send page content, browsing history, identity information, or other user data to developer servers or third parties.

## Required Compliance Checkboxes

Please check all three:
- I do not sell or transfer user data to third parties outside approved use cases.
- I do not use or transfer user data for purposes unrelated to this extension's single purpose.
- I do not use or transfer user data to determine creditworthiness or for lending purposes.

## Privacy Policy URL

Provide a publicly accessible HTTPS URL that Chrome reviewers can open.

Recommended options:
- GitHub Pages (recommended): https://sqhome-jin.github.io/html-to-single-page-pdf/privacy-policy.html
- Or your own public website privacy-policy page

Notes:
- privacy-policy.html at repository root is intended for GitHub Pages publishing.
- Before submitting, confirm the URL is accessible in an incognito or logged-out browser session.
