"use client";

import { useQuery } from "@tanstack/react-query";
import { assetApi } from "@/lib/api";
import type { AssetType, Asset } from "@/types";

interface UseAssetsOptions {
  filter?: AssetType | "all";
  enabled?: boolean;
}

export function useAssets(options: UseAssetsOptions = {}) {
  const { filter = "all", enabled = true } = options;

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
    staleTime: 60_000,
  });

  return {
    assets: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}