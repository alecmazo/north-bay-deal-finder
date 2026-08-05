# Backend stub (for Terminal Grok)

Implement these routes against Neon + a listings provider.

## GET /api/listings

Query: `city`, `dealType`, `maxPrice`, `minScore`, `q`

Response: `Property[]` matching `src/data/properties.ts`.

## GET /api/listings/:id

Response: single `Property` or 404.

## POST /api/admin/sync

Header: `Authorization: Bearer $SYNC_SECRET`

1. Call RentCast/ATTOM for North Bay zips
2. Upsert `listings`
3. Append `listing_price_history` when price changes
4. Recompute `deal_score`, `discount_to_comps`, deal_types

## Mapping notes

- Prefer official APIs; link out to Zillow/Redfin via search URL from address
- Photos: cache or use provider media URLs with attribution rules
- Short sale / foreclosure: from status fields or remarks keywords (careful)

## North Bay geo filter

Cities: Santa Rosa, Petaluma, Novato, Sonoma, Rohnert Park, San Rafael, Windsor, Healdsburg, Fairfax, Cotati, Mill Valley, Napa (edge), San Anselmo, Larkspur, etc.  
Counties: Sonoma, Marin (+ optional Napa edge).
