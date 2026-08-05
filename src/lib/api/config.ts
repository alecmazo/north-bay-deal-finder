/**
 * Runtime config for live data backends.
 * Terminal Grok: set VITE_API_BASE_URL / secrets on the server; never commit keys.
 */
export type DataMode = "demo" | "api";

export function getDataMode(): DataMode {
  const mode = (import.meta.env.VITE_DATA_MODE as string | undefined)?.toLowerCase();
  if (mode === "api") return "api";
  // Auto: use API when base URL is set
  if (import.meta.env.VITE_API_BASE_URL) return "api";
  return "demo";
}

export function getApiBaseUrl(): string {
  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";
  return base.replace(/\/$/, "");
}

export const API_PATHS = {
  listings: "/api/listings",
  listing: (id: string) => `/api/listings/${encodeURIComponent(id)}`,
  comps: (id: string) => `/api/listings/${encodeURIComponent(id)}/comps`,
  health: "/api/health",
  sync: "/api/admin/sync",
} as const;
