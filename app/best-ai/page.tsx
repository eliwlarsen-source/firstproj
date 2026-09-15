"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Article } from "@/lib/fetchFeeds";
import { matchTools } from "@/lib/matchTools";
import ToolCard, { type NewsMention } from "@/components/ToolCard";

const EXAMPLE_PROMPTS = [
  "I need to write and polish a cover letter",
  "Turn my rough notes into a slide deck",
  "Build a small web app from scratch",
  "Generate a logo with text in it that's actually readable",
  "Clone my voice for a podcast intro",
  "Get meeting notes and action items from a Zoom call",
];

export default function BestAiPage() {
  const [input, setInput] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);

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

  const matches = useMemo(() => matchTools(input), [input]);

  const newsMentions = useMemo(() => {
    const map = new Map<string, NewsMention>();
    for (const match of matches) {
      const nameLower = match.tool.name.toLowerCase();
      const hit = articles.find((a) => a.title.toLowerCase().includes(nameLower));
      if (hit) map.set(match.tool.name, { title: hit.title, link: hit.link });
    }
    return map;
  }, [matches, articles]);

  const hasStrongMatch = matches.length > 0 && matches[0].score > 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-3xl px-4 sm:px-8 py-10">
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:underline"
          >
            ← Back to news
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-2">
            Find the best AI for it
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Describe what you&apos;re trying to do and get a matched recommendation from a
            curated, hand-maintained list of current AI tools.
          </p>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="e.g. I need to generate a short video for a product launch…"
          className="w-full rounded-lg border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.03] px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition resize-none"
        />

        {input.trim() === "" && (
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

        {input.trim() !== "" && (
          <div className="mt-6 flex flex-col gap-4">
            {!hasStrongMatch && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No specific match found in the list — here are strong general-purpose picks
                instead.
              </p>
            )}
            {matches.map((match, i) => (
              <ToolCard
                key={match.tool.name}
                match={match}
                rank={i + 1}
                newsMention={newsMentions.get(match.tool.name)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
