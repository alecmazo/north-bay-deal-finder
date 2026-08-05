# North Bay Deal Finder

Interactive dashboard for **underpriced homes in the North Bay** (Sonoma, Marin, north of the Golden Gate): price drops, foreclosures, short sales, comps vs list, ARV paths, and renovation packages with **store-linked material costs** (Home Depot, Lowe’s, Floor & Decor, etc.).

| | |
| --- | --- |
| **Live demo (GitHub Pages)** | [alecmazo.github.io/north-bay-deal-finder](https://alecmazo.github.io/north-bay-deal-finder/) |
| **Repo** | [github.com/alecmazo/north-bay-deal-finder](https://github.com/alecmazo/north-bay-deal-finder) |
| **Terminal handoff** | [docs/TERMINAL_HANDOFF.md](./docs/TERMINAL_HANDOFF.md) |

## Features

- Deal board with filters (city, deal type, price, score), grid/list views
- Property detail: photos, issues/opportunities, comps, value-max steps
- Renovation planner with ARV lift, labor estimate, shopping list + store links
- Demo listings today; `fetchListings()` ready for live API + Postgres

## Quick start

```bash
npm install
npm run dev          # full TanStack Start app on :8080
npm run build:pages  # static GitHub Pages bundle → dist-pages/
npm run typecheck
```

## Data modes

| Mode | Env | Behavior |
| --- | --- | --- |
| Demo (default) | `VITE_DATA_MODE=demo` | `src/data/properties.ts` |
| Live API | `VITE_DATA_MODE=api` + `VITE_API_BASE_URL` | `GET /api/listings` |

See `.env.example` and `docs/TERMINAL_HANDOFF.md` for Neon, RentCast/ATTOM, and MLS notes.

## Stack

React 19 · TypeScript · Vite · TanStack Start (full app) · Tailwind v4 · Radix/shadcn · Zustand-ready · Postgres migrations (PGLite/Neon)

## License

Private / personal project unless otherwise noted.
