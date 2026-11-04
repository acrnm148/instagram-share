import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { BookCard, BRAND_TEXT, FALLBACK_TEXT } from "../_shared/BookCard";
import { getDominantColor } from "../_shared/dominantColor";
import { getBookCardFonts } from "../_shared/fonts";

const WIDTH = 1080;
const HEIGHT = 1920;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "달러구트 꿈 백화점";
  const author = searchParams.get("author") ?? "이미예 지음";
  const cover = searchParams.get("cover");
  const [background, fonts] = await Promise.all([
    cover ? getDominantColor(cover) : Promise.resolve("#e8e8ec"),
    getBookCardFonts(`${title}${author}${BRAND_TEXT}${FALLBACK_TEXT}`),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background,
          fontFamily: "sans-serif",
        }}
      >
        <BookCard title={title} author={author} cover={cover} />
      </div>
    ),
    { width: WIDTH, height: HEIGHT, fonts },
  );
}
