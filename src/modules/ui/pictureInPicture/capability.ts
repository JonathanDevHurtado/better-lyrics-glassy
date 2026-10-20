import type { DocumentPictureInPicture, PictureInPictureCapability } from "./types";

const ELECTRON_HOST_ATTRIBUTE = "data-electron-host";

function isDocumentPictureInPicture<TWindow>(value: unknown): value is DocumentPictureInPicture<TWindow> {
  return (
    typeof value === "object" && value !== null && "requestWindow" in value && typeof value.requestWindow === "function"
  );
}

function isElectronHost(host: object): boolean {
  const { navigator, document } = host as { navigator?: { userAgent?: unknown }; document?: Document };
  if (typeof navigator?.userAgent === "string" && navigator.userAgent.includes("Electron/")) return true;
  return document?.documentElement?.hasAttribute(ELECTRON_HOST_ATTRIBUTE) === true;
}

function canOpenScriptedWindow(host: object): boolean {
  return isElectronHost(host) && typeof (host as { open?: unknown }).open === "function";
}

export function getPictureInPictureCapability<TWindow = Window>(host: object): PictureInPictureCapability<TWindow> {
  // Electron exposes the API but requestWindow() resolves to a window with no native surface.
  if (canOpenScriptedWindow(host)) return { kind: "scripted-window" };

  if (!("documentPictureInPicture" in host)) return { kind: "missing" };

  const candidate = host.documentPictureInPicture;
  if (!isDocumentPictureInPicture<TWindow>(candidate)) return { kind: "malformed" };
  return { kind: "supported", api: candidate };
}
