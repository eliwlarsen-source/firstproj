import type { Article } from "@/lib/fetchFeeds";
import ArticleCard from "./ArticleCard";

interface ArticleGridProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

export default function ArticleGrid({ articles, loading, error }: ArticleGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-44 animate-pulse rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-xl border border-black/10 dark:border-white/10 p-10 text-center text-neutral-500">
        No articles match your filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article) => (
        <ArticleCard key={article.link} article={article} />
      ))}
    </div>
  );
}
