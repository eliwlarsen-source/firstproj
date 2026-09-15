interface HeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
  lastUpdated: number | null;
}

export default function Header({ onRefresh, refreshing, lastUpdated }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          AI Pulse
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          The latest AI tools, launches, and research — all in one place.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {lastUpdated && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Updated {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="rounded-full border border-black/10 dark:border-white/15 px-4 py-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-50 transition"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
    </header>
  );
}
