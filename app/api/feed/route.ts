import { NextResponse } from "next/server";
import { fetchFeeds, type Article } from "@/lib/fetchFeeds";

const CACHE_TTL_MS = 10 * 60 * 1000;

let cache: { articles: Article[]; fetchedAt: number } | null = null;

export async function GET(request: Request) {
  const now = Date.now();
  const force = new URL(request.url).searchParams.has("force");

  if (!cache || force || now - cache.fetchedAt > CACHE_TTL_MS) {
    const articles = await fetchFeeds();
    cache = { articles, fetchedAt: now };
  }

  return NextResponse.json({
    articles: cache.articles,
    fetchedAt: cache.fetchedAt,
  });
}
