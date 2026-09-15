"use client";

import { useEffect, useRef } from "react";
import {
  modelPrices,
  modelsByProvider,
  topOfLineup,
  providerOrder,
  PRICING_AS_OF,
  PRICING_SOURCES,
  type ModelPrice,
  type Provider,
} from "@/lib/modelPricing";

// Provider identity colors live here as CSS custom properties so the same
// token drives the cards, the chart bars, and the table dots, and so the
// dark steps swap with the OS theme (this app has no manual theme toggle).
const PALETTE_CSS = `
.cheatsheet {
  --p-anthropic: #eb6834;
  --p-openai: #1baf7a;
  --p-google: #2a78d6;
  --p-xai: #eda100;
  --cs-surface: #ffffff;
  --cs-plane: #f7f7f5;
}
@media (prefers-color-scheme: dark) {
  .cheatsheet {
    --p-anthropic: #d95926;
    --p-openai: #199e70;
    --p-google: #3987e5;
    --p-xai: #c98500;
    --cs-surface: #141413;
    --cs-plane: #0d0d0d;
  }
}
`;

const providerVar: Record<Provider, string> = {
  Anthropic: "var(--p-anthropic)",
  OpenAI: "var(--p-openai)",
  Google: "var(--p-google)",
  xAI: "var(--p-xai)",
};

const tierStyles: Record<ModelPrice["costTier"], string> = {
  Top: "bg-black/[0.06] dark:bg-white/15 text-neutral-800 dark:text-neutral-100",
  High: "bg-black/[0.04] dark:bg-white/10 text-neutral-700 dark:text-neutral-200",
  Balanced: "bg-black/[0.04] dark:bg-white/10 text-neutral-700 dark:text-neutral-200",
  Budget: "bg-black/[0.04] dark:bg-white/10 text-neutral-700 dark:text-neutral-200",
};

function price(model: ModelPrice): string {
  const fmt = (n: number) => (n < 1 ? `$${n.toFixed(2)}` : `$${n}`);
  return `${fmt(model.inputPerMTok)} / ${fmt(model.outputPerMTok)}`;
}

function ProviderDot({ provider }: { provider: Provider }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
      style={{ background: providerVar[provider] }}
    />
  );
}

export default function CheatSheet({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const maxContext = Math.max(...topOfLineup.map((m) => m.contextTokens));

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 sm:p-8"
      onClick={onClose}
    >
      <style>{PALETTE_CSS}</style>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cheatsheet-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="cheatsheet w-full max-w-5xl rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl outline-none my-auto"
        style={{ background: "var(--cs-surface)" }}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-2xl border-b border-black/10 dark:border-white/10 px-5 sm:px-7 py-4"
          style={{ background: "var(--cs-surface)" }}
        >
          <div>
            <h2
              id="cheatsheet-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100"
            >
              Frontier model cheat sheet
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Current text models from Anthropic, OpenAI, Google, and xAI. Snapshot:{" "}
              {PRICING_AS_OF}.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cheat sheet"
            className="shrink-0 rounded-lg border border-black/10 dark:border-white/15 px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            Close
          </button>
        </div>

        <div className="px-5 sm:px-7 py-6 space-y-8">
          <StatRow />
          <TopOfLineup />
          <TiersByProvider />
          <ContextChart maxContext={maxContext} />
          <FullTable />
          <HowToRead />
        </div>
      </div>
    </div>
  );
}

function StatRow() {
  const stats = [
    { label: "Providers", value: `${providerOrder.length} companies` },
    { label: "Models shown", value: `${modelPrices.length} total` },
    { label: "Prices as of", value: PRICING_AS_OF },
  ];
  return (
    <div className="flex flex-wrap gap-x-10 gap-y-4 rounded-xl border border-black/10 dark:border-white/10 px-5 py-4">
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {stat.label}
          </p>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 mb-4">{blurb}</p>
      {children}
    </section>
  );
}

