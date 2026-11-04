"use client";

import { useEffect, useState } from "react";
import {
  isNativeBridgeAvailable,
  shareToInstagramDirect,
  shareToInstagramStory,
  type InstagramShareResult,
} from "@/lib/instagramBridge";

const DEMO_IMAGE_URL = "https://picsum.photos/1080/1920";
const DEMO_LINK_URL = "https://example.com/product/123";

function describeResult(result: InstagramShareResult): string {
  switch (result.status) {
    case "success":
      return "✅ 네이티브에 전달 성공";
    case "unavailable":
      if (result.reason === "bridge_missing") {
        return "⚠️ 네이티브 브릿지가 없습니다 (일반 브라우저에서 열려있음)";
      }
      if (result.reason === "not_installed") {
        return "⚠️ 인스타그램 앱이 설치되어 있지 않습니다";
      }
      return "⚠️ 이 플랫폼에서는 지원하지 않습니다";
    case "error":
      return `❌ 오류: ${result.message}`;
  }
}

export default function InstagramShareDemo() {
  const [log, setLog] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [bridgeAvailable, setBridgeAvailable] = useState(() => isNativeBridgeAvailable());

  useEffect(() => {
    // Android's addJavascriptInterface binding can take a moment to attach
    // after the page first loads, so poll briefly instead of checking once.
    if (bridgeAvailable) return;
    const interval = setInterval(() => {
      if (isNativeBridgeAvailable()) {
        setBridgeAvailable(true);
        clearInterval(interval);
      }
    }, 250);
    const timeout = setTimeout(() => clearInterval(interval), 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [bridgeAvailable]);

  const appendLog = (line: string) => setLog((prev) => [...prev, line]);

  const runShare = async (
    label: string,
    action: () => Promise<InstagramShareResult>,
  ) => {
    setPending(true);
    appendLog(`→ ${label} 요청`);
    try {
      const result = await action();
      appendLog(describeResult(result));
    } catch (err) {
      appendLog(`❌ 예외: ${(err as Error).message}`);
    } finally {
      setPending(false);
    }
  };

  const handleWebShareFallback = async () => {
    if (!navigator.share) {
      appendLog("⚠️ 이 브라우저는 Web Share API를 지원하지 않습니다");
      return;
    }
    try {
      await navigator.share({
        title: "Instagram Share Demo",
        text: "브라우저 Web Share API 테스트",
        url: DEMO_LINK_URL,
      });
      appendLog("✅ Web Share API 공유 시트 호출됨");
    } catch (err) {
      appendLog(`⚠️ 공유 취소/실패: ${(err as Error).message}`);
    }
  };

  /**
   * No native bridge involved: navigator.share() hands the image straight to the OS
   * share sheet, which on Android already lists Instagram's Feed/Messages/Reels/Stories
   * targets (same ones InstagramBridge's generic ACTION_SEND path reaches). Requires a
   * secure context (HTTPS) and, on iOS, Instagram typically isn't registered as a share
   * target at all, so it won't show up there.
   */
  const handleWebShareImage = async () => {
    if (!navigator.share) {
      appendLog("⚠️ 이 브라우저는 Web Share API를 지원하지 않습니다");
      return;
    }
    try {
      const response = await fetch(DEMO_IMAGE_URL);
      const blob = await response.blob();
      const file = new File([blob], "share.jpg", { type: blob.type || "image/jpeg" });

      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        appendLog("⚠️ 이 브라우저는 이미지 파일 공유를 지원하지 않습니다");
        return;
      }

      await navigator.share({ files: [file], text: "이거 한번 봐봐!" });
      appendLog("✅ 네이티브 브릿지 없이 Web Share API로 공유 시트 호출됨");
    } catch (err) {
      appendLog(`⚠️ 공유 취소/실패: ${(err as Error).message}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">
        <p className="font-medium">
          네이티브 브릿지:{" "}
          {bridgeAvailable ? (
            <span className="text-green-600">감지됨</span>
          ) : (
            <span className="text-amber-600">없음 (브라우저 미리보기 모드)</span>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            runShare("스토리 공유", () =>
              shareToInstagramStory({
                imageUrl: DEMO_IMAGE_URL,
                linkUrl: DEMO_LINK_URL,
                backgroundTopColor: "#4169F5",
                backgroundBottomColor: "#1A1A2E",
              }),
            )
          }
          className="h-12 rounded-full bg-foreground px-5 text-background font-medium transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          인스타그램 스토리에 공유
        </button>

        <button
          type="button"
          disabled={pending}
          onClick={() =>
            runShare("DM 공유", () =>
              shareToInstagramDirect({
                imageUrl: DEMO_IMAGE_URL,
                text: "이거 한번 봐봐!",
              }),
            )
          }
          className="h-12 rounded-full border border-solid border-black/[.08] px-5 font-medium transition-colors hover:bg-black/[.04] disabled:opacity-50 dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          인스타그램으로 공유 (DM)
        </button>

        <button
          type="button"
          onClick={handleWebShareImage}
          className="h-12 rounded-full border border-dashed border-black/[.15] px-5 text-sm transition-colors hover:bg-black/[.04] dark:border-white/[.2] dark:hover:bg-[#1a1a1a]"
        >
          인스타그램으로 공유 (DM, 브릿지 없이)
        </button>

        <button
          type="button"
          onClick={handleWebShareFallback}
          className="h-12 rounded-full border border-dashed border-black/[.15] px-5 text-sm transition-colors hover:bg-black/[.04] dark:border-white/[.2] dark:hover:bg-[#1a1a1a]"
        >
          브라우저에서 테스트 (Web Share API, 텍스트/링크만)
        </button>
      </div>

      <div className="rounded-lg bg-black/[.03] p-4 font-mono text-xs leading-6 dark:bg-white/[.04]">
        {log.length === 0 ? (
          <p className="text-zinc-500">버튼을 눌러보세요.</p>
        ) : (
          log.map((line, i) => <p key={i}>{line}</p>)
        )}
      </div>
    </div>
  );
}
