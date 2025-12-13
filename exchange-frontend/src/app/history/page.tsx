"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function HistoryPage() {
  const { orders, isLoading, error } = useOrders();

  useEffect(() => {
    if (error) {
      toast.error("Failed to load orders. Please try again.");
    }
  }, [error]);

  const sorted = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders]
  );

  const hasData = sorted.length > 0;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gold-600/3 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/3 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-px bg-gold-600/50"></span>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600">History</p>
          </div>
          <h1 className="text-3xl font-serif font-light text-white">Transaction History</h1>
          <p className="text-sm text-neutral-500">All your orders across portfolios, sorted by most recent.</p>
        </header>

        <Card className="border border-neutral-800/50 bg-neutral-950/50">
          <CardHeader className="border-b border-neutral-800/50">
            <CardTitle className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-gold-600/10 text-gold-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              <span className="font-serif">All Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded border border-neutral-800/50 bg-neutral-900/50 animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 text-danger-400 text-sm">
                Failed to load orders. Please try again.
              </div>
            ) : !hasData ? (
              <div className="text-center py-12">
                <p className="text-lg font-serif text-white">No transactions yet</p>
                <p className="text-sm text-neutral-500 mt-2">Place an order to see your history here.</p>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-7 gap-4 px-4 py-2 text-neutral-500 uppercase tracking-wide text-[10px]">
                  <span>Date</span>
                  <span>Asset</span>
                  <span>Type</span>
                  <span>Status</span>
                  <span className="text-right">Quantity</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Total</span>
                </div>
                <div className="divide-y divide-neutral-800/50 border border-neutral-800/50 rounded overflow-hidden bg-neutral-900/30">
                  {sorted.map((order) => {
                    const statusColors: Record<string, string> = {
                      COMPLETED: "bg-success-500/20 text-success-500",
                      PENDING: "bg-gold-500/20 text-gold-500",
                      CANCELLED: "bg-neutral-500/20 text-neutral-400",
                      FAILED: "bg-danger-500/20 text-danger-500",
                    };
                    
                    return (
                      <div key={order.id} className="p-4">
                        {/* Mobile Layout */}
                        <div className="md:hidden space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-white">{order.symbol}</p>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                                    order.type === "BUY" 
                                      ? "bg-success-500/20 text-success-500"
                                      : order.type === "SELL"
                                      ? "bg-danger-500/20 text-danger-500"
                                      : "bg-yellow-500/20 text-yellow-500"
                                  }`}
                                >
                                  {order.type}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-500">{order.assetName}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-white">
                                {formatCurrency(order.totalAmount)}
                              </p>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[order.status] ?? statusColors.PENDING}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-neutral-500">
                            <span>{formatDate(order.createdAt)}</span>
                            <span>{formatNumber(order.quantity, 4)} @ {formatCurrency(order.pricePerUnit)}</span>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden md:grid grid-cols-7 gap-4 items-center">
                          <span className="text-xs text-neutral-500">{formatDate(order.createdAt)}</span>
                          <div>
                            <p className="font-medium text-white">{order.symbol}</p>
                            <p className="text-xs text-neutral-500">{order.assetName}</p>
                          </div>
                          <span
                            className={`text-sm font-semibold ${
                              order.type === "BUY"
                                ? "text-success-500"
                                : order.type === "SELL"
                                ? "text-danger-500"
                                : "text-yellow-500"
                            }`}
                          >
                            {order.type}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium w-fit ${statusColors[order.status] ?? statusColors.PENDING}`}>
                            {order.status}
                          </span>
                          <span className="text-right text-neutral-300">
                            {formatNumber(order.quantity, 4)}
                          </span>
                          <span className="text-right text-neutral-300">
                            {formatCurrency(order.pricePerUnit)}
                          </span>
                          <span className="text-right font-semibold text-white">
                            {formatCurrency(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
