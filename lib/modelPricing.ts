export type Provider = "Anthropic" | "OpenAI" | "Google" | "xAI";

export interface ModelPrice {
  provider: Provider;
  name: string;
  apiId?: string;
  /** USD per 1M input tokens, standard (short-context) paid tier. */
  inputPerMTok: number;
  /** USD per 1M output tokens, standard (short-context) paid tier. */
  outputPerMTok: number;
  /** Numeric context window, used for the comparison chart. */
  contextTokens: number;
  contextLabel: string;
  maxOutputLabel?: string;
  costTier: "Top" | "High" | "Balanced" | "Budget";
  bestFor: string;
  /** Promo expiry, long-context tier rates, preview status, etc. */
  note?: string;
  /** Highest-priced current model from this provider. */
  isTopOfLineup?: boolean;
}

// ---------------------------------------------------------------------------
// Every number below was read off the vendor's own docs (or, for Claude, off
// Anthropic's bundled model reference) — none of it is written from memory,
// because model pricing and lineups move faster than any model's training data.
//
// Rules for whoever updates this next (including the monthly routine):
//   - If a source doesn't state a value, leave it out. Don't infer it.
//   - `costTier` ranks by list price within a provider, NOT by a vendor's
//     capability ranking — most vendors don't publish one, and inventing one
//     would be a claim we can't back up.
//   - `bestFor` quotes or paraphrases vendor-stated positioning where it
//     exists; otherwise it describes price position, which is factual.
// ---------------------------------------------------------------------------
export const PRICING_AS_OF = "2026-09-15";

export const PRICING_SOURCES = [
  { label: "Anthropic", url: "https://www.anthropic.com/pricing" },
  { label: "OpenAI", url: "https://openai.com/api/pricing/" },
  { label: "Google", url: "https://ai.google.dev/gemini-api/docs/pricing" },
  { label: "xAI", url: "https://docs.x.ai/developers/models" },
];

/**
 * Provider identity colors, from the validated categorical palette
 * (slots 1-4, fixed order). Validated in both modes against this app's
 * surfaces: all checks pass, with a light-mode contrast warning on aqua and
 * yellow — which is why every chart bar carries a visible text label and the
 * full table is always present.
 */
export const providerColors: Record<Provider, { light: string; dark: string }> = {
  Google: { light: "#2a78d6", dark: "#3987e5" },
  Anthropic: { light: "#eb6834", dark: "#d95926" },
  OpenAI: { light: "#1baf7a", dark: "#199e70" },
  xAI: { light: "#eda100", dark: "#c98500" },
};

export const providerOrder: Provider[] = ["Anthropic", "OpenAI", "Google", "xAI"];

