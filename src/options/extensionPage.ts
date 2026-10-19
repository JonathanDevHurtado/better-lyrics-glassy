export function openExtensionPage(pagePath: string): void {
  const url = chrome.runtime.getURL(pagePath);
  try {
    if (chrome.tabs?.create) {
      chrome.tabs.create({ url });
      return;
    }
  } catch {
    // chrome.tabs is unavailable in the Electron host
  }
  window.open(url, "_blank");
}
