import { readFileSync } from "node:fs";
import { join } from "node:path";

// Shared by book-share-card and book-share-sticker's ImageResponse renders — not a
// route (lives outside any route.tsx), just a JSX factory for the 760x1080 card itself.
//
// Layout mirrors Spotify's "share to story" sticker: cover art flush to the card's inner
// edges, left-aligned title/author directly under it, and a small platform logo badge
// at the bottom — rather than the old centered, mostly-empty text card.
const CARD_WIDTH = 760;
const CARD_HEIGHT = 1080;
const PADDING = 32;
// Korean book covers run ~400:578 (width:height) — kept smaller than the card's full
// inner width now, at that same ratio, instead of stretching/cropping to fill it.
const IMAGE_WIDTH = 420;
const IMAGE_HEIGHT = Math.round((IMAGE_WIDTH * 578) / 400);

// satori can't read local files by path, so the logo is inlined as a data URI.
const LOGO_DATA_URI = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public", "kyobo-logo.png"),
).toString("base64")}`;

export function BookCard({
  title,
  author,
  cover,
}: {
  title: string;
  author: string;
  cover: string | null;
}) {
  return (
    <div
      style={{
        display: "flex",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 28,
        background: "#121212",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: PADDING,
        textAlign: "center",
      }}
    >
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element -- next/og renders via satori, not next/image
        <img
          src={cover}
          alt=""
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          style={{
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            objectFit: "contain",
            borderRadius: 12,
            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
          }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            borderRadius: 16,
            background: "linear-gradient(135deg, #3a5a8c 0%, #16213e 100%)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#9fb4d8" }}>
            BESTSELLER
          </span>
        </div>
      )}

      <div
        style={{
          display: "flex",
          maxWidth: CARD_WIDTH - PADDING * 2,
          justifyContent: "center",
          fontSize: 64,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.25,
          marginTop: 36,
          textAlign: "center",
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          maxWidth: CARD_WIDTH - PADDING * 2,
          justifyContent: "center",
          fontSize: 28,
          color: "#b3b3b3",
          marginTop: 10,
          textAlign: "center",
        }}
      >
        {author}
      </div>

      {/* Logo PNG has an opaque white background, so it needs its own white badge to read
          cleanly on this dark card. */}
      <div
        style={{
          display: "flex",
          width: 76,
          height: 76,
          borderRadius: 16,
          background: "#ffffff",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 36,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders via satori, not next/image */}
        <img src={LOGO_DATA_URI} alt="" width={56} height={56} style={{ width: 56, height: 56 }} />
      </div>
    </div>
  );
}
