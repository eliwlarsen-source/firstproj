"use client";

import { useEffect, useMemo, useState } from "react";
import type { Article } from "@/lib/fetchFeeds";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ArticleGrid from "@/components/ArticleGrid";

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  async function fetchArticles(force: boolean) {
    const res = await fetch(`/api/feed${force ? "?force=1" : ""}`);
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    return res.json() as Promise<{ articles: Article[]; fetchedAt: number }>;
  }

  function applyArticles(data: { articles: Article[]; fetchedAt: number }) {
    setArticles(data.articles);
    setLastUpdated(data.fetchedAt);
    setError(null);
  }

  function applyError() {
    setError("Couldn't load the latest articles. Try refreshing.");
  }

  useEffect(() => {
    let cancelled = false;
    fetchArticles(false)
      .then((data) => {
        if (!cancelled) applyArticles(data);
      })
      .catch(() => {
        if (!cancelled) applyError();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    fetchArticles(true)
      .then(applyArticles)
      .catch(applyError)
      .finally(() => setRefreshing(false));
  }

  const categories = useMemo(
    () => Array.from(new Set(articles.map((a) => a.category))).sort(),
    [articles]
  );
  const sourceNames = useMemo(
    () => Array.from(new Set(articles.map((a) => a.source))).sort(),
    [articles]
  );

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articles.filter((a) => {
      if (selectedCategory && a.category !== selectedCategory) return false;
      if (selectedSource && a.source !== selectedSource) return false;
      if (query && !a.title.toLowerCase().includes(query) && !a.snippet.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });
  }, [articles, search, selectedCategory, selectedSource]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-6xl px-4 sm:px-8 py-10">
        <Header
          onRefresh={handleRefresh}
          refreshing={refreshing}
          lastUpdated={lastUpdated}
        />
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sourceNames={sourceNames}
          selectedSource={selectedSource}
          onSourceChange={setSelectedSource}
        />
        <ArticleGrid articles={filteredArticles} loading={loading} error={error} />
      </main>
    </div>
  );
}
