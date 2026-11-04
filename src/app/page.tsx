import Image from "next/image";
import InstagramShareDemo from "@/components/InstagramShareDemo";

const BOOK = {
  title: "가호",
  author: "무라카미 하루키 지음 · 홍은주 옮김",
  price: "18,500원",
  productUrl: "https://product.kyobobook.co.kr/detail/S000221505184",
  coverImageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791141691370.jpg?t=2989655",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-10 bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-zinc-900">
        <div className="h-56 w-40 overflow-hidden rounded-lg shadow-md">
          <Image
            src={BOOK.coverImageUrl}
            alt={BOOK.title}
            width={160}
            height={224}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-lg font-semibold text-black dark:text-zinc-50">{BOOK.title}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{BOOK.author}</p>
          <p className="mt-1 text-base font-semibold text-black dark:text-zinc-50">{BOOK.price}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
          SNS 공유 — 네이티브 브릿지 데모
        </h2>
        <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          상품상세의 책 정보로 합성한 카드 이미지를 인스타그램 스토리/DM으로
          공유합니다. 실제 인스타그램 연동은 네이티브 컨테이너에서{" "}
          <code className="mx-1 rounded bg-black/[.06] px-1 py-0.5 dark:bg-white/[.08]">
            InstagramBridge
          </code>
          채널을 구현해야 동작합니다.
        </p>
      </div>

      <InstagramShareDemo book={BOOK} />
    </div>
  );
}
