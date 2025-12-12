import type { Holding } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface HoldingsListProps {
  holdings: Holding[];
  isLoading?: boolean;
  onTrade?: (type: "BUY" | "SELL", symbol: string) => void; // new
}

export function HoldingsList({ holdings, isLoading, onTrade }: HoldingsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-lg border border-slate-800/70 bg-slate-900/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-center py-8 text-slate-300">
        No holdings yet. Start trading to build your portfolio.
      </div>
    );
  }

  return (
    <div className="space-y-2 text-slate-100">
      <div className="grid grid-cols-7 gap-4 px-4 py-2 text-xs uppercase tracking-wide text-slate-400">
        <span>Asset</span>
        <span className="text-right">Quantity</span>
        <span className="text-right">Avg Price</span>
        <span className="text-right">Current</span>
        <span className="text-right">Value</span>
        <span className="text-right">P/L</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="divide-y divide-slate-800/70 border border-slate-800/70 rounded-xl overflow-hidden bg-slate-900/40">
        {holdings.map((holding) => {
          const pnl = holding.profitLoss ?? null;
          const pnlPct = holding.profitLossPercent ?? null;
          const pnlClass =
            pnlPct == null
              ? "text-slate-300"
              : pnlPct >= 0
              ? "text-emerald-400"
              : "text-rose-400";

          return (
            <div
              key={holding.id}
              className="grid grid-cols-7 gap-4 px-4 py-3 items-center text-sm"
            >
              <div>
                <p className="font-semibold text-slate-50">{holding.symbol}</p>
                <p className="text-xs text-slate-400">{holding.assetName}</p>
              </div>
              <span className="text-right text-slate-100">
                {formatNumber(holding.quantity, 4)}
              </span>
              <span className="text-right text-slate-100">
                {formatCurrency(holding.averageBuyPrice)}
              </span>
              <span className="text-right text-slate-100">
                {holding.currentPrice != null ? formatCurrency(holding.currentPrice) : "--"}
              </span>
              <span className="text-right text-slate-100">
                {holding.currentValue != null ? formatCurrency(holding.currentValue) : "--"}
              </span>
              <span className={`text-right font-semibold ${pnlClass}`}>
                {pnl != null ? formatCurrency(pnl) : "--"}
                {pnlPct != null ? ` (${pnlPct.toFixed(2)}%)` : ""}
              </span>
              <div className="flex justify-end gap-2 text-xs">
                <button
                  onClick={() => onTrade?.("BUY", holding.symbol)}
                  className="rounded-md bg-emerald-500/80 px-3 py-1 font-semibold text-emerald-50 hover:bg-emerald-500 transition"
                >
                  Buy
                </button>
                <button
                  onClick={() => onTrade?.("SELL", holding.symbol)}
                  className="rounded-md bg-amber-500/80 px-3 py-1 font-semibold text-amber-50 hover:bg-amber-500 transition"
                >
                  Sell
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}