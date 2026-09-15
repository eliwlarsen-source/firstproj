"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Article } from "@/lib/fetchFeeds";
import { matchTools } from "@/lib/matchTools";
import { resolveRecommendation, type Recommendation } from "@/lib/resolveRecommendation";
import ToolCard, { type NewsMention } from "@/components/ToolCard";
import CheatSheet from "@/components/CheatSheet";

const EXAMPLE_PROMPTS = [
  "I need to write and polish a cover letter",
  "Turn my rough notes into a slide deck",
  "Build a small web app from scratch",
  "Generate a logo with text in it that's actually readable",
  "Clone my voice for a podcast intro",
  "Get meeting notes and action items from a Zoom call",
];

type Status = "idle" | "loading" | "done" | "error";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [usedFallback, setUsedFallback] = useState(false);
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/feed")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { articles: Article[] }) => {
        if (!cancelled) setArticles(data.articles);
      })
      .catch(() => {
        // News cross-referencing is a nice-to-have; fail silently.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function fallbackToLocalMatch(query: string) {
    const matches = matchTools(query);
    setRecommendations(
      matches.map((m) => ({
        name: m.tool.name,
        url: m.tool.url,
        category: m.tool.category,
        description: m.tool.description,
        bestFor: m.tool.bestFor,
        reason: m.reason,
        inCuratedList: true,
      }))
    );
    setUsedFallback(true);
    setStatus("done");
  }

  async function runSearch() {
    const query = input.trim();
    if (!query) return;

    setStatus("loading");
    setUsedFallback(false);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data: {
        primary: { name: string; reason: string };
        alternatives: { name: string; reason: string }[];
      } = await res.json();

      const all = [data.primary, ...data.alternatives];
      setRecommendations(all.map((r) => resolveRecommendation(r.name, r.reason)));
      setStatus("done");
    } catch {
      fallbackToLocalMatch(query);
    }

    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      runSearch();
    }
  }

  const newsMentions = useMemo(() => {
    const map = new Map<string, NewsMention>();
    for (const rec of recommendations) {
      const nameLower = rec.name.toLowerCase();
      const hit = articles.find((a) => a.title.toLowerCase().includes(nameLower));
      if (hit) map.set(rec.name, { title: hit.title, link: hit.link });
    }
    return map;
  }, [recommendations, articles]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-3xl px-4 sm:px-8 py-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Find the best AI for it
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Describe what you&apos;re trying to do. Gemini reasons about your specific
              situation and picks the best current tool for it.
            </p>
          </div>
          <button
            onClick={() => setCheatSheetOpen(true)}
            className="shrink-0 self-start rounded-lg border border-black/10 dark:border-white/15 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            Cheat sheet
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-stretch">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            rows={3}
            placeholder="e.g. I need to generate a short video for a product launch…"
            className="flex-1 rounded-lg border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.03] px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition resize-none"
          />
          <button
            onClick={runSearch}
            disabled={input.trim() === "" || status === "loading"}
            className="shrink-0 rounded-lg bg-neutral-900 dark:bg-neutral-100 px-5 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:opacity-90 disabled:opacity-40 transition sm:self-stretch"
          >
            {status === "loading" ? "Thinking…" : "Search"}
          </button>
        </div>

        {status !== "idle" && (
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            {status === "loading" && "Asking Gemini what's actually best for this…"}
            {status === "done" && !usedFallback && "Recommendation from Gemini"}
            {status === "done" &&
              usedFallback &&
              "Gemini's unavailable right now — showing curated matches instead"}
          </p>
        )}

        {status === "idle" && (
          <div className="mt-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Try one:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {status === "loading" && (
          <div className="mt-6 flex flex-col gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03]"
              />
            ))}
          </div>
        )}

        {status === "done" && (
          <div ref={resultsRef} className="mt-6 flex flex-col gap-4 scroll-mt-6">
            {recommendations.map((rec, i) => (
              <ToolCard
                key={`${rec.name}-${i}`}
                recommendation={rec}
                rank={i + 1}
                newsMention={newsMentions.get(rec.name)}
              />
            ))}
          </div>
        )}
      </main>

      {cheatSheetOpen && <CheatSheet onClose={() => setCheatSheetOpen(false)} />}
    </div>
  );
}
