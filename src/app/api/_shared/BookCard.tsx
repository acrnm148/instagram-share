import { readFileSync } from "node:fs";
import { join } from "node:path";

// Shared by book-share-card and book-share-sticker's ImageResponse renders — not a
// route (lives outside any route.tsx), just a JSX factory for the card itself.
//
// Layout mirrors Spotify's "share to story" sticker: cover art flush to the card's
// inner edges at its own natural proportions (no cropping/stretching to a fixed box),
// so the card's overall shape follows the book cover's — tall and narrow, not square.
const CARD_WIDTH = 760;
const PADDING = 32;

// Korean book covers run ~400:578 (width:height) — the card is exactly this ratio at
// its full inner width, rather than force-cropping into an arbitrary box shape.
const IMAGE_WIDTH = CARD_WIDTH - PADDING * 2;
const IMAGE_HEIGHT = Math.round((IMAGE_WIDTH * 578) / 400);

const TITLE_SIZE = 64;
const TITLE_HEIGHT = Math.round(TITLE_SIZE * 1.25);
const AUTHOR_SIZE = 28;
const AUTHOR_HEIGHT = Math.round(AUTHOR_SIZE * 1.3);
const LOGO_BADGE = 76;
const GAP_AFTER_IMAGE = 36;
const GAP_AFTER_TITLE = 10;
const GAP_AFTER_AUTHOR = 36;

// Precomputed so the ImageResponse canvas is sized exactly to its content — satori
// renders to a fixed-size raster, it can't size the canvas to content automatically.
export const CARD_HEIGHT =
  PADDING * 2 +
  IMAGE_HEIGHT +
  GAP_AFTER_IMAGE +
  TITLE_HEIGHT +
  GAP_AFTER_TITLE +
  AUTHOR_HEIGHT +
  GAP_AFTER_AUTHOR +
  LOGO_BADGE;

export { CARD_WIDTH };

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
            objectFit: "cover",
            borderRadius: 16,
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
          maxWidth: IMAGE_WIDTH,
          justifyContent: "center",
          fontSize: TITLE_SIZE,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.25,
          marginTop: GAP_AFTER_IMAGE,
          textAlign: "center",
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          maxWidth: IMAGE_WIDTH,
          justifyContent: "center",
          fontSize: AUTHOR_SIZE,
          color: "#b3b3b3",
          marginTop: GAP_AFTER_TITLE,
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
          width: LOGO_BADGE,
          height: LOGO_BADGE,
          borderRadius: 16,
          background: "#ffffff",
          alignItems: "center",
          justifyContent: "center",
          marginTop: GAP_AFTER_AUTHOR,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders via satori, not next/image */}
        <img src={LOGO_DATA_URI} alt="" width={56} height={56} style={{ width: 56, height: 56 }} />
      </div>
    </div>
  );
}
