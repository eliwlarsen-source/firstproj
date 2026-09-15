# AI Pulse

A dashboard that aggregates the latest AI news, tool launches, and research posts into one page.

## What it does

- Pulls articles from a curated list of AI-focused RSS feeds (OpenAI, Google AI, DeepMind, Hugging Face, TechCrunch AI, MIT Tech Review, VentureBeat AI, Hacker News AI discussions).
- Merges, deduplicates, and sorts everything newest-first.
- Lets you search and filter by category (Research / Product / News) or source.
- Caches results for 10 minutes server-side; the Refresh button forces a fresh fetch.

## Running it

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Adding or changing news sources

Edit `lib/sources.ts` — it's a plain array of `{ name, url, category }` RSS feed entries. Add a feed URL there and it shows up automatically. Note: some sites (The Verge, Ars Technica, Wired, Reddit) block automated RSS fetches with a 403 and aren't included for that reason.

## Project structure

- `lib/sources.ts` — the list of RSS feeds
- `lib/fetchFeeds.ts` — fetches + parses + normalizes all feeds
- `app/api/feed/route.ts` — API route that serves the merged, cached feed as JSON
- `app/page.tsx` — the dashboard UI (search, filters, article grid)
- `components/` — `Header`, `FilterBar`, `ArticleCard`, `ArticleGrid`

## Ideas for what's next

- Deploy it (e.g. to [Vercel](https://vercel.com/new)) so it's reachable from your phone
- A daily email digest instead of (or alongside) the live dashboard
- Save/bookmark articles (needs a database)
- AI-generated summaries of each article via the Claude API
