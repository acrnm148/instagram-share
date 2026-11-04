import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDominantColor } from "../_shared/dominantColor";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cover = searchParams.get("cover");
  if (!cover) {
    return NextResponse.json({ error: "cover query param is required" }, { status: 400 });
  }

  const color = await getDominantColor(cover);
  return NextResponse.json({ color });
}
