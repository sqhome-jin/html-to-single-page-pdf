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
    async (left, top, widthPx, heightPx) => {
      const body = document.body;
      const html = document.documentElement;
      const hiddenAttr = "data-single-page-pdf-hidden-backup";

      const clearHiddenOverlays = () => {
        const hiddenNodes = html.querySelectorAll(`[${hiddenAttr}]`);
        for (const el of hiddenNodes) {
          let backup = null;
          try {
            backup = JSON.parse(el.getAttribute(hiddenAttr) || "null");
          } catch {
            backup = null;
          }

          if (backup) {
            el.style.visibility = backup.visibility || "";
            el.style.opacity = backup.opacity || "";
            el.style.pointerEvents = backup.pointerEvents || "";
          }
          el.removeAttribute(hiddenAttr);
        }
      };

      clearHiddenOverlays();

      const backup = {
        bodyTransform: body.style.transform,
        bodyTransformOrigin: body.style.transformOrigin,
        bodyHeight: body.style.height,
        bodyWidth: body.style.width,
        bodyOverflow: body.style.overflow,
        htmlHeight: html.style.height,
        htmlWidth: html.style.width,
        htmlOverflow: html.style.overflow,
        hiddenAttr
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

      const viewportWidth = Math.max(1, window.innerWidth || html.clientWidth || 1);
      const viewportHeight = Math.max(1, window.innerHeight || html.clientHeight || 1);
      const viewportArea = viewportWidth * viewportHeight;
      let hiddenCount = 0;

      for (const el of body.querySelectorAll("*")) {
        if (hiddenCount >= 400) {
          break;
        }

        const computed = window.getComputedStyle(el);
        const position = computed.position;
        if (position !== "fixed" && position !== "sticky") {
          continue;
        }

        const rect = el.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) {
          continue;
        }

        const area = rect.width * rect.height;
        if (area > viewportArea * 0.95) {
          continue;
        }

        const zParsed = Number.parseInt(computed.zIndex, 10);
        const zIndex = Number.isFinite(zParsed) ? zParsed : 0;
        const stickyPinned = position === "sticky" && (rect.top <= 1 || rect.bottom >= viewportHeight - 1);
        const likelyFloating = (position === "fixed" && zIndex >= 1) || (stickyPinned && zIndex >= 1);

        if (!likelyFloating) {
          continue;
        }

        const inlineBackup = {
          visibility: el.style.visibility,
          opacity: el.style.opacity,
          pointerEvents: el.style.pointerEvents
        };

        el.setAttribute(hiddenAttr, JSON.stringify(inlineBackup));
        el.style.setProperty("visibility", "hidden", "important");
        el.style.setProperty("opacity", "0", "important");
        el.style.setProperty("pointer-events", "none", "important");
        hiddenCount += 1;
      }

      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });
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

      const hiddenAttr = backup.hiddenAttr || "data-single-page-pdf-hidden-backup";
      const hiddenNodes = html.querySelectorAll(`[${hiddenAttr}]`);
      for (const el of hiddenNodes) {
        let inlineBackup = null;
        try {
          inlineBackup = JSON.parse(el.getAttribute(hiddenAttr) || "null");
        } catch {
          inlineBackup = null;
        }

        if (inlineBackup) {
          el.style.visibility = inlineBackup.visibility || "";
          el.style.opacity = inlineBackup.opacity || "";
          el.style.pointerEvents = inlineBackup.pointerEvents || "";
        }
        el.removeAttribute(hiddenAttr);
      }
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
