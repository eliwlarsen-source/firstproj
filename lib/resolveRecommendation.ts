import { aiTools } from "./aiTools";

export interface Recommendation {
  name: string;
  url: string;
  category?: string;
  description?: string;
  bestFor?: string;
  reason: string;
  inCuratedList: boolean;
}

// Gemini is asked to prefer names from our curated list, so an exact
// (case-insensitive) match is the common case. When it recommends
// something outside the list, we don't guess a destination URL for it —
// link to a search instead rather than risk pointing at the wrong site.
export function resolveRecommendation(name: string, reason: string): Recommendation {
  const normalized = name.trim().toLowerCase();
  const tool = aiTools.find((t) => t.name.toLowerCase() === normalized);

  if (tool) {
    return {
      name: tool.name,
      url: tool.url,
      category: tool.category,
      description: tool.description,
      bestFor: tool.bestFor,
      reason,
      inCuratedList: true,
    };
  }

  return {
    name,
    url: `https://www.google.com/search?q=${encodeURIComponent(name)}`,
    reason,
    inCuratedList: false,
  };
}
