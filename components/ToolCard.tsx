import type { Recommendation } from "@/lib/resolveRecommendation";

export interface NewsMention {
  title: string;
  link: string;
}

interface ToolCardProps {
  recommendation: Recommendation;
  rank: number;
  newsMention?: NewsMention;
}

export default function ToolCard({ recommendation, rank, newsMention }: ToolCardProps) {
  const { name, url, category, description, bestFor, reason, inCuratedList } = recommendation;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 dark:bg-neutral-100 text-xs font-bold text-white dark:text-neutral-900">
            {rank}
          </span>
          <div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 hover:underline"
            >
              {name}
            </a>
            {category && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{category}</p>
            )}
          </div>
        </div>
        {newsMention && (
          <a
            href={newsMention.link}
            target="_blank"
            rel="noopener noreferrer"
            title={newsMention.title}
            className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-300 hover:bg-amber-500/25 transition"
          >
            In today&apos;s news
          </a>
        )}
      </div>

      {description && (
        <p className="text-sm text-neutral-700 dark:text-neutral-300">{description}</p>
      )}

      {bestFor && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          <span className="font-medium text-neutral-600 dark:text-neutral-300">Best for: </span>
          {bestFor}
        </p>
      )}

      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.07] px-3 py-2">
        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-0.5">
          Why this pick
        </p>
        <p className="text-sm text-neutral-700 dark:text-neutral-300">{reason}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/15 px-3 py-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 transition"
        >
          {inCuratedList ? `Go to ${name}` : `Search for ${name}`}
          <span aria-hidden="true">→</span>
        </a>
        {!inCuratedList && (
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Not in our curated list, so this links to a search rather than a site we&apos;ve
            verified.
          </span>
        )}
      </div>
    </div>
  );
}
