// next/og (satori) has no built-in Korean font — without this, Korean glyphs only show
// up locally because resvg happens to fall back to whatever CJK fonts are installed on
// this machine. That fallback won't exist on a real server, so glyphs would go missing
// in production. This fetches a real font instead, subsetted to just the characters
// actually used (via Google Fonts' `text=` param) to stay well under next/og's 500KB
// per-render asset budget — a full Noto Sans KR file alone runs several MB.
const FONT_FAMILY = "Noto Sans KR";
type Weight = 400 | 700;

const cache = new Map<string, Promise<ArrayBuffer>>();

async function fetchGoogleFontFile(weight: Weight, text: string): Promise<ArrayBuffer> {
  const cacheKey = `${weight}:${text}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const promise = (async () => {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      FONT_FAMILY,
    )}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const cssRes = await fetch(cssUrl, {
      headers: {
        // Google Fonts serves plain .ttf only to older/non-woff2 user agents — satori
        // can only read ttf/otf/woff, not woff2.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
      },
    });
    const css = await cssRes.text();
    const fontUrl = css.match(/url\((https:[^)]+)\)/)?.[1];
    if (!fontUrl) throw new Error(`Google Fonts CSS had no font URL for weight ${weight}`);
    const fontRes = await fetch(fontUrl);
    return fontRes.arrayBuffer();
  })();

  cache.set(cacheKey, promise);
  return promise;
}

export async function getBookCardFonts(text: string) {
  const [regular, bold] = await Promise.all([
    fetchGoogleFontFile(400, text),
    fetchGoogleFontFile(700, text),
  ]);
  return [
    { name: FONT_FAMILY, data: regular, weight: 400 as const, style: "normal" as const },
    { name: FONT_FAMILY, data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

export { FONT_FAMILY };
