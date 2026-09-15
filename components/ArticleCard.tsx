import type { Article } from "@/lib/fetchFeeds";

const categoryColors: Record<string, string> = {
  Research: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  Product: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  News: "bg-sky-500/15 text-sky-300 border-sky-500/30",
};

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function ArticleCard({ article }: { article: Article }) {
  const badgeClass =
    categoryColors[article.category] ??
    "bg-neutral-500/15 text-neutral-300 border-neutral-500/30";

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-5 transition hover:border-black/20 dark:hover:border-white/20 hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className={`rounded-full border px-2 py-0.5 font-medium ${badgeClass}`}>
          {article.category}
        </span>
        <span className="text-neutral-500 dark:text-neutral-400">
          {timeAgo(article.publishedAt)}
        </span>
      </div>

      <h3 className="text-base font-semibold leading-snug text-neutral-900 dark:text-neutral-100 group-hover:underline decoration-1 underline-offset-2">
        {article.title}
      </h3>

      {article.snippet && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
          {article.snippet}
        </p>
      )}

      <span className="mt-auto text-xs font-medium text-neutral-500 dark:text-neutral-500">
        {article.source}
      </span>
    </a>
  );
}
