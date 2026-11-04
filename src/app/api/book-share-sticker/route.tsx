import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { BookCard, CARD_WIDTH, CARD_HEIGHT } from "../_shared/BookCard";

// Card-only, transparent-background render meant to be shared as an Instagram Story
// "interactive sticker" asset (interactive_asset_uri / com.instagram.sharedSticker.stickerImage)
// rather than a full-bleed background — this is what makes it draggable/resizable in
// Instagram's own story editor, the same way Spotify shares its "now playing" card.

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "달러구트 꿈 백화점";
  const author = searchParams.get("author") ?? "이미예 지음";
  const cover = searchParams.get("cover");

  return new ImageResponse(<BookCard title={title} author={author} cover={cover} />, {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  });
}
