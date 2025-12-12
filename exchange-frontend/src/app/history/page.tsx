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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">History</p>
          <h1 className="text-3xl font-semibold text-slate-50">Transaction History</h1>
          <p className="text-sm text-slate-400">All your orders across portfolios, sorted by most recent.</p>
        </header>

        <Card className="border border-slate-800/70 bg-white/5 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs">
                TX
              </span>
              All Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-xl border border-slate-800/70 bg-slate-900/60 animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 text-rose-300 text-sm">
                Failed to load orders. Please try again.
              </div>
            ) : !hasData ? (
              <div className="text-center py-12 text-slate-300">
                <p className="text-lg font-medium">No transactions yet</p>
                <p className="text-sm text-slate-400 mt-2">Place an order to see your history here.</p>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-6 gap-4 px-4 py-2 text-slate-400 uppercase tracking-wide text-xs">
                  <span>Date</span>
                  <span>Asset</span>
                  <span>Type</span>
                  <span className="text-right">Quantity</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Total</span>
                </div>
                <div className="divide-y divide-slate-800/70 border border-slate-800/70 rounded-xl overflow-hidden bg-slate-900/40">
                  {sorted.map((order) => (
                    <div
                      key={order.id}
                      className="grid grid-cols-6 gap-4 px-4 py-3 items-center text-slate-100"
                    >
                      <span className="text-xs text-slate-400">{formatDate(order.createdAt)}</span>
                      <div>
                        <p className="font-medium">{order.symbol}</p>
                        <p className="text-xs text-slate-400">{order.assetName}</p>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          order.type === "BUY" ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {order.type}
                      </span>
                      <span className="text-right text-slate-100">
                        {formatNumber(order.quantity, 4)}
                      </span>
                      <span className="text-right text-slate-100">
                        {formatCurrency(order.pricePerUnit)}
                      </span>
                      <span className="text-right font-semibold text-slate-50">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}