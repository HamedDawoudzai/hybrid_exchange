"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { limitOrderApi } from "@/lib/api";
import type { LimitOrder, LimitOrderRequest, LimitOrderStatus } from "@/types";

export function useLimitOrders(status?: LimitOrderStatus) {
  const queryClient = useQueryClient();

  const { data: limitOrders = [], isLoading, error, refetch } = useQuery({
    queryKey: ["limitOrders", status],
    queryFn: async () => {
      const res = await limitOrderApi.getAll(status);
      return res.data.data;
    },
    staleTime: 10_000, // 10 seconds
    refetchInterval: 30_000, // Auto-refresh every 30 seconds to get updated prices
  });

  const createMutation = useMutation({
    mutationFn: (data: LimitOrderRequest) => limitOrderApi.create(data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["limitOrders"] });
      queryClient.invalidateQueries({ queryKey: ["me"] }); // Refresh user cash balance
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId: number) => limitOrderApi.cancel(orderId).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["limitOrders"] });
      queryClient.invalidateQueries({ queryKey: ["me"] }); // Refresh user cash balance
    },
  });

  return {
    limitOrders,
    isLoading,
    error,
    refetch,
    createLimitOrder: (data: LimitOrderRequest) => createMutation.mutateAsync(data),
    cancelLimitOrder: (orderId: number) => cancelMutation.mutateAsync(orderId),
    isCreating: createMutation.isPending,
    isCancelling: cancelMutation.isPending,
    createError: createMutation.error,
    cancelError: cancelMutation.error,
  };
}

export function usePendingLimitOrders() {
  return useLimitOrders("PENDING");
}

