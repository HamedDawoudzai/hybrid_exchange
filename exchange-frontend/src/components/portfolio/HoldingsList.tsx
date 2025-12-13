import type { Holding } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface HoldingsListProps {
  holdings: Holding[];
  isLoading?: boolean;
  onTrade?: (type: "BUY" | "SELL", symbol: string) => void;
}

export function HoldingsList({ holdings, isLoading, onTrade }: HoldingsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded border border-neutral-800/50 bg-neutral-900/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-400">
        No holdings yet. Start trading to build your portfolio.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {holdings.map((holding) => {
        const pnl = holding.profitLoss ?? 0;
        const pnlPct = holding.profitLossPercent ?? 0;
        const costBasis = holding.quantity * holding.averageBuyPrice;
        const currentPrice = holding.currentPrice ?? holding.averageBuyPrice;
        const priceVsAvg = currentPrice - holding.averageBuyPrice;
        const priceVsAvgPct = holding.averageBuyPrice > 0 
          ? ((currentPrice - holding.averageBuyPrice) / holding.averageBuyPrice) * 100 
          : 0;
        
        const isAboveAvg = currentPrice > holding.averageBuyPrice;
        const pnlClass = pnl >= 0 ? "text-success-500" : "text-danger-500";
        const priceIndicatorClass = isAboveAvg ? "text-success-500" : "text-danger-500";

        return (
          <div key={holding.id} className="border border-neutral-800/50 rounded-lg bg-neutral-900/30 overflow-hidden">
            {/* Header Row */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/30 to-orange-500/20 flex items-center justify-center text-gold-300 text-sm font-bold">
                  {holding.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-white">{holding.symbol}</p>
                  <p className="text-xs text-neutral-500">{holding.assetName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-white">
                  {holding.currentValue != null ? formatCurrency(holding.currentValue) : "--"}
                </p>
                <p className={`text-sm font-semibold ${pnlClass}`}>
                  {pnl >= 0 ? "+" : ""}{formatCurrency(pnl)} ({pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%)
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-800/30">
              <div className="bg-neutral-900/60 p-3">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Shares Held</p>
                <p className="text-sm font-medium text-white">{formatNumber(holding.quantity, 6)}</p>
              </div>
              <div className="bg-neutral-900/60 p-3">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Avg Cost</p>
                <p className="text-sm font-medium text-white">{formatCurrency(holding.averageBuyPrice)}</p>
              </div>
              <div className="bg-neutral-900/60 p-3">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Current Price</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{formatCurrency(currentPrice)}</p>
                  <span className={`text-[10px] font-semibold ${priceIndicatorClass}`}>
                    {isAboveAvg ? "↑" : "↓"} {Math.abs(priceVsAvgPct).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="bg-neutral-900/60 p-3">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Cost Basis</p>
                <p className="text-sm font-medium text-white">{formatCurrency(costBasis)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-2 bg-neutral-950/50 flex justify-end gap-2">
              <button
                onClick={() => onTrade?.("BUY", holding.symbol)}
                className="rounded bg-success-500/20 border border-success-500/30 px-3 py-1.5 text-xs font-semibold text-success-400 hover:bg-success-500/30 transition"
              >
                Buy More
              </button>
              <button
                onClick={() => onTrade?.("SELL", holding.symbol)}
                className="rounded bg-danger-500/20 border border-danger-500/30 px-3 py-1.5 text-xs font-semibold text-danger-400 hover:bg-danger-500/30 transition"
              >
                Sell
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
