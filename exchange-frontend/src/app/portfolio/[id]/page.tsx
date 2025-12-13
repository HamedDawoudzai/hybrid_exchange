"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { HoldingsList } from "@/components/portfolio/HoldingsList";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { orderApi, priceApi } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function PortfolioDetailPage() {
  const params = useParams();
  const portfolioId = Number(params.id);
  const { portfolio, isLoading } = usePortfolio(portfolioId);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showTrade, setShowTrade] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sliderValue, setSliderValue] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  const cashBalance = user?.cashBalance ?? 0;

  const { totalValue, invested, profitLoss, profitLossPercent } = useMemo(() => {
    if (!portfolio) return { totalValue: 0, invested: 0, profitLoss: 0, profitLossPercent: 0 };

    const holdings = portfolio.holdings ?? [];
    
    const currentValue = holdings.reduce((sum, h) => {
      const price = h.currentPrice ?? h.averageBuyPrice ?? 0;
      return sum + h.quantity * price;
    }, 0);

    const costBasis = holdings.reduce((sum, h) => {
      return sum + h.quantity * (h.averageBuyPrice ?? 0);
    }, 0);

    const tv = portfolio.totalValue ?? currentValue;
    const pnl = currentValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

    return { 
      totalValue: tv, 
      invested: costBasis, 
      profitLoss: pnl,
      profitLossPercent: pnlPercent
    };
  }, [portfolio]);

  const holdingQuantity = useMemo(() => {
    if (!portfolio?.holdings || !symbol) return 0;
    const holding = portfolio.holdings.find(h => h.symbol === symbol.toUpperCase());
    return holding?.quantity ?? 0;
  }, [portfolio?.holdings, symbol]);

  const maxBuyQuantity = currentPrice > 0 ? cashBalance / currentPrice : 0;

  useEffect(() => {
    if (!symbol || symbol.length < 1) {
      setCurrentPrice(0);
      return;
    }

    const fetchPrice = async () => {
      setIsFetchingPrice(true);
      try {
        const holding = portfolio?.holdings?.find(h => h.symbol === symbol.toUpperCase());
        if (holding?.currentPrice) {
          setCurrentPrice(holding.currentPrice);
          setIsFetchingPrice(false);
          return;
        }
        
        try {
          const res = await priceApi.getStockPrice(symbol);
          setCurrentPrice(res.data.data.price);
        } catch {
          try {
            const res = await priceApi.getCryptoPrice(symbol);
            setCurrentPrice(res.data.data.price);
          } catch {
            setCurrentPrice(0);
          }
        }
      } catch {
        setCurrentPrice(0);
      }
      setIsFetchingPrice(false);
    };

    const debounce = setTimeout(fetchPrice, 500);
    return () => clearTimeout(debounce);
  }, [symbol, portfolio?.holdings]);

  useEffect(() => {
    setSliderValue(0);
  }, [showTrade, tradeType]);

  const handlePercentage = (percent: number) => {
    if (tradeType === "BUY") {
      const qty = (maxBuyQuantity * percent) / 100;
      setQuantity(qty > 0 ? qty.toFixed(6) : "");
    } else {
      const qty = (holdingQuantity * percent) / 100;
      setQuantity(qty > 0 ? qty.toFixed(6) : "");
    }
    setSliderValue(percent);
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    if (tradeType === "BUY") {
      const qty = (maxBuyQuantity * value) / 100;
      setQuantity(qty > 0 ? qty.toFixed(6) : "");
    } else {
      const qty = (holdingQuantity * value) / 100;
      setQuantity(qty > 0 ? qty.toFixed(6) : "");
    }
  };

  const estimatedTotal = parseFloat(quantity || "0") * currentPrice;

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!symbol || !qty || qty <= 0) {
      toast.error("Enter a symbol and a positive quantity.");
      return;
    }
    setIsSubmitting(true);
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
      queryClient.invalidateQueries({ queryKey: ["portfolio", portfolioId] });
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders-portfolio", portfolioId] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    } catch (_err) {
      toast.error("Trade failed. Check balance/holdings and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-10">
        <div className="mx-auto max-w-5xl space-y-6 animate-pulse">
          <div className="h-9 w-56 bg-neutral-800/80 rounded-lg" />
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-neutral-800/60 rounded-lg border border-neutral-800/80" />
            ))}
          </div>
          <div className="h-96 bg-neutral-800/60 rounded-lg border border-neutral-800/80" />
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Card className="border border-neutral-800/50 bg-neutral-950/50">
            <CardContent className="py-16 text-center text-neutral-400">
              Portfolio not found
            </CardContent>
          </Card>
        </div>
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
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-px bg-gold-600/50"></span>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600">Portfolio</p>
            </div>
            <h1 className="text-3xl font-serif font-light text-white">{portfolio.name}</h1>
            {portfolio.description && (
              <p className="text-sm text-neutral-500 max-w-2xl mt-1">{portfolio.description}</p>
            )}
          </div>
        </header>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Total Value"
            value={formatCurrency(totalValue)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Cost Basis"
            value={formatCurrency(invested)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            label="Profit / Loss"
            value={`${formatCurrency(profitLoss)} (${profitLossPercent >= 0 ? "+" : ""}${profitLossPercent.toFixed(2)}%)`}
            valueColor={profitLoss >= 0 ? "text-success-500" : "text-danger-500"}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
        </div>

        {/* Holdings */}
        <Card className="border border-neutral-800/50 bg-neutral-950/50">
          <CardHeader className="border-b border-neutral-800/50">
            <CardTitle className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-gold-600/10 text-gold-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
              <span className="font-serif">Holdings</span>
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

      {/* Trade Modal */}
      {showTrade && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded flex items-center justify-center ${
                  tradeType === "BUY" ? "bg-success-500/10 text-success-500" : "bg-danger-500/10 text-danger-500"
                }`}>
                  {tradeType === "BUY" ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  )}
                </span>
                <h2 className="text-lg font-serif text-white">
                  {tradeType === "BUY" ? "Buy Asset" : "Sell Asset"}
                </h2>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                tradeType === "BUY" 
                  ? "bg-success-500/20 text-success-500" 
                  : "bg-danger-500/20 text-danger-500"
              }`}>
                {tradeType}
              </span>
            </div>
            <form className="space-y-4" onSubmit={handleTrade}>
              {/* Symbol Input */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">Symbol</label>
                <input
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="w-full rounded border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-white placeholder-neutral-600 focus:border-gold-600/50 focus:outline-none focus:ring-1 focus:ring-gold-600/20 transition-all duration-200"
                  placeholder="e.g. AAPL or BTC"
                  disabled={isSubmitting}
                />
                {isFetchingPrice && (
                  <p className="text-xs text-neutral-500 mt-1">Fetching price...</p>
                )}
                {currentPrice > 0 && !isFetchingPrice && (
                  <p className="text-xs text-neutral-400 mt-1">
                    Current price: <span className="text-white font-medium">{formatCurrency(currentPrice)}</span>
                  </p>
                )}
              </div>

              {/* Available Balance / Holdings Info */}
              <div className="text-xs flex justify-between py-3 px-4 rounded border border-neutral-800/50 bg-neutral-900/30">
                {tradeType === "BUY" ? (
                  <>
                    <span className="text-neutral-500">Available Cash:</span>
                    <span className="text-white font-medium">{formatCurrency(cashBalance)}</span>
                  </>
                ) : (
                  <>
                    <span className="text-neutral-500">Available to Sell:</span>
                    <span className="text-white font-medium">
                      {holdingQuantity > 0 ? `${formatNumber(holdingQuantity, 4)} ${symbol}` : `No ${symbol} holdings`}
                    </span>
                  </>
                )}
              </div>

              {/* Percentage Buttons */}
              <div className="flex gap-2">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePercentage(pct)}
                    disabled={
                      (tradeType === "SELL" && holdingQuantity === 0) ||
                      (tradeType === "BUY" && (cashBalance === 0 || currentPrice === 0))
                    }
                    className={`flex-1 py-2 text-xs font-bold rounded border transition ${
                      sliderValue === pct
                        ? tradeType === "BUY"
                          ? "bg-success-500/20 border-success-500/50 text-success-500"
                          : "bg-danger-500/20 border-danger-500/50 text-danger-500"
                        : "border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={(e) => handleSliderChange(Number(e.target.value))}
                  disabled={
                    (tradeType === "SELL" && holdingQuantity === 0) ||
                    (tradeType === "BUY" && (cashBalance === 0 || currentPrice === 0))
                  }
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(to right, ${
                      tradeType === "BUY" ? "#22c55e" : "#ef4444"
                    } 0%, ${
                      tradeType === "BUY" ? "#22c55e" : "#ef4444"
                    } ${sliderValue}%, #262626 ${sliderValue}%, #262626 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>0%</span>
                  <span className={`font-medium ${tradeType === "BUY" ? "text-success-500" : "text-danger-500"}`}>
                    {sliderValue}%
                  </span>
                  <span>100%</span>
                </div>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">Quantity</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    const qty = parseFloat(e.target.value) || 0;
                    if (tradeType === "BUY" && maxBuyQuantity > 0) {
                      setSliderValue(Math.min(100, (qty / maxBuyQuantity) * 100));
                    } else if (tradeType === "SELL" && holdingQuantity > 0) {
                      setSliderValue(Math.min(100, (qty / holdingQuantity) * 100));
                    }
                  }}
                  className="w-full rounded border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-white placeholder-neutral-600 focus:border-gold-600/50 focus:outline-none focus:ring-1 focus:ring-gold-600/20 transition-all duration-200"
                  placeholder="e.g. 1.5"
                  disabled={isSubmitting}
                />
              </div>

              {/* Estimated Total */}
              {currentPrice > 0 && quantity && (
                <div className="flex justify-between text-sm py-3 px-4 rounded border border-neutral-800/50 bg-neutral-900/30">
                  <span className="text-neutral-500">Estimated {tradeType === "BUY" ? "Cost" : "Proceeds"}:</span>
                  <span className={`font-bold ${tradeType === "BUY" ? "text-danger-500" : "text-success-500"}`}>
                    {formatCurrency(estimatedTotal)}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowTrade(false);
                    setSliderValue(0);
                    setCurrentPrice(0);
                  }}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !symbol || !quantity || parseFloat(quantity) <= 0}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    tradeType === "BUY"
                      ? "bg-success-500 text-white hover:bg-success-600"
                      : "bg-danger-500 text-white hover:bg-danger-600"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>{tradeType === "BUY" ? "Buy" : "Sell"} {symbol || "Asset"}</>
                  )}
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
  icon,
  valueColor,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  valueColor?: string;
}) {
  return (
    <Card className="border border-neutral-800/50 bg-neutral-950/50 hover:border-gold-600/20 transition-all duration-300 card-hover">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-500">{label}</p>
            <p className={`text-2xl font-serif mt-2 ${valueColor ?? "text-white"}`}>{value}</p>
          </div>
          <span className="h-10 w-10 rounded bg-gold-600/10 flex items-center justify-center text-gold-600">
            {icon}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
