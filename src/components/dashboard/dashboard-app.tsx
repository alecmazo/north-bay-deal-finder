import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Filter,
  LayoutGrid,
  List,
  MapPinned,
  Search,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import {
  CITIES,
  DEAL_TYPE_LABELS,
  type DealType,
  type Property,
  equityGap,
} from "@/data/properties";
import { fetchListings, getListingsSourceLabel } from "@/lib/api/listings";
import { formatUsd, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { PropertyCard } from "./property-card";
import { PropertyDetail } from "./property-detail";

const ALL_DEAL_TYPES = Object.keys(DEAL_TYPE_LABELS) as DealType[];

export function DashboardApp() {
  const { user, isPending } = useCurrentUserState();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<string>("All");
  const [dealType, setDealType] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState(1200000);
  const [minScore, setMinScore] = useState(70);
  const [sort, setSort] = useState("score");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Property | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchListings({})
      .then((rows) => {
        if (!cancelled) {
          setProperties(rows);
          setLoadError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Failed to load listings");
          setProperties([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = properties.filter((p) => {
      if (city !== "All" && p.city !== city) return false;
      if (p.listPrice > maxPrice) return false;
      if (p.dealScore < minScore) return false;
      if (dealType !== "all" && !p.dealTypes.includes(dealType as DealType))
        return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay =
          `${p.address} ${p.city} ${p.neighborhood} ${p.zip} ${p.county}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "score") return b.dealScore - a.dealScore;
      if (sort === "discount") return a.discountToComps - b.discountToComps;
      if (sort === "gap") return equityGap(b) - equityGap(a);
      if (sort === "price-asc") return a.listPrice - b.listPrice;
      if (sort === "price-desc") return b.listPrice - a.listPrice;
      if (sort === "dom") return b.daysOnMarket - a.daysOnMarket;
      return 0;
    });
    return list;
  }, [properties, query, city, dealType, maxPrice, minScore, sort]);

  const stats = useMemo(() => {
    const avgDiscount =
      filtered.reduce((s, p) => s + p.discountToComps, 0) /
      (filtered.length || 1);
    const totalGap = filtered.reduce((s, p) => s + equityGap(p), 0);
    const priceDrops = filtered.filter((p) =>
      p.dealTypes.includes("price_drop"),
    ).length;
    const distressed = filtered.filter(
      (p) =>
        p.dealTypes.includes("foreclosure") ||
        p.dealTypes.includes("short_sale") ||
        p.dealTypes.includes("reo"),
    ).length;
    return { avgDiscount, totalGap, priceDrops, distressed };
  }, [filtered]);

  function openProperty(p: Property) {
    setSelected(p);
    setDetailOpen(true);
  }

  return (
    <div className="min-h-[calc(100dvh-var(--grok-banner-h,0px))] bg-background">
      <header className="sticky top-[var(--grok-banner-h,0px)] z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 items-center justify-center rounded-lg bg-deal/15 text-deal">
              <Building2 className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">
                North Bay Deal Finder
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Sonoma · Marin · North of GG Bridge · {getListingsSourceLabel()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isPending ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <SignedIn>
                <UserButton />
              </SignedIn>
            ) : (
              <SignedOut>
                <Button size="sm" variant="secondary" asChild>
                  <a href="/login">Sign in</a>
                </Button>
              </SignedOut>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="mb-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
                <MapPinned className="size-3.5 text-deal" />
                Curated North Bay arbitrage board
              </div>
              <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Underpriced homes, price drops & value-add plays
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Compare list price vs comps, model renovations with store-linked
                material costs, and see ARV paths for Santa Rosa, Petaluma,
                Novato, Sonoma, and the broader North Bay.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              label="Deals shown"
              value={loading ? "…" : String(filtered.length)}
              hint="Matching filters"
            />
            <StatTile
              label="Avg vs comps"
              value={loading ? "…" : `${stats.avgDiscount.toFixed(1)}%`}
              hint="Negative = underpriced"
              accent
            />
            <StatTile
              label="Aggregate equity gap"
              value={loading ? "…" : formatUsd(stats.totalGap, true)}
              hint="Sum of ARV − list"
            />
            <StatTile
              label="Distressed / drops"
              value={
                loading
                  ? "…"
                  : `${stats.distressed} / ${stats.priceDrops}`
              }
              hint="Foreclosure·SS·REO / drops"
            />
          </div>
        </section>

        <section className="mb-5 rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium">
            <Filter className="size-4 text-muted-foreground" />
            Filters
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <div className="relative xl:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search address, city, neighborhood…"
                className="pl-9"
              />
            </div>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger>
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "All" ? "All cities" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dealType} onValueChange={setDealType}>
              <SelectTrigger>
                <SelectValue placeholder="Deal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All deal types</SelectItem>
                {ALL_DEAL_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {DEAL_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Deal score</SelectItem>
                <SelectItem value="discount">Biggest discount</SelectItem>
                <SelectItem value="gap">Largest equity gap</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="dom">Days on market</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant={view === "grid" ? "secondary" : "ghost"}
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                size="icon"
                variant={view === "list" ? "secondary" : "ghost"}
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>Max list price</span>
                <span className="tabular font-medium text-foreground">
                  {formatUsd(maxPrice)}
                </span>
              </div>
              <Slider
                value={[maxPrice]}
                min={400000}
                max={1500000}
                step={25000}
                onValueChange={(v) => setMaxPrice(v[0] ?? maxPrice)}
              />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>Min deal score</span>
                <span className="tabular font-medium text-foreground">
                  {minScore}+
                </span>
              </div>
              <Slider
                value={[minScore]}
                min={50}
                max={95}
                step={1}
                onValueChange={(v) => setMinScore(v[0] ?? minScore)}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {ALL_DEAL_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setDealType(dealType === t ? "all" : t)}
              >
                <Badge
                  variant={dealType === t ? "deal" : "outline"}
                  className="cursor-pointer"
                >
                  {DEAL_TYPE_LABELS[t]}
                </Badge>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {loading ? "…" : filtered.length}
            </span>{" "}
            opportunities
            {city !== "All" ? ` in ${city}` : " across North Bay"}
          </p>
          <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <Sparkles className="size-3.5 text-deal" />
            Click a card for comps, ARV path & reno shopping list
          </div>
        </section>

        {loadError && (
          <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {loadError}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl border border-border bg-muted/40"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <TrendingDown className="mx-auto mb-3 size-8 text-muted-foreground" />
            <p className="font-medium">No deals match these filters</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Widen price, lower score threshold, or clear city/type.
            </p>
            <Button
              className="mt-4"
              variant="secondary"
              onClick={() => {
                setCity("All");
                setDealType("all");
                setMaxPrice(1200000);
                setMinScore(70);
                setQuery("");
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} onSelect={openProperty} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Property</th>
                  <th className="px-4 py-3 font-medium">List</th>
                  <th className="px-4 py-3 font-medium">ARV</th>
                  <th className="px-4 py-3 font-medium">Gap</th>
                  <th className="px-4 py-3 font-medium">vs Comp</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="cursor-pointer border-t border-border hover:bg-muted/30"
                    onClick={() => openProperty(p)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="size-12 rounded-md object-cover"
                          crossOrigin="anonymous"
                        />
                        <div>
                          <p className="font-medium">{p.address}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.city} · {p.beds}bd {p.baths}ba
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="tabular px-4 py-3">
                      {formatUsd(p.listPrice)}
                    </td>
                    <td className="tabular px-4 py-3 text-deal">
                      {formatUsd(p.baseArv)}
                    </td>
                    <td className="tabular px-4 py-3 text-success">
                      {formatUsd(equityGap(p))}
                    </td>
                    <td className="tabular px-4 py-3">
                      {p.discountToComps.toFixed(1)}%
                    </td>
                    <td className="tabular px-4 py-3">{p.dealScore}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.dealTypes.slice(0, 2).map((t) => (
                          <Badge
                            key={t}
                            variant="outline"
                            className="text-[10px]"
                          >
                            {DEAL_TYPE_LABELS[t]}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <footer className="mt-10 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          <p>
            Demo board for North Bay (north of the Golden Gate): Sonoma, Marin,
            and nearby Napa edge markets. Listing photos may be representative;
            pricing, comps, and ARV figures are planning models — verify on
            Zillow, Redfin, MLS, and with licensed local professionals before
            offering. Live feeds land via backend (see docs/TERMINAL_HANDOFF.md).
          </p>
        </footer>
      </main>

      <PropertyDetail
        property={selected}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}

function StatTile({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 tabular text-2xl font-semibold tracking-tight",
          accent && "text-deal",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
