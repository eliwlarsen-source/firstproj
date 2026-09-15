import { aiTools, type AiTool } from "./aiTools";

export interface ToolMatch {
  tool: AiTool;
  score: number;
  matchedKeywords: string[];
  reason: string;
}

const FALLBACK_TOOL_NAMES = ["Claude", "ChatGPT", "Perplexity"];

function scoreTool(tool: AiTool, input: string): { tool: AiTool; score: number; matchedKeywords: string[] } {
  const matchedKeywords: string[] = [];
  let score = 0;

  for (const keyword of tool.keywords) {
    if (input.includes(keyword)) {
      // Multi-word phrases are more specific than single words, so they
      // count for more.
      score += keyword.includes(" ") ? 3 : 1;
      matchedKeywords.push(keyword);
    }
  }

  // Small boost if the tool's own name or category is mentioned directly.
  if (input.includes(tool.name.toLowerCase())) score += 2;

  return { tool, score, matchedKeywords };
}

function buildReason(tool: AiTool, matchedKeywords: string[], isFallback: boolean): string {
  if (isFallback) {
    return `Nothing in the list specifically matched what you typed, so this is one of our go-to general picks — strong for ${tool.bestFor.toLowerCase()}.`;
  }

  // Cite the most specific matched keywords first (multi-word phrases beat
  // single words), so the reason points at what actually drove the match.
  const phrases = matchedKeywords.filter((k) => k.includes(" "));
  const words = matchedKeywords.filter((k) => !k.includes(" "));
  const cited = (phrases.length > 0 ? phrases : words).slice(0, 2);
  const citedText = cited.map((k) => `"${k}"`).join(" and ");

  return `You mentioned ${citedText} — ${tool.name} is built for exactly that: ${tool.bestFor.toLowerCase()}.`;
}

export function matchTools(rawInput: string, limit = 3): ToolMatch[] {
  const input = rawInput.trim().toLowerCase();
  if (!input) return [];

  const scored = aiTools.map((tool) => scoreTool(tool, input));
  const ranked = scored.filter((m) => m.score > 0).sort((a, b) => b.score - a.score);

  if (ranked.length > 0) {
    return ranked
      .slice(0, limit)
      .map((m) => ({ ...m, reason: buildReason(m.tool, m.matchedKeywords, false) }));
  }

  // No keyword matched anything specific — fall back to strong
  // general-purpose picks rather than showing nothing.
  return FALLBACK_TOOL_NAMES.map((name) => aiTools.find((t) => t.name === name))
    .filter((t): t is AiTool => Boolean(t))
    .map((tool) => ({
      tool,
      score: 0,
      matchedKeywords: [],
      reason: buildReason(tool, [], true),
    }));
}
