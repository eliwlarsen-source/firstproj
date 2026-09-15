export type SourceCategory = "Research" | "Product" | "News";

export interface FeedSource {
  name: string;
  url: string;
  category: SourceCategory;
}

// Curated list of AI-focused RSS feeds. Add or remove entries here to
// change what shows up on the dashboard.
//
// Note: some well-known outlets (e.g. The Verge, Ars Technica, Wired,
// Reddit) block automated RSS fetches from server-side clients with a
// 403, and Anthropic doesn't publish a public RSS feed at all, so
// they're intentionally left out. Every source below was verified to
// return parseable items from a server-side fetch.
export const sources: FeedSource[] = [
  {
    name: "OpenAI",
    url: "https://openai.com/news/rss.xml",
    category: "Research",
  },
  {
    name: "Google AI",
    url: "https://blog.google/technology/ai/rss/",
    category: "Research",
  },
  {
    name: "DeepMind",
    url: "https://deepmind.google/blog/rss.xml",
    category: "Research",
  },
  {
    name: "Hugging Face",
    url: "https://huggingface.co/blog/feed.xml",
    category: "Product",
  },
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "News",
  },
  {
    name: "MIT Tech Review",
    url: "https://www.technologyreview.com/topic/artificial-intelligence/feed",
    category: "News",
  },
  {
    name: "VentureBeat AI",
    url: "https://venturebeat.com/category/ai/feed/",
    category: "Product",
  },
  {
    name: "Hacker News (AI)",
    url: "https://hnrss.org/newest?q=AI+OR+LLM+OR+%22machine+learning%22",
    category: "Product",
  },
];
