"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/lib/api";
import type { Order, OrderRequest } from "@/types";

export function useOrders(portfolioId?: number) {
  const queryClient = useQueryClient();

  const queryKey = portfolioId ? ["orders-portfolio", portfolioId] : ["orders"];

  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Order[]>({
    queryKey,
    queryFn: async () => {
      if (portfolioId) {
        const res = await orderApi.getByPortfolio(portfolioId);
        return res.data.data;
      }
      const res = await orderApi.getAll();
      return res.data.data;
    },
    staleTime: 30_000,
  });

  const placeOrder = useMutation({
    mutationFn: async (payload: OrderRequest) => {
      const res = await orderApi.place(payload);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["me"] }); // refresh user cashBalance
      if (variables.portfolioId) {
        queryClient.invalidateQueries({ queryKey: ["orders-portfolio", variables.portfolioId] });
        queryClient.invalidateQueries({ queryKey: ["portfolios"] });
        queryClient.invalidateQueries({ queryKey: ["portfolio", variables.portfolioId] });
      }
    },
  });

  return {
    orders,
    isLoading,
    error,
    refetch,
    placeOrder: placeOrder.mutate,
    isPlacing: placeOrder.isPending,
    placeError: placeOrder.error,
  };
}