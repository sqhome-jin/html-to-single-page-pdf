const exportBtn = document.getElementById("exportBtn");
const selectRangeBtn = document.getElementById("selectRangeBtn");
const refreshBtn = document.getElementById("refreshBtn");
const statusEl = document.getElementById("status");
const regionMetaEl = document.getElementById("regionMeta");
const leftInput = document.getElementById("leftPx");
const rightInput = document.getElementById("rightPx");
const topInput = document.getElementById("topPx");
const bottomInput = document.getElementById("bottomPx");
const saveAsInput = document.getElementById("saveAs");

let selectedRegion = null;

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = type ? `status ${type}` : "status";
}

function sanitizeFileName(value) {
  return String(value || "page")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 120) || "page";
}

function base64ToBlob(base64, mimeType) {
  const binary = atob(base64);
  const length = binary.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
}

function updateRegionMeta(region) {
  const width = Math.max(1, region.right - region.left);
  const height = Math.max(1, region.bottom - region.top);
  regionMetaEl.textContent = `Region size: ${width}px x ${height}px`;
}

function setRegionInputs(region) {
  leftInput.value = String(Math.max(0, Math.floor(region.left || 0)));
  rightInput.value = String(Math.max(1, Math.ceil(region.right || 1)));
  topInput.value = String(Math.max(0, Math.floor(region.top || 0)));
  bottomInput.value = String(Math.max(1, Math.ceil(region.bottom || 1)));
  updateRegionMeta(getRegionFromInputs());
}

function getRegionFromInputs() {
  const left = Math.max(0, Number.parseInt(leftInput.value || "0", 10) || 0);
  const right = Math.max(left + 1, Number.parseInt(rightInput.value || "0", 10) || left + 1);
  const top = Math.max(0, Number.parseInt(topInput.value || "0", 10) || 0);
  const bottom = Math.max(top + 1, Number.parseInt(bottomInput.value || "0", 10) || top + 1);

  return { left, right, top, bottom };
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs.length || !tabs[0].id) {
    throw new Error("No active tab found.");
  }
  return tabs[0];
}

async function getPageSelectionState(tabId) {
  const result = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      return {
        active: Boolean(window.__singlePagePdfSelectionController),
        captured: window.__singlePagePdfSelectionResult || null
      };
    }
  });

  if (!result.length) {
    return { active: false, captured: null };
  }

  return result[0].result || { active: false, captured: null };
}

async function getStoredCapturedRegion(tabId) {
  const data = await chrome.storage.session.get("singlePagePdfLastSelection");
  const payload = data?.singlePagePdfLastSelection;
  if (!payload?.captured) {
    return null;
  }

  // Prefer captured data that belongs to the same source tab.
  if (payload.tabId != null && tabId != null && payload.tabId !== tabId) {
    return null;
  }

  return payload.captured;
}

async function measurePage(tabId) {
  const result = await chrome.scripting.executeScript({
    target: { tabId },
    func: async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const body = document.body;
      const html = document.documentElement;

      const width = Math.ceil(
        Math.max(
          body.scrollWidth,
          body.offsetWidth,
          html.clientWidth,
          html.scrollWidth,
          html.offsetWidth
        )
      );

      const height = Math.ceil(
        Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        )
      );

      return {
        left: 0,
        top: 0,
        right: Math.max(1, width),
        bottom: Math.max(1, height),
        title: document.title || "page"
      };
    }
  });

  if (!result.length || !result[0].result) {
    throw new Error("Failed to measure current page.");
  }

  return result[0].result;
}

async function withDebugger(tabId, run) {
  const target = { tabId };
  await chrome.debugger.attach(target, "1.3");

  try {
    await chrome.debugger.sendCommand(target, "Page.enable");
    return await run(target);
  } finally {
    await chrome.debugger.detach(target);
  }
}

