import { FONT_FAMILY } from "./fonts";

// Shared by book-share-card and book-share-sticker's ImageResponse renders — not a
// route (lives outside any route.tsx), just a JSX factory for the card itself.
//
// Layout mirrors Spotify's "share to story" sticker: cover art flush to the card's
// inner edges at its own natural proportions (no cropping/stretching to a fixed box),
// so the card's overall shape follows the book cover's — tall and narrow, not square.
const CARD_WIDTH = 480;
const PADDING = 24;

// Korean book covers run ~400:578 (width:height) — the card is exactly this ratio at
// its full inner width, rather than force-cropping into an arbitrary box shape.
const IMAGE_WIDTH = CARD_WIDTH - PADDING * 2;
const IMAGE_HEIGHT = Math.round((IMAGE_WIDTH * 578) / 400);

const TITLE_SIZE = 40;
const TITLE_HEIGHT = Math.round(TITLE_SIZE * 1.25);
const AUTHOR_SIZE = 18;
const AUTHOR_HEIGHT = Math.round(AUTHOR_SIZE * 1.3);
const BRAND_SIZE = 16;
const BRAND_HEIGHT = Math.round(BRAND_SIZE * 1.3);
const GAP_AFTER_IMAGE = 22;
const GAP_AFTER_TITLE = 6;
const GAP_AFTER_AUTHOR = 18;

const BRAND_TEXT = "교보문고";
const FALLBACK_TEXT = "BESTSELLER";

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
  BRAND_HEIGHT;

export { CARD_WIDTH, BRAND_TEXT, FALLBACK_TEXT };

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
        // Semi-transparent, not flat black — the ambient color behind it (the cover's
        // own dominant color, set by the caller) shows through, like Spotify's tinted
        // dark card rather than an opaque box unrelated to the art.
        background: "rgba(0,0,0,0.72)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: PADDING,
        fontFamily: FONT_FAMILY,
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
          <span style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#9fb4d8" }}>
            {FALLBACK_TEXT}
          </span>
        </div>
      )}

      <div
        style={{
          display: "flex",
          maxWidth: IMAGE_WIDTH,
          fontSize: TITLE_SIZE,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.25,
          marginTop: GAP_AFTER_IMAGE,
          textAlign: "left",
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          maxWidth: IMAGE_WIDTH,
          fontSize: AUTHOR_SIZE,
          fontWeight: 400,
          color: "#b3b3b3",
          marginTop: GAP_AFTER_TITLE,
          textAlign: "left",
        }}
      >
        {author}
      </div>

      <div
        style={{
          display: "flex",
          fontSize: BRAND_SIZE,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: 1,
          marginTop: GAP_AFTER_AUTHOR,
        }}
      >
        {BRAND_TEXT}
      </div>
    </div>
  );
}
