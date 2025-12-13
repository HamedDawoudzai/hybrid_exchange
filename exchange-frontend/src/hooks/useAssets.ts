"use client";

import { useQuery } from "@tanstack/react-query";
import { assetApi } from "@/lib/api";
import type { AssetType, Asset } from "@/types";

interface UseAssetsOptions {
  filter?: AssetType | "all";
  enabled?: boolean;
  /** Polling interval in ms. Set to 0 to disable. Default: 30000 (30s) */
  refetchInterval?: number;
}

export function useAssets(options: UseAssetsOptions = {}) {
  const { filter = "all", enabled = true, refetchInterval = 30_000 } = options;

  const query = useQuery<Asset[]>({
    queryKey: ["assets", filter],
    enabled,
    queryFn: async () => {
      if (filter === "STOCK") {
        const res = await assetApi.getStocks();
        return res.data.data;
      }
      if (filter === "CRYPTO") {
        const res = await assetApi.getCrypto();
        return res.data.data;
      }
      const res = await assetApi.getAll();
      return res.data.data;
    },
    staleTime: 15_000, // Consider data stale after 15s
    refetchInterval: refetchInterval > 0 ? refetchInterval : false, // Poll for updates
    refetchIntervalInBackground: false, // Don't poll when tab is not focused
  });

  return {
    assets: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching, // True during background refetches
    error: query.error,
    refetch: query.refetch,
    dataUpdatedAt: query.dataUpdatedAt, // Timestamp of last successful fetch
  };
}