import { PROPERTIES, type Property } from "@/data/properties";
import { API_PATHS, getApiBaseUrl, getDataMode } from "./config";

export type ListingsQuery = {
  city?: string;
  dealType?: string;
  maxPrice?: number;
  minScore?: number;
  q?: string;
};

/**
 * Fetch listings — demo static data today; live Postgres/API when VITE_API_BASE_URL is set.
 * Terminal Grok implements GET /api/listings against Neon + RentCast/ATTOM/MLS.
 */
export async function fetchListings(
  query: ListingsQuery = {},
): Promise<Property[]> {
  if (getDataMode() === "api") {
    const base = getApiBaseUrl();
    const params = new URLSearchParams();
    if (query.city && query.city !== "All") params.set("city", query.city);
    if (query.dealType && query.dealType !== "all")
      params.set("dealType", query.dealType);
    if (query.maxPrice != null) params.set("maxPrice", String(query.maxPrice));
    if (query.minScore != null) params.set("minScore", String(query.minScore));
    if (query.q) params.set("q", query.q);
    const url = `${base}${API_PATHS.listings}?${params.toString()}`;
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) {
      throw new Error(`Listings API ${res.status}: ${await res.text()}`);
    }
    return (await res.json()) as Property[];
  }

  // Demo filter (mirrors dashboard filters for offline github.io)
  return PROPERTIES.filter((p) => {
    if (query.city && query.city !== "All" && p.city !== query.city) return false;
    if (query.maxPrice != null && p.listPrice > query.maxPrice) return false;
    if (query.minScore != null && p.dealScore < query.minScore) return false;
    if (
      query.dealType &&
      query.dealType !== "all" &&
      !p.dealTypes.includes(query.dealType as Property["dealTypes"][number])
    )
      return false;
    if (query.q?.trim()) {
      const q = query.q.toLowerCase();
      const hay =
        `${p.address} ${p.city} ${p.neighborhood} ${p.zip} ${p.county}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export async function fetchListingById(id: string): Promise<Property | null> {
  if (getDataMode() === "api") {
    const res = await fetch(`${getApiBaseUrl()}${API_PATHS.listing(id)}`, {
      credentials: "include",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Listing API ${res.status}`);
    return (await res.json()) as Property;
  }
  return PROPERTIES.find((p) => p.id === id) ?? null;
}

export function getListingsSourceLabel(): string {
  return getDataMode() === "api"
    ? "Live API"
    : "Demo dataset (North Bay curated)";
}
