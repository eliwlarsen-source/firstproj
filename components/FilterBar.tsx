interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  sourceNames: string[];
  selectedSource: string | null;
  onSourceChange: (source: string | null) => void;
}

export default function FilterBar({
  search,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  sourceNames,
  selectedSource,
  onSourceChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search articles…"
        className="w-full rounded-lg border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.03] px-4 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Chip label="All categories" active={selectedCategory === null} onClick={() => onCategoryChange(null)} />
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            active={selectedCategory === category}
            onClick={() => onCategoryChange(category)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip label="All sources" active={selectedSource === null} onClick={() => onSourceChange(null)} />
        {sourceNames.map((source) => (
          <Chip
            key={source}
            label={source}
            active={selectedSource === source}
            onClick={() => onSourceChange(source)}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? "border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
          : "border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}
