"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PriceChart } from "@/components/charts/PriceChart";
import { OrderForm } from "@/components/trade/OrderForm";
import { usePortfolios } from "@/hooks/usePortfolio";
import { usePrice, usePriceHistory } from "@/hooks/usePrices";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { assetApi, orderApi } from "@/lib/api";
import type { OrderRequest, OrderType, Asset } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function TradeSymbolPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const symbol = (params.symbol as string)?.toUpperCase();

  // 1) Fetch asset detail to derive type and name
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

  const assetType = asset?.type ?? "STOCK"; // fallback to STOCK if somehow missing

  // 2) Live price
  const { data: priceData, isLoading: isPriceLoading } = usePrice(symbol, assetType as any, 10_000);

  // 3) Price history (last 24h)
  const now = Math.floor(Date.now() / 1000);
  const from = now - 24 * 60 * 60;
  const resolutionOrGranularity = assetType === "STOCK" ? "D" : "3600";
  const { data: historyData, isLoading: isHistoryLoading } = usePriceHistory(
    symbol,
    assetType as any,
    resolutionOrGranularity,
    from,
    now
  );

  // 4) Portfolios for order placement
  const { portfolios } = usePortfolios();

  const currentPrice = priceData?.price ?? 0;
  const change = priceData?.change ?? 0;
  const changePct = priceData?.changePercent ?? 0;

  const changeLabel = useMemo(
    () =>
      currentPrice
        ? `${change >= 0 ? "+" : "-"}${formatCurrency(Math.abs(change))} (${changePct.toFixed(
            2
          )}%)`
        : "--",
    [change, changePct, currentPrice]
  );
  const changeClass = change >= 0 ? "text-emerald-400" : "text-rose-400";

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
      toast.success("Order placed");
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders-portfolio", portfolioId] });
      queryClient.invalidateQueries({ queryKey: ["me"] }); // refresh user cashBalance
      router.refresh();
    } catch (_err) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  const isLoading = isAssetLoading || isPriceLoading || isHistoryLoading;

  if (assetError) {
    toast.error("Failed to load asset.");
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 px-4 py-10 flex items-center justify-center">
        <p className="text-sm text-rose-400">Failed to load asset.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Trade</p>
            <h1 className="text-3xl font-semibold text-slate-50">{symbol}</h1>
            <p className="text-sm text-slate-400">{asset?.name ?? "Asset"}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-50">
              {currentPrice ? formatCurrency(currentPrice) : "--"}
            </p>
            <p className={`text-sm font-medium ${changeClass}`}>{changeLabel}</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart */}
          <Card className="lg:col-span-2 border border-slate-800/70 bg-white/5 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs">
                  CH
                </span>
                Price Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PriceChart data={historyData ?? []} isLoading={isHistoryLoading} />
            </CardContent>
          </Card>

          {/* Order Form */}
          <Card className="border border-slate-800/70 bg-white/5 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs">
                  OR
                </span>
                Place Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              {portfolios.length === 0 ? (
                <p className="text-center py-8 text-slate-300">
                  Create a portfolio first to start trading.
                </p>
              ) : (
                <OrderForm
                  symbol={symbol}
                  currentPrice={currentPrice}
                  onSubmit={handleOrder}
                  isLoading={isLoading}
                  portfolios={portfolios}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}