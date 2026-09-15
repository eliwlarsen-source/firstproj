import { NextResponse } from "next/server";
import { getCachedArticles } from "@/lib/fetchFeeds";

export async function GET(request: Request) {
  const force = new URL(request.url).searchParams.has("force");
  const { articles, fetchedAt } = await getCachedArticles(force);
  return NextResponse.json({ articles, fetchedAt });
}
