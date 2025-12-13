"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stopOrderApi } from "@/lib/api";
import type { StopOrder, StopOrderRequest, StopOrderStatus } from "@/types";

export function useStopOrders(status?: StopOrderStatus) {
  const queryClient = useQueryClient();

  const { data: stopOrders = [], isLoading, error, refetch } = useQuery({
    queryKey: ["stopOrders", status],
    queryFn: async () => {
      const res = await stopOrderApi.getAll(status);
      return res.data.data;
    },
    staleTime: 10_000,
    refetchInterval: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: (data: StopOrderRequest) => stopOrderApi.create(data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stopOrders"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId: number) => stopOrderApi.cancel(orderId).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stopOrders"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  return {
    stopOrders,
    isLoading,
    error,
    refetch,
    createStopOrder: (data: StopOrderRequest) => createMutation.mutateAsync(data),
    cancelStopOrder: (orderId: number) => cancelMutation.mutateAsync(orderId),
    isCreating: createMutation.isPending,
    isCancelling: cancelMutation.isPending,
    createError: createMutation.error,
    cancelError: cancelMutation.error,
  };
}

export function usePendingStopOrders() {
  return useStopOrders("PENDING");
}

