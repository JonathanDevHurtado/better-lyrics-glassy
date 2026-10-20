import type { WindowSize } from "@modules/ui/pictureInPicture/windowSize";

// Better Lyrics Shaders looks this window up by name, because Electron's Document PiP API has no
// native window handle. Keep it in sync with shaders-glassy/contents/lib/pipManager.ts.
const SCRIPTED_WINDOW_NAME = "blyrics-pip";

// Electron's Document Picture-in-Picture API resolves without a native window. A same-origin
// window it opens is scriptable from this world and stays in the opener's process, so the existing
// host can render it.
export function requestScriptedWindow(size: WindowSize): Window | null {
  const features = [
    "popup=yes",
    `width=${Math.round(size.width)}`,
    `height=${Math.round(size.height)}`,
    "resizable=yes",
    "alwaysOnTop=yes",
    "autoHideMenuBar=yes",
    "backgroundColor=black",
    "minimizable=no",
    "maximizable=no",
    "fullscreenable=no",
    "skipTaskbar=yes",
  ].join(",");

  return window.open("about:blank", SCRIPTED_WINDOW_NAME, features);
}
