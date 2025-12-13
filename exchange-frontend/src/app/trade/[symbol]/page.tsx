"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PriceChart } from "@/components/charts/PriceChart";
import { OrderForm } from "@/components/trade/OrderForm";
import { usePortfolios } from "@/hooks/usePortfolio";
import { useAuth } from "@/hooks/useAuth";
import { usePrice, usePriceHistory } from "@/hooks/usePrices";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { assetApi, orderApi } from "@/lib/api";
import type { OrderRequest, OrderType, Asset } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { fireGoldConfetti } from "@/lib/confetti";
import { toast } from "sonner";

export default function TradeSymbolPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const symbol = (params.symbol as string)?.toUpperCase();

  const {
    data: asset,
    isLoading: isAssetLoading,
    error: assetError,
  } = useQuery<Asset>({
    queryKey: ["asset", symbol],
    queryFn: async () => {
      const res = await assetApi.getBySymbol(symbol);
      return res.data.data;
    },
  });

  const assetType = asset?.type ?? "STOCK";

  const { data: priceData, isLoading: isPriceLoading } = usePrice(symbol, assetType as any, 10_000);

  const now = Math.floor(Date.now() / 1000);
  const from = assetType === "STOCK" 
    ? now - 30 * 24 * 60 * 60
    : now - 24 * 60 * 60;
  const resolutionOrGranularity = assetType === "STOCK" ? "D" : "3600";
  const { data: historyData, isLoading: isHistoryLoading } = usePriceHistory(
    symbol,
    assetType as any,
    resolutionOrGranularity,
    from,
    now
  );

  const { portfolios } = usePortfolios();
  const { user } = useAuth();
  const cashBalance = user?.cashBalance ?? 0;

  const currentPrice = priceData?.price ?? 0;
  const change = priceData?.change ?? 0;
  const changePct = priceData?.changePercent ?? 0;

  const changeLabel = useMemo(
    () =>
      currentPrice
        ? `${change >= 0 ? "+" : "-"}${formatCurrency(Math.abs(change))} (${changePct.toFixed(2)}%)`
        : "--",
    [change, changePct, currentPrice]
  );
  const changeClass = change >= 0 ? "text-success-500" : "text-danger-500";

  const handleOrder = async (type: OrderType, quantity: number, portfolioId?: number) => {
    if (!portfolioId || quantity <= 0) {
      toast.error("Select a portfolio and enter a valid quantity.");
      return;
    }
    const payload: OrderRequest = {
      portfolioId,
      symbol,
      type,
      quantity,
    };
    try {
      await orderApi.place(payload);
      
      // Fire confetti on successful BUY order
      if (type === "BUY") {
        fireGoldConfetti();
      }
      
      toast.success(type === "BUY" ? `Successfully bought ${symbol}!` : `Successfully sold ${symbol}`);
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders-portfolio", portfolioId] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.refresh();
    } catch (_err) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  const isLoading = isAssetLoading || isPriceLoading || isHistoryLoading;

  if (assetError) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-10 flex items-center justify-center">
        <p className="text-sm text-danger-400">Failed to load asset.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gold-600/3 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/3 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-px bg-gold-600/50"></span>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600">Trade</p>
            </div>
            <h1 className="text-3xl font-serif font-light text-white">{symbol}</h1>
            <p className="text-sm text-neutral-500">{asset?.name ?? "Asset"}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-serif text-white">
              {currentPrice ? formatCurrency(currentPrice) : "--"}
            </p>
            <p className={`text-sm font-medium ${changeClass}`}>{changeLabel}</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart */}
          <Card className="lg:col-span-2 border border-neutral-800/50 bg-neutral-950/50">
            <CardHeader className="border-b border-neutral-800/50">
              <CardTitle className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-gold-600/10 text-gold-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </span>
                <span className="font-serif">Price Chart</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PriceChart data={historyData ?? []} isLoading={isHistoryLoading} />
            </CardContent>
          </Card>

          {/* Order Form */}
          <Card className="border border-neutral-800/50 bg-neutral-950/50">
            <CardHeader className="border-b border-neutral-800/50">
              <CardTitle className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-gold-600/10 text-gold-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                <span className="font-serif">Place Order</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {portfolios.length === 0 ? (
                <p className="text-center py-8 text-neutral-400">
                  Create a portfolio first to start trading.
                </p>
              ) : (
                <OrderForm
                  symbol={symbol}
                  currentPrice={currentPrice}
                  onSubmit={handleOrder}
                  isLoading={isLoading}
                  portfolios={portfolios}
                  cashBalance={cashBalance}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
