import { NextResponse } from "next/server";
import { getGeminiRecommendation } from "@/lib/geminiRecommend";

const MAX_QUERY_LENGTH = 300;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const query = (body as { query?: unknown })?.query;
  if (typeof query !== "string" || query.trim() === "") {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const trimmedQuery = query.trim().slice(0, MAX_QUERY_LENGTH);

  try {
    const result = await getGeminiRecommendation(trimmedQuery);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Gemini recommendation failed:", err);
    return NextResponse.json({ error: "Recommendation service unavailable" }, { status: 502 });
  }
}
