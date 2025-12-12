"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { portfolioApi } from "@/lib/api";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { CreatePortfolioRequest, Portfolio } from "@/types";

export function usePortfolios() {
  const queryClient = useQueryClient();
  const { portfolios, setPortfolios } = usePortfolioStore();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<Portfolio[]>({
    queryKey: ["portfolios"],
    queryFn: async () => {
      const res = await portfolioApi.getAll();
      return res.data.data;
    },
    staleTime: 30_000,
  });

  useEffect(() => {
    if (data) setPortfolios(data ?? []);
  }, [data, setPortfolios]);

  // Create
  const createMutation = useMutation({
    mutationFn: (payload: CreatePortfolioRequest) =>
      portfolioApi.create(payload).then((r) => r.data.data),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      if (created) {
        setPortfolios([...(portfolios ?? []), created]);
      }
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (id: number) => portfolioApi.delete(id).then(() => id),
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      setPortfolios((portfolios ?? []).filter((p) => p.id !== id));
    },
  });

  // Deposit
  return {
    portfolios: data ?? portfolios ?? [],
    isLoading,
    error,
    refetch,
    createPortfolio: (payload: CreatePortfolioRequest) => createMutation.mutateAsync(payload),
    deletePortfolio: (id: number) => deleteMutation.mutateAsync(id),
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function usePortfolio(id: number) {
  const {
    data,
    isLoading,
    error, 
    refetch,
  } = useQuery<Portfolio | null>({
    queryKey: ["portfolio", id],
    queryFn: async () => {
      const res = await portfolioApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 15_000,
  });

  return {
    portfolio: data ?? null,
    isLoading,
    error,
    refetch,
  };
}