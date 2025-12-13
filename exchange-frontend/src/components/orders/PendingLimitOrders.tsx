"use client";

import { usePendingLimitOrders } from "@/hooks/useLimitOrders";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { toast } from "sonner";

export function PendingLimitOrders() {
  const { limitOrders, isLoading, cancelLimitOrder, isCancelling } = usePendingLimitOrders();

  const handleCancel = async (orderId: number, symbol: string) => {
    try {
      await cancelLimitOrder(orderId);
      toast.success(`Cancelled limit order for ${symbol}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 rounded-lg bg-neutral-800/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (limitOrders.length === 0) {
    return (
      <div className="text-center py-6 text-neutral-500 text-sm">
        No pending limit orders
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {limitOrders.map((order) => {
        const isBuy = order.type === "BUY";
        const priceDiff = order.currentPrice 
          ? ((order.targetPrice - order.currentPrice) / order.currentPrice) * 100 
          : 0;

        return (
          <div
            key={order.id}
            className="p-3 rounded-lg border border-neutral-800/50 bg-neutral-900/30"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  isBuy ? "bg-success-500/20 text-success-500" : "bg-danger-500/20 text-danger-500"
                }`}>
                  {order.type}
                </span>
                <span className="font-semibold text-white text-sm">{order.symbol}</span>
              </div>
              <button
                onClick={() => handleCancel(order.id, order.symbol)}
                disabled={isCancelling}
                className="text-xs text-neutral-400 hover:text-danger-500 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-neutral-500">Target</p>
                <p className="text-white font-medium">{formatCurrency(order.targetPrice)}</p>
              </div>
              <div>
                <p className="text-neutral-500">Quantity</p>
                <p className="text-white font-medium">{formatNumber(order.quantity, 4)}</p>
              </div>
              <div>
                <p className="text-neutral-500">Current</p>
                <p className="text-white font-medium">
                  {order.currentPrice ? formatCurrency(order.currentPrice) : "--"}
                </p>
              </div>
            </div>

            {order.currentPrice && (
              <div className="mt-2 pt-2 border-t border-neutral-800/30">
                <p className={`text-[10px] ${
                  isBuy 
                    ? priceDiff < 0 ? "text-success-500" : "text-neutral-500"
                    : priceDiff > 0 ? "text-success-500" : "text-neutral-500"
                }`}>
                  {isBuy 
                    ? priceDiff <= 0 
                      ? `Target reached! Will fill soon.` 
                      : `Waiting for ${Math.abs(priceDiff).toFixed(1)}% drop`
                    : priceDiff >= 0 
                      ? `Target reached! Will fill soon.`
                      : `Waiting for ${Math.abs(priceDiff).toFixed(1)}% rise`
                  }
                </p>
              </div>
            )}

            {isBuy && order.reservedAmount > 0 && (
              <p className="text-[10px] text-neutral-500 mt-1">
                Reserved: {formatCurrency(order.reservedAmount)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