export const modelPrices: ModelPrice[] = [
  // --- Anthropic -----------------------------------------------------------
  {
    provider: "Anthropic",
    name: "Claude Fable 5.1",
    apiId: "claude-fable-5-1",
    inputPerMTok: 10,
    outputPerMTok: 50,
    contextTokens: 1_000_000,
    contextLabel: "1M",
    maxOutputLabel: "128K",
    costTier: "Top",
    bestFor: "The most demanding reasoning and long-horizon agentic work",
    isTopOfLineup: true,
  },
  {
    provider: "Anthropic",
    name: "Claude Opus 5",
    apiId: "claude-opus-5",
    inputPerMTok: 5,
    outputPerMTok: 25,
    contextTokens: 1_000_000,
    contextLabel: "1M",
    costTier: "High",
    bestFor: "Complex coding, agents, and enterprise workflows",
  },
  {
    provider: "Anthropic",
    name: "Claude Sonnet 5",
    apiId: "claude-sonnet-5",
    inputPerMTok: 2,
    outputPerMTok: 10,
    contextTokens: 1_000_000,
    contextLabel: "1M",
    costTier: "Balanced",
    bestFor: "Daily driver — speed and quality together",
  },
  {
    provider: "Anthropic",
    name: "Claude Haiku 4.5",
    apiId: "claude-haiku-4-5",
    inputPerMTok: 1,
    outputPerMTok: 5,
    contextTokens: 200_000,
    contextLabel: "200K",
    costTier: "Budget",
    bestFor: "Quick replies and high throughput",
  },

  // --- OpenAI --------------------------------------------------------------
  {
    provider: "OpenAI",
    name: "GPT-6 Astra",
    apiId: "gpt-6-astra",
    inputPerMTok: 10,
    outputPerMTok: 50,
    contextTokens: 1_050_000,
    contextLabel: "1.05M",
    maxOutputLabel: "128K",
    costTier: "Top",
    bestFor: "Highest-priced model in OpenAI's current lineup",
    note: "Long-context requests bill at $20 / $75",
    isTopOfLineup: true,
  },
  {
    provider: "OpenAI",
    name: "GPT-5.6 Sol",
    apiId: "gpt-5.6-sol",
    inputPerMTok: 4,
    outputPerMTok: 20,
    contextTokens: 1_050_000,
    contextLabel: "1.05M",
    maxOutputLabel: "128K",
    costTier: "High",
    bestFor: "Step down from GPT-6 at roughly half the input cost",
    note: "Promotional rate through Nov 21, 2026. Long-context: $8 / $30",
  },
  {
    provider: "OpenAI",
    name: "GPT-5.6 Terra",
    apiId: "gpt-5.6-terra",
    inputPerMTok: 2,
    outputPerMTok: 12,
    contextTokens: 1_050_000,
    contextLabel: "1.05M",
    maxOutputLabel: "128K",
    costTier: "Balanced",
    bestFor: "Mid-tier option for most tasks without flagship cost",
    note: "Long-context requests bill at $4 / $18",
  },
  {
    provider: "OpenAI",
    name: "GPT-5.6 Luna",
    apiId: "gpt-5.6-luna",
    inputPerMTok: 0.2,
    outputPerMTok: 1.2,
    contextTokens: 1_050_000,
    contextLabel: "1.05M",
    maxOutputLabel: "128K",
    costTier: "Budget",
    bestFor: "Cheapest model on this board — high-volume workloads",
    note: "Long-context requests bill at $0.40 / $1.80",
  },

  // --- Google --------------------------------------------------------------
  {
    provider: "Google",
    name: "Gemini 3.1 Pro",
    apiId: "gemini-3.1-pro-preview",
    inputPerMTok: 2,
    outputPerMTok: 12,
    contextTokens: 1_048_576,
    contextLabel: "1.05M",
    maxOutputLabel: "65K",
    costTier: "Top",
    bestFor: "Advanced reasoning plus agentic and vibe coding",
    note: "Preview. Above 200K tokens: $4 / $18",
    isTopOfLineup: true,
  },
  {
    provider: "Google",
    name: "Gemini 3.5 Flash",
    apiId: "gemini-3.5-flash",
    inputPerMTok: 1.5,
    outputPerMTok: 9,
    contextTokens: 1_048_576,
    contextLabel: "1.05M",
    maxOutputLabel: "65K",
    costTier: "High",
    bestFor: "Legacy Flash model for routine high-throughput work",
  },
  {
    provider: "Google",
    name: "Gemini 3.8 Flash",
    apiId: "gemini-3.8-flash",
    inputPerMTok: 0.75,
    outputPerMTok: 3.75,
    contextTokens: 1_048_576,
    contextLabel: "1.05M",
    maxOutputLabel: "65K",
    costTier: "Balanced",
    bestFor: "Long-horizon software engineering and autonomous agents",
    note: "Introductory rate; doubles to $1.50 / $7.50 on Jan 1, 2027",
  },
  {
    provider: "Google",
    name: "Gemini 3.5 Flash-Lite",
    apiId: "gemini-3.5-flash-lite",
    inputPerMTok: 0.3,
    outputPerMTok: 2.5,
    contextTokens: 1_048_576,
    contextLabel: "1.05M",
    maxOutputLabel: "65K",
    costTier: "Budget",
    bestFor: "Fastest, most cost-effective model in the 3.5 family",
  },

  // --- xAI -----------------------------------------------------------------
  {
    provider: "xAI",
    name: "Grok 4.6",
    apiId: "grok-4.6",
    inputPerMTok: 2,
    outputPerMTok: 6,
    contextTokens: 500_000,
    contextLabel: "500K",
    costTier: "Top",
    bestFor: "xAI's pick for both code and chat — their most capable",
    note: "At/above 200K prompt tokens: $4 / $12",
    isTopOfLineup: true,
  },
  {
    provider: "xAI",
    name: "Grok 4.5",
    apiId: "grok-4.5",
    inputPerMTok: 2,
    outputPerMTok: 6,
    contextTokens: 500_000,
    contextLabel: "500K",
    costTier: "High",
    bestFor: "Prior generation at the same list price as 4.6",
    note: "At/above 200K prompt tokens: $4 / $12",
  },
  {
    provider: "xAI",
    name: "Grok 4.3",
    apiId: "grok-4.3",
    inputPerMTok: 1.25,
    outputPerMTok: 2.5,
    contextTokens: 1_000_000,
    contextLabel: "1M",
    costTier: "Balanced",
    bestFor: "Twice the context of 4.6, at a lower price",
    note: "At/above 200K prompt tokens: $2.50 / $5",
  },
  {
    provider: "xAI",
    name: "Grok Build 0.1",
    apiId: "grok-build-0.1",
    inputPerMTok: 1,
    outputPerMTok: 2,
    contextTokens: 256_000,
    contextLabel: "256K",
    costTier: "Budget",
    bestFor: "Cheapest output pricing in xAI's lineup",
    note: "At/above 200K prompt tokens: $2 / $4",
  },
];

export function modelsByProvider(provider: Provider): ModelPrice[] {
  return modelPrices.filter((m) => m.provider === provider);
}

export const topOfLineup = modelPrices.filter((m) => m.isTopOfLineup);
