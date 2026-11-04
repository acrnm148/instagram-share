import sharp from "sharp";

const FALLBACK_COLOR = "#e8e8ec";

// Downscaling an image to 1x1 and reading that pixel is a cheap, standard trick for an
// "average color" approximation — not a clustered palette like color-thief, but close
// enough to use as an ambient background behind the card (same idea as Spotify/Apple
// Music tinting a story's background from the art it's sharing).
export async function getDominantColor(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return FALLBACK_COLOR;
    const buffer = Buffer.from(await response.arrayBuffer());
    const { data } = await sharp(buffer)
      .resize(1, 1)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const [r, g, b] = data;
    return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
  } catch {
    return FALLBACK_COLOR;
  }
}
