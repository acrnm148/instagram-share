import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

const WIDTH = 1080;
const HEIGHT = 1920;

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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #1b2a4a 0%, #0c1222 70%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 760,
            height: 1080,
            borderRadius: 24,
            background: "linear-gradient(135deg, #3a5a8c 0%, #16213e 100%)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 56,
            textAlign: "center",
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
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 72,
          }}
        >
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#ffffff" }}>
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
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  );
}
