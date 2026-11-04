// Shared by book-share-card and book-share-sticker's ImageResponse renders — not a
// route (lives outside any route.tsx), just a JSX factory for the 760x1080 card itself.
//
// Layout mirrors Spotify's "share to story" sticker: cover art flush to the card's inner
// edges, left-aligned title/author directly under it, and a small platform wordmark row
// at the bottom — rather than the old centered, mostly-empty text card.
const CARD_WIDTH = 760;
const CARD_HEIGHT = 1080;
const PADDING = 32;
const IMAGE_WIDTH = CARD_WIDTH - PADDING * 2;
const IMAGE_HEIGHT = 820;

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
        background: "linear-gradient(165deg, #1c2333 0%, #0f1320 100%)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
        flexDirection: "column",
        padding: PADDING,
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
            objectPosition: "top",
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
          fontSize: 44,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.25,
          marginTop: 28,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#9aa3b5", marginTop: 8 }}>{author}</div>

      <div style={{ display: "flex", alignItems: "center", marginTop: 28 }}>
        <div
          style={{
            display: "flex",
            width: 28,
            height: 28,
            borderRadius: 6,
            background: "#ffd54a",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ display: "flex", fontSize: 16, fontWeight: 700, color: "#16213e" }}>교</span>
        </div>
        <span style={{ display: "flex", fontSize: 22, fontWeight: 700, color: "#ffffff", marginLeft: 10 }}>
          교보문고
        </span>
      </div>
    </div>
  );
}
