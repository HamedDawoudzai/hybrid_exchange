"use client";

import { useWatchlist } from "@/hooks/useWatchlist";
import { formatCurrency, formatNumber } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

export function WatchlistPanel() {
  const { watchlist, isLoading, removeFromWatchlist, isRemoving } = useWatchlist();

  const handleRemove = async (symbol: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeFromWatchlist(symbol);
      toast.success(`Removed ${symbol} from watchlist`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove from watchlist");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-neutral-800/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-800/50 flex items-center justify-center">
          <svg className="w-6 h-6 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <p className="text-sm text-neutral-500">No items in watchlist</p>
        <p className="text-xs text-neutral-600 mt-1">Star assets on trade pages to add them</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {watchlist.map((item) => {
        const priceChange = item.priceChangePercent24h ?? 0;
        const isPositive = priceChange >= 0;
        const changeColor = isPositive ? "text-success-500" : "text-danger-500";
        const changeBg = isPositive ? "bg-success-500/10" : "bg-danger-500/10";

        return (
          <Link key={item.id} href={`/trade/${item.symbol}`}>
            <div className="group flex items-center justify-between p-3 rounded-lg border border-neutral-800/50 bg-neutral-900/30 hover:border-gold-600/40 hover:bg-neutral-900/50 transition cursor-pointer">
              <div className="flex items-center gap-3">
                {/* Star button */}
                <button
                  onClick={(e) => handleRemove(item.symbol, e)}
                  disabled={isRemoving}
                  className="text-gold-500 hover:text-gold-400 transition-colors"
                  title="Remove from watchlist"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{item.symbol}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      item.assetType === "CRYPTO"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {item.assetType === "CRYPTO" ? "Crypto" : "Stock"}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 truncate max-w-[100px]">{item.name}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {item.currentPrice != null ? formatCurrency(item.currentPrice) : "--"}
                </p>
                <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${changeBg} ${changeColor}`}>
                  {isPositive ? "↑" : "↓"} {Math.abs(priceChange).toFixed(2)}%
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

