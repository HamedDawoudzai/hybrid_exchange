"use client";

import type { AssetType, PriceData } from "@/types";

/**
 * usePrice Hook
 * Fetches real-time price for a single asset.
 * 
 * TODO: Implement price query with React Query
 * TODO: Add refetch interval for real-time updates
 * TODO: Handle stock vs crypto price endpoints
 */
export function usePrice(symbol: string, type: AssetType) {
  return {
    data: null as PriceData | null,
    isLoading: false,
    error: null,
    refetch: () => {},
  };
}

/**
 * usePriceHistory Hook
 * Fetches historical price data for charts.
 * 
 * TODO: Implement price history query with React Query
 * TODO: Handle different resolutions/granularities
 * TODO: Format data for Recharts
 */
export function usePriceHistory(
  symbol: string,
  type: AssetType,
  resolution: string,
  from: number,
  to: number
) {
  return {
    data: [] as PriceData[],
    isLoading: false,
    error: null,
    refetch: () => {},
  };
}
