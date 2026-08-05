import { useMemo } from "react";
import {
  ExternalLink,
  Hammer,
  Clock,
  TrendingUp,
  Package,
  Wrench,
} from "lucide-react";
import type { Property } from "@/data/properties";
import {
  RENOVATION_OPTIONS,
  STORES,
  materialCost,
  renovationLaborCost,
  renovationMaterialsCost,
  renovationTotalCost,
  storeSearchUrl,
  type RenovationOption,
} from "@/data/renovations";
import { formatUsd, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

type Props = {
  property: Property;
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelectRecommended: () => void;
  onClear: () => void;
};

export function RenovationPlanner({
  property,
  selected,
  onToggle,
  onSelectRecommended,
  onClear,
}: Props) {
  const selectedOpts = useMemo(
    () => RENOVATION_OPTIONS.filter((o) => selected.has(o.id)),
    [selected],
  );

  const totals = useMemo(() => {
    const materials = selectedOpts.reduce(
      (s, o) => s + renovationMaterialsCost(o),
      0,
    );
    const labor = selectedOpts.reduce((s, o) => s + renovationLaborCost(o), 0);
    const arvLift = selectedOpts.reduce((s, o) => s + o.arvLift, 0);
    const adjustedLift =
      selectedOpts.length <= 1
        ? arvLift
        : Math.round(
            arvLift * (1 - Math.min(0.22, (selectedOpts.length - 1) * 0.04)),
          );
    const days = selectedOpts.reduce((s, o) => s + o.days, 0);
    const scheduleDays = Math.round(
      days * (selectedOpts.length > 1 ? 0.65 : 1),
    );
    const cost = materials + labor;
    const blendedArv = Math.max(
      property.baseArv * 0.92,
      Math.min(
        property.baseArv + adjustedLift * 0.35,
        property.listPrice +
          adjustedLift +
          (property.baseArv - property.listPrice) * 0.5,
      ),
    );
    const profit = blendedArv - property.listPrice - cost;
    const roi =
      cost > 0 ? (profit / (property.listPrice * 0.25 + cost)) * 100 : 0;
    return {
      materials,
      labor,
      cost,
      blendedArv: Math.round(blendedArv),
      profit: Math.round(profit),
      roi,
      scheduleDays,
    };
  }, [selectedOpts, property]);

  const materialLines = useMemo(() => {
    return selectedOpts.flatMap((opt) =>
      opt.materials.map((line) => ({ ...line, renoName: opt.name })),
    );
  }, [selectedOpts]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">
            Renovation value planner
          </h3>
          <p className="text-sm text-muted-foreground">
            Toggle packages to model cost, store materials, ARV lift, and ROI.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={onSelectRecommended}>
            Recommended scope
          </Button>
          <Button size="sm" variant="ghost" onClick={onClear}>
            Clear
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Materials"
          value={formatUsd(totals.materials)}
          icon={<Package className="size-4" />}
        />
        <Metric
          label="Labor (est.)"
          value={formatUsd(totals.labor)}
          icon={<Wrench className="size-4" />}
        />
        <Metric
          label="Projected ARV"
          value={formatUsd(totals.blendedArv)}
          icon={<TrendingUp className="size-4" />}
          accent
        />
        <Metric
          label="Net after renos"
          value={formatUsd(totals.profit)}
          icon={<Hammer className="size-4" />}
          positive={totals.profit > 0}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {RENOVATION_OPTIONS.map((opt) => (
          <RenoCard
            key={opt.id}
            option={opt}
            checked={selected.has(opt.id)}
            recommended={property.recommendedRenoIds.includes(opt.id)}
            onToggle={() => onToggle(opt.id)}
          />
        ))}
      </div>

      {selectedOpts.length > 0 && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Deal math
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row
                label="List / offer basis"
                value={formatUsd(property.listPrice)}
              />
              <Row label="Total reno cost" value={formatUsd(totals.cost)} />
              <Row
                label="All-in basis"
                value={formatUsd(property.listPrice + totals.cost)}
              />
              <Row
                label="Projected resale (ARV)"
                value={formatUsd(totals.blendedArv)}
              />
              <Separator />
              <Row
                label="Gross spread"
                value={formatUsd(totals.blendedArv - property.listPrice)}
                bold
              />
              <Row
                label="Profit after renos (pre-fees)"
                value={formatUsd(totals.profit)}
                bold
                accent={totals.profit > 0}
              />
              <Row
                label="Rough ROI on cash (25% down + renos)"
                value={`${totals.roi.toFixed(0)}%`}
              />
              <div className="flex items-center gap-2 pt-1 text-muted-foreground">
                <Clock className="size-3.5" />
                <span>
                  Est. schedule {totals.scheduleDays} days (overlapping trades)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm font-medium">
                  Material shopping list
                </CardTitle>
                <Badge variant="outline">{materialLines.length} lines</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {materialLines.map((line) => {
                const store = STORES[line.store];
                const url = storeSearchUrl(line.store, line.searchQuery);
                return (
                  <div
                    key={`${line.renoName}-${line.id}`}
                    className="flex flex-col gap-2 rounded-xl border border-border bg-muted/40 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-medium leading-snug">
                        {line.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {line.renoName} · {line.qty} {line.unit} ×{" "}
                        {formatUsd(line.unitCost)}
                        {line.notes ? ` · ${line.notes}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="tabular text-sm font-semibold">
                        {formatUsd(materialCost(line))}
                      </span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium transition-colors hover:bg-accent"
                        style={{ borderColor: `${store.color}55` }}
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: store.color }}
                        />
                        {store.short}
                        <ExternalLink className="size-3 opacity-60" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Execution steps (selected packages)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedOpts.map((opt) => (
                <div key={opt.id}>
                  <p className="mb-2 text-sm font-medium">{opt.name}</p>
                  <ol className="space-y-1.5 border-l border-border pl-4">
                    {opt.steps.map((step, i) => (
                      <li
                        key={i}
                        className="relative text-sm text-muted-foreground"
                      >
                        <span className="absolute -left-[1.3rem] top-1.5 size-1.5 rounded-full bg-deal" />
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
  accent,
  positive,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p
        className={cn(
          "tabular text-xl font-semibold tracking-tight",
          accent && "text-deal",
          positive && "text-success",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "tabular",
          bold && "font-semibold text-foreground",
          accent && "text-success",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function RenoCard({
  option,
  checked,
  recommended,
  onToggle,
}: {
  option: RenovationOption;
  checked: boolean;
  recommended: boolean;
  onToggle: () => void;
}) {
  const total = renovationTotalCost(option);
  const materials = renovationMaterialsCost(option);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className={cn(
        "rounded-2xl border p-4 text-left transition-colors cursor-pointer",
        checked
          ? "border-deal/50 bg-deal/5"
          : "border-border bg-card hover:bg-muted/40",
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={onToggle}
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold leading-snug">{option.name}</p>
            {recommended && (
              <Badge variant="deal" className="text-[10px]">
                Recommended
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px]">
              {option.difficulty}
            </Badge>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {option.description}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="tabular text-muted-foreground">
              Cost ~{formatUsd(total)}
              <span className="opacity-60"> (mat {formatUsd(materials)})</span>
            </span>
            <span className="tabular text-success">
              ARV +{formatUsd(option.arvLift)}
            </span>
            <span className="text-muted-foreground">{option.days} days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
