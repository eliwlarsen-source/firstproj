import { aiTools, type AiTool } from "./aiTools";

export interface ToolMatch {
  tool: AiTool;
  score: number;
  matchedKeywords: string[];
}

const FALLBACK_TOOL_NAMES = ["Claude", "ChatGPT", "Perplexity"];

function scoreTool(tool: AiTool, input: string): ToolMatch {
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

export function matchTools(rawInput: string, limit = 3): ToolMatch[] {
  const input = rawInput.trim().toLowerCase();
  if (!input) return [];

  const scored = aiTools.map((tool) => scoreTool(tool, input));
  const ranked = scored.filter((m) => m.score > 0).sort((a, b) => b.score - a.score);

  if (ranked.length > 0) return ranked.slice(0, limit);

  // No keyword matched anything specific — fall back to strong
  // general-purpose picks rather than showing nothing.
  return FALLBACK_TOOL_NAMES.map((name) => aiTools.find((t) => t.name === name))
    .filter((t): t is AiTool => Boolean(t))
    .map((tool) => ({ tool, score: 0, matchedKeywords: [] }));
}
