import Parser from "rss-parser";
import { sources } from "./sources";

export interface Article {
  title: string;
  link: string;
  source: string;
  category: string;
  publishedAt: string | null;
  snippet: string;
}

const parser = new Parser({
  timeout: 10_000,
  headers: { "User-Agent": "Mozilla/5.0 (AI News Dashboard)" },
});

// Some feeds (e.g. full blog archives) return hundreds of items; cap
// each source so one feed can't dominate the merged list.
const MAX_ITEMS_PER_SOURCE = 25;

function stripHtml(html: string | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    // hnrss.org content is just "Article URL: ... Comments URL: ..."
    // boilerplate rather than a real summary — drop it.
    .replace(/Article URL:\s*\S+\s*/i, "")
    .replace(/Comments URL:\s*\S+\s*/i, "")
    .replace(/Points:\s*\d+\s*/i, "")
    .replace(/#\s*Comments:\s*\d+\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchFeeds(): Promise<Article[]> {
  const results = await Promise.allSettled(
    sources.map(async (source) => {
      const feed = await parser.parseURL(source.url);
      return (feed.items ?? []).slice(0, MAX_ITEMS_PER_SOURCE).map((item): Article => ({
        title: item.title ?? "(untitled)",
        link: item.link ?? "",
        source: source.name,
        category: source.category,
        publishedAt: item.isoDate ?? item.pubDate ?? null,
        snippet: stripHtml(item.contentSnippet ?? item.content).slice(0, 220),
      }));
    })
  );

  const articles = results
    .filter((r): r is PromiseFulfilledResult<Article[]> => r.status === "fulfilled")
    .flatMap((r) => r.value)
    .filter((a) => a.link);

  const seen = new Set<string>();
  const deduped = articles.filter((a) => {
    if (seen.has(a.link)) return false;
    seen.add(a.link);
    return true;
  });

  deduped.sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  });

  return deduped;
}
