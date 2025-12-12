"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { HoldingsList } from "@/components/portfolio/HoldingsList";
import { formatCurrency } from "@/lib/utils";
import { orderApi } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function PortfolioDetailPage() {
  const params = useParams();
  const portfolioId = Number(params.id);
  const { portfolio, isLoading } = usePortfolio(portfolioId);
  const queryClient = useQueryClient();

  const [showTrade, setShowTrade] = useState(false);
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");

  const { totalValue, invested } = useMemo(() => {
    if (!portfolio) return { totalValue: 0, invested: 0 };

    const holdings = portfolio.holdings ?? [];
    const holdingsValue = holdings.reduce((sum, h) => {
      const unit = h.currentPrice ?? h.averageBuyPrice ?? 0;
      const val = h.currentValue ?? h.quantity * unit;
      return sum + val;
    }, 0);

    const tv = portfolio.totalValue ?? holdingsValue;
    const inv = tv;

    return { totalValue: tv, invested: inv };
  }, [portfolio]);

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!symbol || !qty || qty <= 0) {
      toast.error("Enter a symbol and a positive quantity.");
      return;
    }
    try {
      await orderApi.place({
        portfolioId,
        symbol: symbol.trim().toUpperCase(),
        type: tradeType,
        quantity: qty,
      });
      toast.success(`${tradeType === "BUY" ? "Bought" : "Sold"} ${qty} ${symbol.toUpperCase()}`);
      setShowTrade(false);
      setSymbol("");
      setQuantity("");
      // Refresh data: holdings, orders, cash
      queryClient.invalidateQueries({ queryKey: ["portfolio", portfolioId] });
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders-portfolio", portfolioId] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    } catch (_err) {
      toast.error("Trade failed. Check balance/holdings and try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl space-y-6 animate-pulse">
          <div className="h-9 w-56 bg-slate-800/80 rounded-lg" />
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-800/60 rounded-2xl border border-slate-800/80" />
            ))}
          </div>
          <div className="h-96 bg-slate-800/60 rounded-2xl border border-slate-800/80" />
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Card className="border border-slate-800/70 bg-white/5 backdrop-blur-xl shadow-xl">
            <CardContent className="py-16 text-center text-slate-300">
              Portfolio not found
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Portfolio</p>
            <h1 className="text-3xl font-semibold text-slate-50">{portfolio.name}</h1>
            {portfolio.description && (
              <p className="text-sm text-slate-400 max-w-2xl">{portfolio.description}</p>
            )}
          </div>
        </header>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Total Value"
            value={formatCurrency(totalValue)}
            accent="from-indigo-500/20 to-indigo-400/10"
          />
          <StatCard
            label="Invested"
            value={formatCurrency(invested)}
            accent="from-amber-500/20 to-amber-400/10"
          />
        </div>

        {/* Holdings with per-row trade actions */}
        <Card className="border border-slate-800/70 bg-white/5 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs">
                HD
              </span>
              Holdings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HoldingsList
              holdings={portfolio.holdings ?? []}
              onTrade={(type, sym) => {
                setTradeType(type);
                setSymbol(sym);
                setQuantity("");
                setShowTrade(true);
              }}
            />
          </CardContent>
        </Card>
      </div>

      {showTrade && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-50 mb-4">
              {tradeType === "BUY" ? "Buy Asset" : "Sell Asset"}
            </h2>
            <form className="space-y-4" onSubmit={handleTrade}>
              <div>
                <label className="text-sm text-slate-300">Symbol</label>
                <input
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. AAPL or BTC"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Quantity</label>
                <input
                  type="number"
                  min={0}
                  step="0.0001"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. 1.5"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTrade(false)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800/70 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-50 shadow hover:bg-emerald-400/90 transition"
                >
                  {tradeType === "BUY" ? "Buy" : "Sell"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <Card className="border border-slate-800/70 bg-gradient-to-br from-slate-900/80 to-slate-900/60 backdrop-blur-xl shadow-lg">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{label}</p>
            <p className="text-2xl font-semibold text-slate-50 mt-2">{value}</p>
          </div>
          <span
            className={`h-10 w-10 rounded-full bg-gradient-to-br ${accent} border border-slate-800/80`}
          />
        </div>
      </CardContent>
    </Card>
  );
}