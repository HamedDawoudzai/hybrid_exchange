"use client";

import { useQuery } from "@tanstack/react-query";
import { priceApi } from "@/lib/api";
import type { AssetType, PriceData } from "@/types";

export function usePrice(symbol: string, type: AssetType, refetchMs = 10_000) {
  const queryFn = async () => {
    if (type === "STOCK") {
      const res = await priceApi.getStockPrice(symbol);
      return res.data.data;
    }
    const res = await priceApi.getCryptoPrice(symbol);
    return res.data.data;
  };

  const query = useQuery({
    queryKey: ["price", type, symbol],
    queryFn,
    enabled: !!symbol,
    refetchInterval: refetchMs,
    staleTime: refetchMs,
  });

  return {
    data: query.data as PriceData | null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function usePriceHistory(
  symbol: string,
  type: AssetType,
  resolutionOrGranularity: string,
  from: number,
  to: number
) {
  const queryFn = async () => {
    if (type === "STOCK") {
      const res = await priceApi.getStockHistory(symbol, resolutionOrGranularity, from, to);
      return res.data.data;
    }
    const res = await priceApi.getCryptoHistory(symbol, resolutionOrGranularity, from, to);
    return res.data.data;
  };

  const query = useQuery({
    queryKey: ["priceHistory", type, symbol, resolutionOrGranularity, from, to],
    queryFn,
    enabled: !!symbol && !!from && !!to,
    staleTime: 60_000,
  });

  return {
    data: (query.data as PriceData[]) ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}