"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { watchlistApi } from "@/lib/api";
import type { WatchlistItem } from "@/types";

export function useWatchlist() {
  const queryClient = useQueryClient();

  const { data: watchlist = [], isLoading, error } = useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const res = await watchlistApi.getWatchlist();
      return res.data.data;
    },
    staleTime: 30_000, // 30 seconds
    refetchInterval: 30_000, // Auto-refresh every 30 seconds
  });

  const addMutation = useMutation({
    mutationFn: (symbol: string) => watchlistApi.addToWatchlist(symbol).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (symbol: string) => watchlistApi.removeFromWatchlist(symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  return {
    watchlist,
    isLoading,
    error,
    addToWatchlist: (symbol: string) => addMutation.mutateAsync(symbol),
    removeFromWatchlist: (symbol: string) => removeMutation.mutateAsync(symbol),
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}

export function useIsInWatchlist(symbol: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["watchlist", "check", symbol],
    queryFn: async () => {
      const res = await watchlistApi.checkWatchlist(symbol);
      return res.data.data.inWatchlist;
    },
    enabled: !!symbol,
    staleTime: 30_000,
  });

  return { inWatchlist: data ?? false, isLoading };
}

