import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// Card-only, transparent-background render meant to be shared as an Instagram Story
// "interactive sticker" asset (interactive_asset_uri / com.instagram.sharedSticker.stickerImage)
// rather than a full-bleed background — this is what makes it draggable/resizable in
// Instagram's own story editor, the same way Spotify shares its "now playing" card.
const WIDTH = 760;
const HEIGHT = 1080;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "달러구트 꿈 백화점";
  const author = searchParams.get("author") ?? "이미예 지음";
  const price = searchParams.get("price") ?? "14,800원";
  const cover = searchParams.get("cover");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          borderRadius: 24,
          background: "linear-gradient(135deg, #3a5a8c 0%, #16213e 100%)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 56,
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- next/og renders via satori, not next/image
          <img
            src={cover}
            alt=""
            width={420}
            height={620}
            style={{
              width: 420,
              height: 620,
              objectFit: "cover",
              borderRadius: 12,
              boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
              marginBottom: 36,
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              fontSize: 28,
              letterSpacing: 6,
              color: "#9fb4d8",
              marginBottom: 28,
            }}
          >
            BESTSELLER
          </div>
        )}
        <div
          style={{
            display: "flex",
            fontSize: cover ? 48 : 64,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#c7d3ea",
            marginTop: 16,
          }}
        >
          {author}
        </div>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#ffffff", marginTop: 40 }}>
          {price}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            fontWeight: 700,
            color: "#ffd54a",
            marginTop: 20,
            letterSpacing: 2,
          }}
        >
          교보문고
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  );
}
