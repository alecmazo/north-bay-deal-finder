import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  CalendarDays,
  Car,
  ExternalLink,
  Home,
  MapPin,
  Maximize,
  Ruler,
} from "lucide-react";
import type { Property } from "@/data/properties";
import {
  DEAL_TYPE_LABELS,
  equityGap,
  priceDropPct,
} from "@/data/properties";
import { formatNumber, formatPct, formatUsd, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RenovationPlanner } from "./renovation-planner";

type Props = {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PropertyDetail({ property, open, onOpenChange }: Props) {
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedRenos, setSelectedRenos] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (property) {
      setSelectedRenos(new Set(property.recommendedRenoIds.slice(0, 4)));
      setImgIdx(0);
    }
  }, [property]);

  if (!property) return null;

  const drop = priceDropPct(property);
  const gap = equityGap(property);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="overflow-y-auto p-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl"
      >
        <div className="relative aspect-[16/10] w-full bg-muted">
          <img
            src={property.images[imgIdx] ?? property.images[0]}
            alt={property.address}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-16">
            <div className="flex flex-wrap gap-1.5">
              {property.dealTypes.map((t) => (
                <Badge key={t} variant="deal">
                  {DEAL_TYPE_LABELS[t]}
                </Badge>
              ))}
              <Badge variant="secondary">{property.status}</Badge>
            </div>
          </div>
        </div>
        {property.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto border-b border-border px-4 py-3">
            {property.images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setImgIdx(i)}
                className={cn(
                  "h-14 w-20 shrink-0 overflow-hidden rounded-md border-2",
                  i === imgIdx ? "border-deal" : "border-transparent opacity-70",
                )}
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              </button>
            ))}
          </div>
        )}

        <SheetHeader className="space-y-2 border-b border-border p-6">
          <SheetTitle className="text-xl leading-snug">
            {property.address}
          </SheetTitle>
          <SheetDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {property.city}, {property.zip} · {property.neighborhood}
            </span>
            <span>{property.county} County</span>
          </SheetDescription>
          <div className="flex flex-wrap items-end gap-4 pt-2">
            <div>
              <p className="text-xs text-muted-foreground">List price</p>
              <p className="tabular text-2xl font-semibold tracking-tight">
                {formatUsd(property.listPrice)}
              </p>
              {drop < 0 && (
                <p className="text-xs text-success">
                  {formatPct(drop)} from {formatUsd(property.originalPrice)}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Base ARV</p>
              <p className="tabular text-lg font-semibold text-deal">
                {formatUsd(property.baseArv)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Equity gap</p>
              <p className="tabular text-lg font-semibold text-success">
                {formatUsd(gap)}
              </p>
            </div>
            <div className="ml-auto">
              <Badge variant="outline" className="tabular">
                Score {property.dealScore}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button size="sm" asChild>
              <a href={property.listingUrl} target="_blank" rel="noreferrer">
                Open on {property.source}
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
            <Button size="sm" variant="secondary" asChild>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${property.address}, ${property.city}, CA ${property.zip}`,
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Maps
                <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
          </div>
        </SheetHeader>

        <div className="p-6">
          <Tabs defaultValue="overview">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="comps">Comps</TabsTrigger>
              <TabsTrigger value="value">Value plan</TabsTrigger>
              <TabsTrigger value="renos">Renovations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Stat icon={<BedDouble className="size-3.5" />} label="Beds" value={String(property.beds)} />
                <Stat icon={<Bath className="size-3.5" />} label="Baths" value={String(property.baths)} />
                <Stat icon={<Maximize className="size-3.5" />} label="Sq ft" value={formatNumber(property.sqft)} />
                <Stat icon={<Ruler className="size-3.5" />} label="Lot" value={formatNumber(property.lotSqft)} />
                <Stat icon={<Home className="size-3.5" />} label="Built" value={String(property.yearBuilt)} />
                <Stat icon={<CalendarDays className="size-3.5" />} label="DOM" value={String(property.daysOnMarket)} />
                <Stat icon={<Car className="size-3.5" />} label="Garage" value={String(property.garage ?? "—")} />
                <Stat
                  icon={<span className="text-[10px] font-bold">$/ft</span>}
                  label="List ppsf"
                  value={formatUsd(property.listPrice / property.sqft)}
                />
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {property.description}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Issues / risks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {property.issues.map((x) => (
                        <li key={x} className="flex gap-2">
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-warning" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {property.opportunities.map((x) => (
                        <li key={x} className="flex gap-2">
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-success" />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="comps" className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div>
                    <span className="text-muted-foreground">Median comp ppsf </span>
                    <span className="tabular font-semibold">
                      {formatUsd(property.compPpsf)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">This list ppsf </span>
                    <span className="tabular font-semibold">
                      {formatUsd(property.listPrice / property.sqft)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Discount to comps </span>
                    <span className="tabular font-semibold text-success">
                      {formatPct(property.discountToComps)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-muted/50 text-xs text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Address</th>
                      <th className="px-3 py-2 font-medium">Sold</th>
                      <th className="px-3 py-2 font-medium">Date</th>
                      <th className="px-3 py-2 font-medium">Bd/Ba</th>
                      <th className="px-3 py-2 font-medium">Sqft</th>
                      <th className="px-3 py-2 font-medium">Mi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {property.comps.map((c) => (
                      <tr key={c.address} className="border-t border-border">
                        <td className="px-3 py-2.5">
                          <div className="font-medium">{c.address}</div>
                          {c.notes && (
                            <div className="text-xs text-muted-foreground">
                              {c.notes}
                            </div>
                          )}
                        </td>
                        <td className="tabular px-3 py-2.5">
                          {formatUsd(c.soldPrice)}
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">
                          {c.soldDate}
                        </td>
                        <td className="px-3 py-2.5">
                          {c.beds}/{c.baths}
                        </td>
                        <td className="tabular px-3 py-2.5">
                          {formatNumber(c.sqft)}
                        </td>
                        <td className="tabular px-3 py-2.5">{c.distanceMi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="value" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Steps to maximize value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {property.valueMaxSteps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-deal/15 text-xs font-semibold text-deal">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground leading-relaxed">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
              <div className="rounded-xl border border-border p-4 text-sm leading-relaxed text-muted-foreground">
                Base ARV {formatUsd(property.baseArv)} assumes the recommended
                renovation stack completes to neighborhood finish standards.
                Use the Renovations tab to model alternate scopes, material costs
                from Home Depot, Lowe's, Floor & Decor, Ferguson, and more,
                and projected resale.
              </div>
            </TabsContent>

            <TabsContent value="renos">
              <RenovationPlanner
                property={property}
                selected={selectedRenos}
                onToggle={(id) => {
                  setSelectedRenos((prev) => {
                    const next = new Set(prev);
                    if (next.has(id)) next.delete(id);
                    else next.add(id);
                    return next;
                  });
                }}
                onSelectRecommended={() =>
                  setSelectedRenos(new Set(property.recommendedRenoIds))
                }
                onClear={() => setSelectedRenos(new Set())}
              />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2.5">
      <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="tabular text-sm font-semibold">{value}</p>
    </div>
  );
}
