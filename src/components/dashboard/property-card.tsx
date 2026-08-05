import {
  Bath,
  BedDouble,
  MapPin,
  TrendingDown,
  Maximize,
} from "lucide-react";
import type { Property } from "@/data/properties";
import { DEAL_TYPE_LABELS, equityGap, priceDropPct } from "@/data/properties";
import { formatNumber, formatPct, formatUsd, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Props = {
  property: Property;
  onSelect: (p: Property) => void;
};

export function PropertyCard({ property, onSelect }: Props) {
  const drop = priceDropPct(property);
  const gap = equityGap(property);
  const ppsf = property.listPrice / property.sqft;

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(property)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(property);
        }
      }}
      className="group cursor-pointer overflow-hidden transition-colors hover:border-deal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={property.images[0]}
          alt={property.address}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          crossOrigin="anonymous"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {property.dealTypes.slice(0, 2).map((t) => (
            <Badge key={t} variant="deal" className="backdrop-blur-sm">
              {DEAL_TYPE_LABELS[t]}
            </Badge>
          ))}
        </div>
        <div className="absolute right-3 top-3">
          <Badge
            variant="secondary"
            className="tabular backdrop-blur-sm bg-background/80"
          >
            {property.dealScore}
          </Badge>
        </div>
        {drop < -1 && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="success" className="gap-1 backdrop-blur-sm">
              <TrendingDown className="size-3" />
              {formatPct(drop)}
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold tracking-tight">
              {property.address}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              {property.city} · {property.neighborhood}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="tabular text-base font-semibold leading-none">
              {formatUsd(property.listPrice, true)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground tabular">
              {formatUsd(ppsf)}/ft
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BedDouble className="size-3.5" />
            {property.beds}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath className="size-3.5" />
            {property.baths}
          </span>
          <span className="inline-flex items-center gap-1">
            <Maximize className="size-3.5" />
            {formatNumber(property.sqft)} ft
          </span>
          <span className="ml-auto tabular">{property.daysOnMarket} DOM</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-xs">
          <span className="text-muted-foreground">
            ARV {formatUsd(property.baseArv, true)}
          </span>
          <span
            className={cn(
              "tabular font-semibold",
              gap > 0 ? "text-success" : "text-destructive",
            )}
          >
            {gap > 0 ? "+" : ""}
            {formatUsd(gap, true)} gap
          </span>
        </div>
      </div>
    </Card>
  );
}
