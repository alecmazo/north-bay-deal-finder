# Terminal Grok Handoff — North Bay Deal Finder

## Repo

- **GitHub:** https://github.com/alecmazo/north-bay-deal-finder  
- **GitHub Pages (demo UI):** https://alecmazo.github.io/north-bay-deal-finder/  
- **Owner:** Alec Mazo (`alecmazo`)

## What already ships

- Interactive North Bay deal dashboard (filters, comps, ARV, reno planner + store-linked materials)
- Demo listings in `src/data/properties.ts` + renovations in `src/data/renovations.ts`
- Client data layer ready for live API: `src/lib/api/listings.ts` + `src/lib/api/config.ts`
- Postgres schema stub: `migrations/0002_listings.sql`
- Static GitHub Pages build: `npm run build:pages` → `dist-pages/`
- Full TanStack Start app (Vercel-ready) for authenticated / SSR product path

## Your job (Terminal Grok)

### 1. Clone & secrets (never commit)

```bash
git clone https://github.com/alecmazo/north-bay-deal-finder.git
cd north-bay-deal-finder
cp .env.example .env.local
# fill secrets in .env.local only
```

| Variable | Where | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | server | Neon Postgres |
| `RENTCAST_API_KEY` or `ATTOM_API_KEY` | server | Listings provider |
| `VITE_API_BASE_URL` | client build | e.g. `https://api.yourdomain.com` |
| `VITE_DATA_MODE` | client | `api` when backend is live |
| `BETTER_AUTH_*` / `GROK_AUTH_*` | server | only if keeping Grok auth |

### 2. Implement backend (suggested)

```
POST/GET  /api/listings          — list/filter North Bay deals
GET       /api/listings/:id      — detail + comps
POST      /api/admin/sync        — pull provider → upsert listings + price history
GET       /api/health
```

- Use `migrations/0002_listings.sql`
- Map provider payload → `Property` shape in `src/data/properties.ts`
- Score: price drops, $/sqft vs comps, DOM, foreclosure/short-sale flags
- Zillow/Redfin: **outbound deep links only** unless licensed; do not scrape as primary feed
- North Bay focus: Sonoma, Marin, north of Golden Gate (Santa Rosa, Petaluma, Novato, Sonoma, etc.)

### 3. Wire the UI

When API is up:

```env
VITE_DATA_MODE=api
VITE_API_BASE_URL=https://<your-api-host>
```

`fetchListings()` already switches from demo data to API.

### 4. Deploy recommendation

| Surface | Target |
| --- | --- |
| Demo marketing / static | GitHub Pages (already) |
| Full product + auth + API | Vercel + Neon (TanStack Start in this repo) |
| Nightly sync worker | GitHub Action cron or Railway/Fly worker |

### 5. Provider priority

1. **RentCast** (fastest indie listings API)  
2. **ATTOM** (depth / public records)  
3. **MLS / Bridge / broker IDX** (long-term truth for North Bay)

## Commands

```bash
npm install
npm run dev              # full app :8080
npm run build:pages      # static github.io bundle
npm run typecheck
npm run build            # Vercel/Nitro production (needs care with DATABASE_URL)
```

## Do not

- Commit `.env`, API keys, passwords
- Scrape Zillow/Redfin as the system of record
- Claim demo addresses are live MLS inventory without disclosure

## Product intent (Alec)

Local real estate finder for **underpriced North Bay homes** (price drops, foreclosures, short sales, arbitrage), with **renovation options**, **material costs linked to stores**, and **ARV / value-max steps**.