function TopOfLineup() {
  return (
    <Section
      title="Top of each lineup"
      blurb="Each provider's highest-priced current model — generally, though not always, their most capable."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {topOfLineup.map((model) => (
          <div
            key={model.name}
            className="rounded-xl border border-black/10 dark:border-white/10 p-4 border-l-[3px]"
            style={{ borderLeftColor: providerVar[model.provider] }}
          >
            <div className="flex items-center gap-2 mb-1">
              <ProviderDot provider={model.provider} />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {model.provider}
              </span>
            </div>
            <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {model.name}
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1.5 leading-relaxed">
              {model.bestFor}
            </p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2.5 tabular-nums">
              {model.contextLabel} context · {price(model)} per 1M
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function TiersByProvider() {
  return (
    <Section
      title="Cost tiers by provider"
      blurb="Ranked by list price within each provider, most expensive first. This is a price ordering, not a vendor capability ranking."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {providerOrder.map((provider) => (
          <div key={provider}>
            <div className="flex items-center gap-2 mb-2">
              <ProviderDot provider={provider} />
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {provider}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {modelsByProvider(provider).map((model, i) => (
                <div
                  key={model.name}
                  className="rounded-lg border border-black/10 dark:border-white/10 p-3"
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ background: providerVar[provider] }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {model.name}
                      </p>
                      <span
                        className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium mt-1 ${tierStyles[model.costTier]}`}
                      >
                        {model.costTier}
                      </span>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-1.5 leading-relaxed">
                        {model.bestFor}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5 tabular-nums">
                        {model.contextLabel} · {price(model)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ContextChart({ maxContext }: { maxContext: number }) {
  return (
    <Section
      title="How much can each top model remember?"
      blurb={`Context window of each provider's top model, relative to the largest (${
        topOfLineup.find((m) => m.contextTokens === maxContext)?.contextLabel ?? ""
      }).`}
    >
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
        {providerOrder.map((provider) => (
          <span
            key={provider}
            className="inline-flex items-center gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-300"
          >
            <ProviderDot provider={provider} />
            {provider}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {[...topOfLineup]
          .sort((a, b) => b.contextTokens - a.contextTokens)
          .map((model) => (
            <div key={model.name}>
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className="text-xs text-neutral-700 dark:text-neutral-200">
                  {model.provider} · {model.name}
                </span>
                <span className="text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                  {model.contextLabel} tokens
                </span>
              </div>
              <div className="h-2.5 w-full rounded-sm bg-black/[0.05] dark:bg-white/[0.07]">
                <div
                  className="h-full rounded-r-[4px]"
                  style={{
                    width: `${(model.contextTokens / maxContext) * 100}%`,
                    background: providerVar[model.provider],
                  }}
                />
              </div>
            </div>
          ))}
      </div>
    </Section>
  );
}

function FullTable() {
  return (
    <Section
      title="Full lineup at a glance"
      blurb="Standard short-context paid-tier rates. Where a model bills differently on long requests, the note says so."
    >
      <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-black/[0.03] dark:bg-white/[0.04]">
            <tr className="text-left text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              <th className="px-3 py-2.5 font-medium">Model</th>
              <th className="px-3 py-2.5 font-medium">API id</th>
              <th className="px-3 py-2.5 font-medium">Tier</th>
              <th className="px-3 py-2.5 font-medium text-right">Context</th>
              <th className="px-3 py-2.5 font-medium text-right">Max out</th>
              <th className="px-3 py-2.5 font-medium text-right">$ / 1M</th>
              <th className="px-3 py-2.5 font-medium">Best for</th>
            </tr>
          </thead>
          <tbody>
            {modelPrices.map((model) => (
              <tr
                key={`${model.provider}-${model.name}`}
                className="border-t border-black/5 dark:border-white/5 align-top"
              >
                <td className="px-3 py-2.5">
                  <span className="flex items-center gap-2">
                    <ProviderDot provider={model.provider} />
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {model.name}
                    </span>
                  </span>
                </td>
                <td className="px-3 py-2.5 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                  {model.apiId ?? "—"}
                </td>
                <td className="px-3 py-2.5 text-neutral-600 dark:text-neutral-300">
                  {model.costTier}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums text-neutral-600 dark:text-neutral-300">
                  {model.contextLabel}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums text-neutral-500 dark:text-neutral-400">
                  {model.maxOutputLabel ?? "—"}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums text-neutral-900 dark:text-neutral-100">
                  {price(model)}
                </td>
                <td className="px-3 py-2.5 text-neutral-600 dark:text-neutral-300 max-w-[18rem]">
                  {model.bestFor}
                  {model.note && (
                    <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {model.note}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function HowToRead() {
  return (
    <div className="rounded-xl border border-blue-500/25 bg-blue-500/[0.07] px-5 py-4">
      <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
        How to read this
      </p>
      <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
        Tiers rank by list price <em>within</em> a provider — they are not a cross-company
        scoreboard, and most vendors don&apos;t publish a capability ranking we could
        faithfully reproduce. &quot;Context&quot; is the input token limit. Prices are
        standard short-context paid-tier rates as of {PRICING_AS_OF}; batch, cached-input,
        and priority rates are cheaper, and several models bill higher above a long-context
        threshold (noted per model). Anything a vendor&apos;s docs didn&apos;t state was
        left out rather than guessed. Check the source before budgeting real money:{" "}
        {PRICING_SOURCES.map((source, i) => (
          <span key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              {source.label}
            </a>
            {i < PRICING_SOURCES.length - 1 ? ", " : ""}
          </span>
        ))}
        .
      </p>
    </div>
  );
}
