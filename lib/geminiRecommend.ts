import { aiTools } from "./aiTools";
import { getCachedArticles } from "./fetchFeeds";

// "-latest" alias so this keeps pointing at Google's current
// recommended fast model rather than a version that goes stale.
// Using the lite variant: it's reliably available on the free tier and
// fast, whereas the full flash-latest alias was consistently 503'ing
// under load for prompts of this size when this was last checked.
const MODEL = "gemini-flash-lite-latest";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export interface GeminiRecommendation {
  name: string;
  reason: string;
}

export interface GeminiRecommendResult {
  primary: GeminiRecommendation;
  alternatives: GeminiRecommendation[];
}

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    primary: {
      type: "object",
      properties: {
        name: { type: "string" },
        reason: { type: "string" },
      },
      required: ["name", "reason"],
    },
    alternatives: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          reason: { type: "string" },
        },
        required: ["name", "reason"],
      },
      maxItems: 2,
    },
  },
  required: ["primary", "alternatives"],
};

function buildPrompt(query: string, headlines: string[]): string {
  const toolList = aiTools.map((t) => `- ${t.name} (${t.category}): ${t.bestFor}`).join("\n");

  const headlineBlock =
    headlines.length > 0
      ? `Recent AI news headlines, for context on anything that just launched or changed (only use if actually relevant to this task):\n${headlines.map((h) => `- ${h}`).join("\n")}\n\n`
      : "";

  return `You are recommending the single best current AI tool for a specific task someone describes. Be genuinely thoughtful and specific to their situation, not generic.

Reference list of tools with verified links we can offer (prefer one of these when it's a good fit):
${toolList}

${headlineBlock}You may recommend a tool outside this reference list if you're confident it's real and clearly the better fit, but prefer the list when something on it genuinely works well.

Task: "${query}"

Give the single best primary recommendation, plus up to 2 solid alternatives only if there's real ambiguity worth mentioning (an empty array is fine when the primary pick is clearly best). Each reason should be 1-2 sentences explaining why THIS tool fits THIS specific task — reference concrete details from what they described rather than restating a generic tagline.`;
}

async function callGemini(apiKey: string, prompt: string): Promise<Response> {
  return fetch(`${API_BASE}/${MODEL}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    }),
    signal: AbortSignal.timeout(20_000),
  });
}

export async function getGeminiRecommendation(query: string): Promise<GeminiRecommendResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  let headlines: string[] = [];
  try {
    const { articles } = await getCachedArticles();
    headlines = articles.slice(0, 12).map((a) => `${a.title} (${a.source})`);
  } catch {
    // News grounding is a nice-to-have; proceed without it.
  }

  const prompt = buildPrompt(query, headlines);

  let res = await callGemini(apiKey, prompt);
  if (res.status === 503) {
    // Transient "model overloaded" — worth one quick retry before we
    // give up and fall back to local matching.
    await new Promise((r) => setTimeout(r, 1000));
    res = await callGemini(apiKey, prompt);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gemini API error ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no content");

  const parsed = JSON.parse(text) as GeminiRecommendResult;
  if (!parsed.primary?.name || !parsed.primary?.reason) {
    throw new Error("Gemini response missing required fields");
  }

  return {
    primary: parsed.primary,
    alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives.slice(0, 2) : [],
  };
}
