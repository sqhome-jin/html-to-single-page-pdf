function sanitizeFileName(value) {
  return String(value || "page")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 120) || "page";
}

function sendCommand(target, method, params = {}) {
  return new Promise((resolve, reject) => {
    chrome.debugger.sendCommand(target, method, params, (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(result);
    });
  });
}

function executeScript(tabId, func, args = []) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func,
        args
      },
      (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve(result);
      }
    );
  });
}

async function applyExportRange(tabId, region) {
  const width = Math.max(1, region.right - region.left);
  const height = Math.max(1, region.bottom - region.top);

  await executeScript(
    tabId,
    (left, top, widthPx, heightPx) => {
      const body = document.body;
      const html = document.documentElement;

      const backup = {
        bodyTransform: body.style.transform,
        bodyTransformOrigin: body.style.transformOrigin,
        bodyHeight: body.style.height,
        bodyWidth: body.style.width,
        bodyOverflow: body.style.overflow,
        htmlHeight: html.style.height,
        htmlWidth: html.style.width,
        htmlOverflow: html.style.overflow
      };

      html.dataset.singlePagePdfBackup = JSON.stringify(backup);

      body.style.transform = `translate(${-Math.max(0, left)}px, ${-Math.max(0, top)}px)`;
      body.style.transformOrigin = "top left";
      body.style.width = `${Math.max(1, widthPx)}px`;
      body.style.height = `${Math.max(1, heightPx)}px`;
      body.style.overflow = "hidden";

      html.style.width = `${Math.max(1, widthPx)}px`;
      html.style.height = `${Math.max(1, heightPx)}px`;
      html.style.overflow = "hidden";
    },
    [region.left, region.top, width, height]
  );
}

async function clearExportRange(tabId) {
  await executeScript(tabId, () => {
    const body = document.body;
    const html = document.documentElement;

    const backupText = html.dataset.singlePagePdfBackup;
    if (!backupText) return;

    let backup;
    try {
      backup = JSON.parse(backupText);
    } catch {
      backup = null;
    }

    if (backup) {
      body.style.transform = backup.bodyTransform || "";
      body.style.transformOrigin = backup.bodyTransformOrigin || "";
      body.style.width = backup.bodyWidth || "";
      body.style.height = backup.bodyHeight || "";
      body.style.overflow = backup.bodyOverflow || "";

      html.style.width = backup.htmlWidth || "";
      html.style.height = backup.htmlHeight || "";
      html.style.overflow = backup.htmlOverflow || "";
    }

    delete html.dataset.singlePagePdfBackup;
  });
}

async function exportRegionNow(tabId, region, title) {
  const target = { tabId };
  const widthPx = Math.max(1, region.right - region.left);
  const heightPx = Math.max(1, region.bottom - region.top);

  await applyExportRange(tabId, region);

  try {
    await new Promise((resolve, reject) => {
      chrome.debugger.attach(target, "1.3", () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve();
      });
    });

    await sendCommand(target, "Page.enable");
    const result = await sendCommand(target, "Page.printToPDF", {
      printBackground: true,
      preferCSSPageSize: false,
      scale: 1,
      paperWidth: widthPx / 96,
      paperHeight: heightPx / 96,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0
    });

    if (!result?.data) {
      throw new Error("Failed to generate PDF data.");
    }

    const filename = `${sanitizeFileName(title)}.single-page.pdf`;
    await new Promise((resolve, reject) => {
      chrome.downloads.download(
        {
          url: `data:application/pdf;base64,${result.data}`,
          filename,
          saveAs: true
        },
        (downloadId) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve(downloadId);
        }
      );
    });
  } finally {
    await clearExportRange(tabId).catch(() => {});
    await new Promise((resolve) => {
      chrome.debugger.detach(target, () => resolve());
    });
  }
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type !== "single-page-pdf-export-now") {
    return;
  }

  const tabId = sender?.tab?.id;
  const title = sender?.tab?.title || "page";
  const captured = message.captured;

  if (!tabId || !captured) {
    return;
  }

  const payload = {
    tabId,
    captured,
    capturedAt: Date.now()
  };

  chrome.storage.session.set({ singlePagePdfLastSelection: payload }, () => {
    void exportRegionNow(tabId, captured, title);
  });
});
