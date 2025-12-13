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
    <div className="space-y-2">
      {/* Desktop Header */}
      <div className="hidden lg:grid grid-cols-7 gap-4 px-4 py-2 text-[10px] uppercase tracking-wide text-neutral-500">
        <span>Asset</span>
        <span className="text-right">Quantity</span>
        <span className="text-right">Avg Price</span>
        <span className="text-right">Current</span>
        <span className="text-right">Value</span>
        <span className="text-right">P/L</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="divide-y divide-neutral-800/50 border border-neutral-800/50 rounded overflow-hidden bg-neutral-900/30">
        {holdings.map((holding) => {
          const pnl = holding.profitLoss ?? null;
          const pnlPct = holding.profitLossPercent ?? null;
          const pnlClass =
            pnlPct == null
              ? "text-neutral-400"
              : pnlPct >= 0
              ? "text-success-500"
              : "text-danger-500";

          return (
            <div key={holding.id} className="p-4">
              {/* Mobile Layout */}
              <div className="lg:hidden space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{holding.symbol}</p>
                    <p className="text-xs text-neutral-500">{holding.assetName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">
                      {holding.currentValue != null ? formatCurrency(holding.currentValue) : "--"}
                    </p>
                    <p className={`text-xs font-semibold ${pnlClass}`}>
                      {pnl != null ? `${pnl >= 0 ? "+" : ""}${formatCurrency(pnl)}` : "--"}
                      {pnlPct != null ? ` (${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(2)}%)` : ""}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-neutral-600 uppercase tracking-wide">Qty</p>
                    <p className="text-neutral-300">{formatNumber(holding.quantity, 4)}</p>
                  </div>
                  <div>
                    <p className="text-neutral-600 uppercase tracking-wide">Avg</p>
                    <p className="text-neutral-300">{formatCurrency(holding.averageBuyPrice)}</p>
                  </div>
                  <div>
                    <p className="text-neutral-600 uppercase tracking-wide">Price</p>
                    <p className="text-neutral-300">
                      {holding.currentPrice != null ? formatCurrency(holding.currentPrice) : "--"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onTrade?.("BUY", holding.symbol)}
                    className="flex-1 rounded bg-success-500 px-3 py-2 text-xs font-semibold text-white hover:bg-success-600 transition"
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => onTrade?.("SELL", holding.symbol)}
                    className="flex-1 rounded bg-danger-500 px-3 py-2 text-xs font-semibold text-white hover:bg-danger-600 transition"
                  >
                    Sell
                  </button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:grid grid-cols-7 gap-4 items-center text-sm">
                <div>
                  <p className="font-semibold text-white">{holding.symbol}</p>
                  <p className="text-xs text-neutral-500">{holding.assetName}</p>
                </div>
                <span className="text-right text-neutral-300">
                  {formatNumber(holding.quantity, 4)}
                </span>
                <span className="text-right text-neutral-300">
                  {formatCurrency(holding.averageBuyPrice)}
                </span>
                <span className="text-right text-neutral-300">
                  {holding.currentPrice != null ? formatCurrency(holding.currentPrice) : "--"}
                </span>
                <span className="text-right text-white">
                  {holding.currentValue != null ? formatCurrency(holding.currentValue) : "--"}
                </span>
                <span className={`text-right font-semibold ${pnlClass}`}>
                  {pnl != null ? formatCurrency(pnl) : "--"}
                  {pnlPct != null ? ` (${pnlPct.toFixed(2)}%)` : ""}
                </span>
                <div className="flex justify-end gap-2 text-xs">
                  <button
                    onClick={() => onTrade?.("BUY", holding.symbol)}
                    className="rounded bg-success-500 px-3 py-1.5 font-semibold text-white hover:bg-success-600 transition"
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => onTrade?.("SELL", holding.symbol)}
                    className="rounded bg-danger-500 px-3 py-1.5 font-semibold text-white hover:bg-danger-600 transition"
                  >
                    Sell
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
