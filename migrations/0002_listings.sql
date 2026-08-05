-- Listings + price history for North Bay Deal Finder
-- Applied by Terminal Grok / npm run db:migrate when DATABASE_URL is set.

CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  external_id TEXT,
  source TEXT NOT NULL DEFAULT 'demo',
  mls_number TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  county TEXT,
  zip TEXT,
  neighborhood TEXT,
  beds NUMERIC,
  baths NUMERIC,
  sqft INTEGER,
  lot_sqft INTEGER,
  year_built INTEGER,
  list_price INTEGER NOT NULL,
  original_price INTEGER,
  base_arv INTEGER,
  comp_ppsf NUMERIC,
  days_on_market INTEGER DEFAULT 0,
  deal_types TEXT[] DEFAULT '{}',
  deal_score INTEGER DEFAULT 0,
  discount_to_comps NUMERIC,
  images JSONB DEFAULT '[]'::jsonb,
  listing_url TEXT,
  description TEXT,
  issues JSONB DEFAULT '[]'::jsonb,
  opportunities JSONB DEFAULT '[]'::jsonb,
  recommended_reno_ids JSONB DEFAULT '[]'::jsonb,
  value_max_steps JSONB DEFAULT '[]'::jsonb,
  comps JSONB DEFAULT '[]'::jsonb,
  hoa INTEGER,
  garage INTEGER,
  property_tax_annual INTEGER,
  status TEXT DEFAULT 'Active',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  raw JSONB,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS listings_city_idx ON listings (city);
CREATE INDEX IF NOT EXISTS listings_list_price_idx ON listings (list_price);
CREATE INDEX IF NOT EXISTS listings_deal_score_idx ON listings (deal_score DESC);
CREATE INDEX IF NOT EXISTS listings_status_idx ON listings (status);
CREATE INDEX IF NOT EXISTS listings_source_idx ON listings (source);

CREATE TABLE IF NOT EXISTS listing_price_history (
  id BIGSERIAL PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT
);

CREATE INDEX IF NOT EXISTS listing_price_history_listing_idx
  ON listing_price_history (listing_id, observed_at DESC);

CREATE TABLE IF NOT EXISTS sync_runs (
  id BIGSERIAL PRIMARY KEY,
  provider TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'started',
  listings_upserted INTEGER DEFAULT 0,
  error TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);
