"use client";

import { useMemo, useState } from "react";
import {
  modelPrices,
  estimateCost,
  providerColors,
  PRICING_AS_OF,
  PRICING_SOURCES,
  type ModelPrice,
} from "@/lib/modelPricing";
import CheatSheet from "@/components/CheatSheet";

const PRESETS = [
  { label: "A short chat", input: 1_000, output: 500 },
  { label: "A long document", input: 100_000, output: 2_000 },
  { label: "1M in / 100K out", input: 1_000_000, output: 100_000 },
];

const PROVIDER_CSS = `
.pricing-table {
  --p-anthropic: ${providerColors.Anthropic.light};
  --p-openai: ${providerColors.OpenAI.light};
  --p-google: ${providerColors.Google.light};
  --p-xai: ${providerColors.xAI.light};
}
@media (prefers-color-scheme: dark) {
  .pricing-table {
    --p-anthropic: ${providerColors.Anthropic.dark};
    --p-openai: ${providerColors.OpenAI.dark};
    --p-google: ${providerColors.Google.dark};
    --p-xai: ${providerColors.xAI.dark};
  }
}
`;

const providerVar: Record<string, string> = {
  Anthropic: "var(--p-anthropic)",
  OpenAI: "var(--p-openai)",
  Google: "var(--p-google)",
  xAI: "var(--p-xai)",
};

function formatCost(cost: number): string {
  if (cost === 0) return "$0";
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  if (cost < 1) return `$${cost.toFixed(3)}`;
  return `$${cost.toFixed(2)}`;
}

function formatRate(rate: number): string {
  return `$${rate.toFixed(2)}`;
}

export default function PricingPage() {
  const [inputTokens, setInputTokens] = useState(100_000);
  const [outputTokens, setOutputTokens] = useState(2_000);
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);

  const rows = useMemo(() => {
    return modelPrices
      .map((model) => ({
        model,
        cost: estimateCost(model, inputTokens, outputTokens),
      }))
      .sort((a, b) => a.cost - b.cost);
  }, [inputTokens, outputTokens]);

  const cheapest = rows[0]?.cost ?? 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-4xl px-4 sm:px-8 py-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Token pricing by model
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              What each model costs per million tokens, and what your workload would cost on
              each one.
            </p>
          </div>
          <button
            onClick={() => setCheatSheetOpen(true)}
            className="shrink-0 self-start rounded-lg bg-neutral-900 dark:bg-neutral-100 px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:opacity-90 transition"
          >
            Cheat sheet
          </button>
        </div>

        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] p-5 mb-6">
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-3">
            Estimate your cost
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Input tokens
              </span>
              <input
                type="number"
                min={0}
                step={1000}
                value={inputTokens}
                onChange={(e) => setInputTokens(Math.max(0, Number(e.target.value) || 0))}
                className="rounded-lg border border-black/10 dark:border-white/15 bg-white dark:bg-white/[0.04] px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Output tokens
              </span>
              <input
                type="number"
                min={0}
                step={500}
                value={outputTokens}
                onChange={(e) => setOutputTokens(Math.max(0, Number(e.target.value) || 0))}
                className="rounded-lg border border-black/10 dark:border-white/15 bg-white dark:bg-white/[0.04] px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setInputTokens(preset.input);
                  setOutputTokens(preset.output);
                }}
                className="rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <style>{PROVIDER_CSS}</style>
        <div className="pricing-table overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.03] dark:bg-white/[0.04]">
              <tr className="text-left text-xs text-neutral-500 dark:text-neutral-400">
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium text-right">In $/1M</th>
                <th className="px-4 py-3 font-medium text-right">Out $/1M</th>
                <th className="px-4 py-3 font-medium text-right">Context</th>
                <th className="px-4 py-3 font-medium text-right">Your cost</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ model, cost }) => (
                <PricingRow
                  key={`${model.provider}-${model.name}`}
                  model={model}
                  cost={cost}
                  isCheapest={cost === cheapest}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
          <p>
            Standard paid-tier rates as of {PRICING_AS_OF}. Batch, priority, and cached-input
            rates are cheaper and aren&apos;t shown here. Prices change often — check the
            source before budgeting anything real:{" "}
            {PRICING_SOURCES.map((source, i) => (
              <span key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  {source.label}
                </a>
                {i < PRICING_SOURCES.length - 1 ? ", " : ""}
              </span>
            ))}
            .
          </p>
        </div>
      </main>

      {cheatSheetOpen && <CheatSheet onClose={() => setCheatSheetOpen(false)} />}
    </div>
  );
}

function PricingRow({
  model,
  cost,
  isCheapest,
}: {
  model: ModelPrice;
  cost: number;
  isCheapest: boolean;
}) {
  return (
    <tr className="border-t border-black/5 dark:border-white/5">
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: providerVar[model.provider] }}
          />
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {model.name}
          </span>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
            {model.provider}
          </span>
        </div>
        {model.note && (
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            {model.note}
          </p>
        )}
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-neutral-600 dark:text-neutral-300">
        {formatRate(model.inputPerMTok)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-neutral-600 dark:text-neutral-300">
        {formatRate(model.outputPerMTok)}
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-neutral-500 dark:text-neutral-400">
        {model.contextLabel}
      </td>
      <td className="px-4 py-3 text-right">
        <span
          className={`tabular-nums font-medium ${
            isCheapest
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-neutral-900 dark:text-neutral-100"
          }`}
        >
          {formatCost(cost)}
        </span>
      </td>
    </tr>
  );
}
