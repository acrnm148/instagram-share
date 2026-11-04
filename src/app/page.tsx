import InstagramShareDemo from "@/components/InstagramShareDemo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Instagram Share Demo
        </h1>
        <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          웹 레이어에서 네이티브 공유 브릿지를 호출하는 데모입니다. 실제
          인스타그램 연동은 네이티브 컨테이너(Flutter/Android/iOS)에서
          <code className="mx-1 rounded bg-black/[.06] px-1 py-0.5 dark:bg-white/[.08]">
            InstagramBridge
          </code>
          채널을 구현해야 동작합니다.
        </p>
      </div>
      <InstagramShareDemo />
    </div>
  );
}