async function printToSinglePagePdf(tabId, paperWidthIn, paperHeightIn) {
  return withDebugger(tabId, async (target) => {
    const result = await chrome.debugger.sendCommand(target, "Page.printToPDF", {
      printBackground: true,
      preferCSSPageSize: false,
      scale: 1,
      paperWidth: paperWidthIn,
      paperHeight: paperHeightIn,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0
    });

    if (!result?.data) {
      throw new Error("Failed to generate PDF data.");
    }

    return result.data;
  });
}

async function downloadPdf(base64Data, suggestedName, saveAs) {
  const blob = base64ToBlob(base64Data, "application/pdf");
  const objectUrl = URL.createObjectURL(blob);

  try {
    await chrome.downloads.download({
      url: objectUrl,
      filename: `${sanitizeFileName(suggestedName)}.single-page.pdf`,
      saveAs
    });
  } finally {
    setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
  }
}

async function selectScrollRange(tabId) {
  const result = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const existing = window.__singlePagePdfSelectionController;
      if (existing && typeof existing.show === "function") {
        existing.show();
        return { started: true, alreadyRunning: true };
      }

      const overlayId = "__single_page_pdf_overlay";
      const styleId = "__single_page_pdf_overlay_style";
      const layerId = "__single_page_pdf_overlay_layer";
      const areaId = "__single_page_pdf_overlay_area";

      document.getElementById(overlayId)?.remove();
      document.getElementById(styleId)?.remove();
      document.getElementById(layerId)?.remove();
      document.getElementById(areaId)?.remove();

      const controller = (() => {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
          #${overlayId} {
            position: fixed;
            top: 14px;
            right: 14px;
            z-index: 2147483647;
            width: 340px;
            border-radius: 18px;
            border: 1px solid rgba(203, 213, 225, 0.95);
            background: rgba(255, 255, 255, 0.95);
            color: #0f172a;
            box-shadow: 0 10px 20px rgba(7, 18, 35, 0.18);
            font: 13px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            padding: 12px;
          }
          #${overlayId} h3 {
            margin: 0 0 8px;
            font-size: 14px;
          }
          #${overlayId} p {
            margin: 0 0 7px;
            color: #22314e;
          }
          #${overlayId} .range {
            margin: 8px 0;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 12px;
            color: #0f6a33;
          }
          #${overlayId} .actions {
            display: flex;
            gap: 8px;
            margin-top: 10px;
          }
          #${overlayId} button {
            flex: 1;
            border: 1px solid rgba(203, 213, 225, 0.95);
            border-radius: 999px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 4px 10px rgba(10, 17, 32, 0.1);
          }
          #${overlayId} .done {
            background: linear-gradient(180deg, #0a84ff, #0071eb);
            color: #fff;
            border-color: rgba(6, 91, 184, 0.72);
          }
          #${overlayId} .cancel {
            background: #f8fafc;
            color: #334155;
          }
          #${layerId} {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            pointer-events: none;
            z-index: 2147483646;
          }
          #${areaId} {
            position: fixed;
            box-sizing: border-box;
            border: 5px solid rgba(52, 199, 89, 0.96);
            background: rgba(52, 199, 89, 0.04);
            pointer-events: none;
            z-index: 1;
            box-shadow: none;
          }
        `;
        document.documentElement.appendChild(style);

        const overlay = document.createElement("div");
        overlay.id = overlayId;
        overlay.innerHTML = `
          <h3>Select Region</h3>
          <p>Scroll to expand bottom/right. Scroll back up to reduce bottom/right.</p>
          <p>Top/left stay anchored at where you started selection.</p>
          <div class="range">Initializing...</div>
          <div class="actions">
            <button class="done" type="button">Done</button>
            <button class="cancel" type="button">Cancel</button>
          </div>
        `;
        document.documentElement.appendChild(overlay);

        const viewportLayer = document.createElement("div");
        viewportLayer.id = layerId;
        document.documentElement.appendChild(viewportLayer);

        const area = document.createElement("div");
        area.id = areaId;
        viewportLayer.appendChild(area);

        const rangeEl = overlay.querySelector(".range");
        const doneBtn = overlay.querySelector(".done");
        const cancelBtn = overlay.querySelector(".cancel");

        const body = document.body;
        const html = document.documentElement;

        const viewport = window.visualViewport;
        const viewportOffsetLeft = viewport ? viewport.offsetLeft : 0;
        const viewportOffsetTop = viewport ? viewport.offsetTop : 0;
        const viewportWidth = viewport ? viewport.width : window.innerWidth;
        const viewportHeight = viewport ? viewport.height : window.innerHeight;

        const startLeft = window.scrollX + viewportOffsetLeft;
        const startTop = window.scrollY + viewportOffsetTop;

        let currentRight = startLeft + viewportWidth;
        let currentBottom = startTop + viewportHeight;

        const trackedElements = new Set();
        const elementStarts = new WeakMap();

        const updateDocRight = () => {
          return Math.ceil(
            Math.max(
              body.scrollWidth,
              body.offsetWidth,
              html.clientWidth,
              html.scrollWidth,
              html.offsetWidth
            )
          );
        };

        const trackElement = (el) => {
          if (!(el instanceof Element)) return;
          if (el === document.documentElement || el === document.body) return;
          if (el.scrollHeight <= el.clientHeight + 1 && el.scrollWidth <= el.clientWidth + 1) return;

          if (!trackedElements.has(el)) {
            trackedElements.add(el);
            elementStarts.set(el, {
              top: el.scrollTop,
              left: el.scrollLeft
            });
          }
        };

        const recalculateRegion = () => {
          const vv = window.visualViewport;
          const vvOffsetLeft = vv ? vv.offsetLeft : 0;
          const vvOffsetTop = vv ? vv.offsetTop : 0;
          const vvWidth = vv ? vv.width : window.innerWidth;
          const vvHeight = vv ? vv.height : window.innerHeight;

          currentRight = Math.max(startLeft, window.scrollX + vvOffsetLeft) + vvWidth;
          currentBottom = Math.max(startTop, window.scrollY + vvOffsetTop) + vvHeight;

          for (const el of trackedElements) {
            if (!el.isConnected) continue;

            const starts = elementStarts.get(el);
            if (!starts) continue;

            const rect = el.getBoundingClientRect();
            const baseTop = rect.top + window.scrollY;
            const baseLeft = rect.left + window.scrollX;

            const maxTop = Math.max(starts.top, el.scrollTop);
            const maxLeft = Math.max(starts.left, el.scrollLeft);

            const candidateBottom = baseTop + maxTop + el.clientHeight;
            const candidateRight = baseLeft + maxLeft + el.clientWidth;

            currentBottom = Math.max(currentBottom, candidateBottom);
            currentRight = Math.max(currentRight, candidateRight);
          }

          const docRight = updateDocRight();
          currentRight = Math.min(Math.max(startLeft + 1, currentRight), Math.max(docRight, startLeft + 1));
          currentBottom = Math.max(startTop + 1, currentBottom);
        };

        const refreshText = () => {
          recalculateRegion();
          const left = Math.max(0, Math.floor(startLeft));
          const top = Math.max(0, Math.floor(startTop));
          const right = Math.max(left + 1, Math.ceil(currentRight));
          const bottom = Math.max(top + 1, Math.ceil(currentBottom));
          const width = right - left;
          const height = bottom - top;

          const vv = window.visualViewport;
          const vvOffsetLeft = vv ? vv.offsetLeft : 0;
          const vvOffsetTop = vv ? vv.offsetTop : 0;
          const vvWidth = vv ? vv.width : window.innerWidth;
          const vvHeight = vv ? vv.height : window.innerHeight;

          const visibleLeft = left - (window.scrollX + vvOffsetLeft);
          const visibleTop = top - (window.scrollY + vvOffsetTop);
          const visibleRight = right - (window.scrollX + vvOffsetLeft);
          const visibleBottom = bottom - (window.scrollY + vvOffsetTop);

          const clampedLeft = Math.max(0, Math.min(vvWidth, visibleLeft));
          const clampedTop = Math.max(0, Math.min(vvHeight, visibleTop));
          const clampedRight = Math.max(0, Math.min(vvWidth, visibleRight));
          const clampedBottom = Math.max(0, Math.min(vvHeight, visibleBottom));

          const visibleWidth = Math.max(0, clampedRight - clampedLeft);
          const visibleHeight = Math.max(0, clampedBottom - clampedTop);

          rangeEl.textContent = `left=${left}px right=${right}px top=${top}px bottom=${bottom}px`;

          if (visibleWidth < 1 || visibleHeight < 1) {
            area.style.display = "none";
          } else {
            area.style.display = "block";
            area.style.left = `${clampedLeft}px`;
            area.style.top = `${clampedTop}px`;
            area.style.width = `${visibleWidth}px`;
            area.style.height = `${visibleHeight}px`;
          }
        };

        const onWindowScroll = () => {
          refreshText();
        };

        const onAnyScroll = (event) => {
          trackElement(event.target);
          refreshText();
        };

        const cleanup = () => {
          window.removeEventListener("scroll", onWindowScroll, true);
          document.removeEventListener("scroll", onAnyScroll, true);
          overlay.remove();
          viewportLayer.remove();
          area.remove();
          style.remove();
          delete window.__singlePagePdfSelectionController;
        };

        doneBtn.addEventListener("click", () => {
          recalculateRegion();

          const left = Math.max(0, Math.floor(startLeft));
          const top = Math.max(0, Math.floor(startTop));
          const right = Math.max(left + 1, Math.ceil(currentRight));
          const bottom = Math.max(top + 1, Math.ceil(currentBottom));

          window.__singlePagePdfSelectionResult = {
            capturedAt: Date.now(),
            left,
            right,
            top,
            bottom,
            title: document.title || "page"
          };

          cleanup();

          try {
            chrome.runtime?.sendMessage?.({
              type: "single-page-pdf-export-now",
              captured: window.__singlePagePdfSelectionResult
            });
          } catch {
            // Ignore unavailable runtime messaging.
          }
        });

        cancelBtn.addEventListener("click", () => {
          cleanup();
        });

        window.addEventListener("scroll", onWindowScroll, true);
        document.addEventListener("scroll", onAnyScroll, true);
        refreshText();

        return {
          show() {
            overlay.style.display = "block";
            area.style.display = "block";
          }
        };
      })();

      window.__singlePagePdfSelectionController = controller;
      return { started: true, alreadyRunning: false };
    }
  });

  if (!result.length || !result[0].result) {
    throw new Error("Failed to select scroll range.");
  }

  return result[0].result;
}

async function applyExportRange(tabId, region) {
  const width = Math.max(1, region.right - region.left);
  const height = Math.max(1, region.bottom - region.top);

  await chrome.scripting.executeScript({
    target: { tabId },
    args: [region.left, region.top, width, height],
    func: (left, top, widthPx, heightPx) => {
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
    }
  });
}

async function clearExportRange(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
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
    }
  });
}

async function refreshCurrentBounds(showStatus = true) {
  const tab = await getActiveTab();
  if (!tab.id) {
    throw new Error("Cannot access active tab id.");
  }

  const metrics = await measurePage(tab.id);
  selectedRegion = {
    left: metrics.left,
    right: metrics.right,
    top: metrics.top,
    bottom: metrics.bottom
  };
  setRegionInputs(selectedRegion);

  if (showStatus) {
    setStatus(
      `Detected bounds: left=${metrics.left}px right=${metrics.right}px top=${metrics.top}px bottom=${metrics.bottom}px`,
      "success"
    );
  }

  return { tab, metrics };
}

async function loadCapturedRegion(tabId) {
  const stored = await getStoredCapturedRegion(tabId);
  let captured = stored;

  if (!captured) {
    const state = await getPageSelectionState(tabId);
    captured = state.captured;
  }

  if (!captured) {
    return null;
  }

  selectedRegion = {
    left: Math.max(0, captured.left || 0),
    right: Math.max(1, captured.right || 1),
    top: Math.max(0, captured.top || 0),
    bottom: Math.max(1, captured.bottom || 1)
  };
  setRegionInputs(selectedRegion);
  return captured;
}

async function exportCurrentTab() {
  exportBtn.disabled = true;
  selectRangeBtn.disabled = true;
  refreshBtn.disabled = true;
  setStatus("Preparing page...", "");

  try {
    const tab = await getActiveTab();
    if (!tab.id) {
      throw new Error("Cannot access active tab id.");
    }

    const metrics = { title: tab.title || "page" };

    const region = getRegionFromInputs();
    selectedRegion = region;
    updateRegionMeta(region);

    const widthPx = Math.max(1, region.right - region.left);
    const heightPx = Math.max(1, region.bottom - region.top);
    const pageWidthIn = widthPx / 96;
    const pageHeightIn = heightPx / 96;

    await applyExportRange(tab.id, region);

    let pdfBase64;
    try {
      setStatus("Rendering single-page PDF...", "");
      pdfBase64 = await printToSinglePagePdf(tab.id, pageWidthIn, pageHeightIn);
    } finally {
      await clearExportRange(tab.id);
    }

    setStatus("Saving file...", "");
    await downloadPdf(pdfBase64, metrics.title, saveAsInput.checked);

    setStatus(
      `Done. Region: left=${region.left}px right=${region.right}px top=${region.top}px bottom=${region.bottom}px`,
      "success"
    );
  } catch (error) {
    const message = error?.message || String(error);
    setStatus(message, "error");
  } finally {
    exportBtn.disabled = false;
    selectRangeBtn.disabled = false;
    refreshBtn.disabled = false;
  }
}

async function initializePopup() {
  exportBtn.disabled = true;
  selectRangeBtn.disabled = true;
  refreshBtn.disabled = true;
  setStatus("Detecting current bounds...", "");

  try {
    const refreshed = await refreshCurrentBounds(false);
    const captured = await loadCapturedRegion(refreshed.tab.id);

    if (captured) {
      setStatus(
        `Captured region loaded: left=${captured.left}px right=${captured.right}px top=${captured.top}px bottom=${captured.bottom}px`,
        "success"
      );
    } else {
      setStatus("Bounds loaded. You can export now.", "success");
    }
  } catch (error) {
    const message = error?.message || String(error);
    setStatus(message, "error");
  } finally {
    exportBtn.disabled = false;
    selectRangeBtn.disabled = false;
    refreshBtn.disabled = false;
  }
}

for (const input of [leftInput, rightInput, topInput, bottomInput]) {
  input.addEventListener("input", () => {
    const region = getRegionFromInputs();
    updateRegionMeta(region);
  });
}

exportBtn.addEventListener("click", () => {
  exportCurrentTab();
});

refreshBtn.addEventListener("click", async () => {
  refreshBtn.disabled = true;

  try {
    await refreshCurrentBounds(true);
  } catch (error) {
    const message = error?.message || String(error);
    setStatus(message, "error");
  } finally {
    refreshBtn.disabled = false;
  }
});

selectRangeBtn.addEventListener("click", async () => {
  exportBtn.disabled = true;
  selectRangeBtn.disabled = true;
  refreshBtn.disabled = true;
  setStatus("Starting range mode...", "");

  try {
    const tab = await getActiveTab();
    if (!tab.id) {
      throw new Error("Cannot access active tab id.");
    }

    const started = await selectScrollRange(tab.id);
    if (started.alreadyRunning) {
      setStatus("Range mode is already active on page.", "success");
    } else {
      setStatus(
        "Range mode is active on page. Scroll and click Done in overlay.",
        "success"
      );
    }

    window.close();
  } catch (error) {
    const message = error?.message || String(error);
    setStatus(message, "error");
  } finally {
    exportBtn.disabled = false;
    selectRangeBtn.disabled = false;
    refreshBtn.disabled = false;
  }
});

initializePopup();
