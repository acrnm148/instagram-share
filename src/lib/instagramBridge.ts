// Web <-> native bridge contract for Instagram sharing.
//
// The native container (Flutter webview_flutter, Android WebView, or iOS WKWebView)
// must expose a message channel named "InstagramBridge" that receives a JSON string:
//   { id: string, action: "shareInstagramStory" | "shareInstagramDirect", payload: {...} }
//
// - Android WebView: addJavascriptInterface(bridge, "InstagramBridge") with a
//   @JavascriptInterface fun postMessage(message: String)
// - iOS WKWebView: userContentController.add(handler, name: "InstagramBridge"),
//   reached from JS as window.webkit.messageHandlers.InstagramBridge.postMessage(message)
// - Flutter webview_flutter: JavaScriptChannel(name: "InstagramBridge", ...) — this
//   automatically exposes window.InstagramBridge.postMessage on both platforms.
//
// After handling the action, native must call back into JS:
//   window.__onInstagramBridgeResult(id, JSON.stringify(result))
// so the pending Promise on the web side can resolve.

export type InstagramShareResult =
  | { status: "success" }
  | { status: "unavailable"; reason: "not_installed" | "unsupported_platform" | "bridge_missing" }
  | { status: "error"; message: string };

export interface ShareStoryPayload {
  /**
   * Remote https URL of the full-bleed background image. Native must download it to a
   * local file before sharing. Omit this (and use backgroundTopColor/backgroundBottomColor
   * instead) when sharing a stickerImageUrl, so the sticker sits on a plain gradient
   * instead of on top of another image.
   */
  imageUrl?: string;
  /**
   * Remote https URL of a transparent PNG rendered as a movable, resizable sticker on top
   * of the background — the same mechanism Spotify/Apple Music use for their "now playing"
   * card. The user can drag, resize, and rotate it inside Instagram's own story editor after
   * sharing. Falls back to a plain background-only story if the installed Instagram version
   * doesn't support interactive stickers.
   */
  stickerImageUrl?: string;
  /** Optional link shown as a "swipe up" / sticker link attribution on the story. */
  linkUrl?: string;
  backgroundTopColor?: string;
  backgroundBottomColor?: string;
}

export interface ShareDirectPayload {
  /** Remote https URL of the image to share. */
  imageUrl?: string;
  text?: string;
}

type BridgeAction = "shareInstagramStory" | "shareInstagramDirect";

interface BridgeRequest<T> {
  id: string;
  action: BridgeAction;
  payload: T;
}

declare global {
  interface Window {
    InstagramBridge?: { postMessage: (message: string) => void };
    webkit?: {
      messageHandlers?: {
        InstagramBridge?: { postMessage: (message: unknown) => void };
      };
    };
    __onInstagramBridgeResult?: (id: string, resultJson: string) => void;
  }
}

const RESPONSE_TIMEOUT_MS = 8000;
const pending = new Map<string, (result: InstagramShareResult) => void>();

if (typeof window !== "undefined") {
  window.__onInstagramBridgeResult = (id, resultJson) => {
    const resolve = pending.get(id);
    if (!resolve) return;
    pending.delete(id);
    try {
      resolve(JSON.parse(resultJson) as InstagramShareResult);
    } catch {
      resolve({ status: "error", message: "invalid_result_json" });
    }
  };
}

function getNativeHandler(): ((message: string) => void) | null {
  if (typeof window === "undefined") return null;
  if (window.InstagramBridge?.postMessage) {
    return (message) => window.InstagramBridge!.postMessage(message);
  }
  if (window.webkit?.messageHandlers?.InstagramBridge?.postMessage) {
    return (message) => window.webkit!.messageHandlers!.InstagramBridge!.postMessage(message);
  }
  return null;
}

let requestCounter = 0;

// crypto.randomUUID() is only available in secure contexts (HTTPS/localhost), but this
// bridge also runs over plain http:// against a native WebView's dev server, so avoid it.
function createRequestId(): string {
  requestCounter += 1;
  return `${Date.now().toString(36)}-${requestCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

function sendToNative<T>(action: BridgeAction, payload: T): Promise<InstagramShareResult> {
  const handler = getNativeHandler();
  if (!handler) {
    return Promise.resolve({ status: "unavailable", reason: "bridge_missing" });
  }

  const id = createRequestId();
  const request: BridgeRequest<T> = { id, action, payload };

  return new Promise((resolve) => {
    pending.set(id, resolve);
    handler(JSON.stringify(request));
    setTimeout(() => {
      if (pending.delete(id)) {
        resolve({ status: "error", message: "timeout" });
      }
    }, RESPONSE_TIMEOUT_MS);
  });
}

export function isNativeBridgeAvailable(): boolean {
  return getNativeHandler() !== null;
}

/** Shares a background image to the user's own Instagram Story. Story content is always "to self". */
export function shareToInstagramStory(payload: ShareStoryPayload): Promise<InstagramShareResult> {
  return sendToNative("shareInstagramStory", payload);
}

/**
 * Opens Instagram's own share sheet with the given content. Instagram does not expose
 * an API to target a specific DM recipient — the user picks "Direct" and a recipient
 * inside Instagram's own UI after this call hands off to it.
 */
export function shareToInstagramDirect(payload: ShareDirectPayload): Promise<InstagramShareResult> {
  return sendToNative("shareInstagramDirect", payload);
}
