import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { BookCard } from "../_shared/BookCard";

const WIDTH = 1080;
const HEIGHT = 1920;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "달러구트 꿈 백화점";
  const author = searchParams.get("author") ?? "이미예 지음";
  const cover = searchParams.get("cover");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #1b2a4a 0%, #0c1222 70%)",
          fontFamily: "sans-serif",
        }}
      >
        <BookCard title={title} author={author} cover={cover} />
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  );
}
