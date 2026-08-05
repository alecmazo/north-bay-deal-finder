import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUsd(n: number, compact = false) {
  if (compact) {
    const abs = Math.abs(n);
    const sign = n < 0 ? "-" : "";
    if (abs >= 1_000_000) {
      const m = abs / 1_000_000;
      const rounded = Math.round(m * 100) / 100;
      // Stable SSR/client string (avoid Intl compact variance)
      const text =
        rounded % 1 === 0
          ? String(rounded)
          : rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
      return `${sign}$${text}M`;
    }
    if (abs >= 1_000) {
      const k = abs / 1_000;
      const rounded = Math.round(k);
      return `${sign}$${rounded}K`;
    }
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatPct(n: number) {
  return `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}
