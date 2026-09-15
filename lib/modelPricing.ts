export interface ModelPrice {
  provider: "Anthropic" | "OpenAI" | "Google";
  name: string;
  // USD per 1 million tokens.
  inputPerMTok: number;
  outputPerMTok: number;
  contextWindow?: string;
  note?: string;
}

// Prices are USD per 1M tokens, standard paid tier (not batch/priority/flex).
//
// Every number here was checked against the provider's own pricing page or
// Anthropic's bundled model reference — none of it is written from memory,
// because model pricing moves faster than any model's training data. When
// updating, re-check the sources in PRICING_SOURCES below and bump
// PRICING_AS_OF.
export const PRICING_AS_OF = "2026-09-15";

export const PRICING_SOURCES = [
  { label: "Anthropic", url: "https://www.anthropic.com/pricing" },
  { label: "OpenAI", url: "https://openai.com/api/pricing/" },
  { label: "Google", url: "https://ai.google.dev/gemini-api/docs/pricing" },
];

export const modelPrices: ModelPrice[] = [
  // Anthropic
  {
    provider: "Anthropic",
    name: "Claude Fable 5.1",
    inputPerMTok: 10,
    outputPerMTok: 50,
    contextWindow: "1M",
  },
  {
    provider: "Anthropic",
    name: "Claude Opus 5",
    inputPerMTok: 5,
    outputPerMTok: 25,
    contextWindow: "1M",
  },
  {
    provider: "Anthropic",
    name: "Claude Sonnet 5",
    inputPerMTok: 2,
    outputPerMTok: 10,
    contextWindow: "1M",
  },
  {
    provider: "Anthropic",
    name: "Claude Haiku 4.5",
    inputPerMTok: 1,
    outputPerMTok: 5,
    contextWindow: "200K",
  },

  // OpenAI
  {
    provider: "OpenAI",
    name: "GPT-6 Astra",
    inputPerMTok: 10,
    outputPerMTok: 50,
  },
  {
    provider: "OpenAI",
    name: "GPT-5.6 Sol",
    inputPerMTok: 4,
    outputPerMTok: 20,
    note: "Promotional rate through Nov 21, 2026",
  },
  {
    provider: "OpenAI",
    name: "GPT-5.6 Terra",
    inputPerMTok: 2,
    outputPerMTok: 12,
  },
  {
    provider: "OpenAI",
    name: "GPT-5.6 Luna",
    inputPerMTok: 0.2,
    outputPerMTok: 1.2,
  },

  // Google
  {
    provider: "Google",
    name: "Gemini 3.1 Pro",
    inputPerMTok: 2,
    outputPerMTok: 12,
    note: "Preview. Rises to $4.00 / $18.00 above 200K tokens",
  },
  {
    provider: "Google",
    name: "Gemini 3.5 Flash",
    inputPerMTok: 1.5,
    outputPerMTok: 9,
  },
  {
    provider: "Google",
    name: "Gemini 3.8 Flash",
    inputPerMTok: 0.75,
    outputPerMTok: 3.75,
    note: "Introductory rate; doubles to $1.50 / $7.50 on Jan 1, 2027",
  },
  {
    provider: "Google",
    name: "Gemini 3.5 Flash-Lite",
    inputPerMTok: 0.3,
    outputPerMTok: 2.5,
  },
];

export function estimateCost(
  model: ModelPrice,
  inputTokens: number,
  outputTokens: number
): number {
  return (
    (inputTokens / 1_000_000) * model.inputPerMTok +
    (outputTokens / 1_000_000) * model.outputPerMTok
  );
}
