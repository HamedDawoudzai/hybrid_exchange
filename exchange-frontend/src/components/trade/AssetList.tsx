import Link from "next/link";
import type { Asset } from "@/types";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { WatchlistStar } from "@/components/watchlist/WatchlistStar";

interface AssetListProps {
  assets: Asset[];
  isLoading?: boolean;
}

export function AssetList({ assets, isLoading }: AssetListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded border border-neutral-800/50 bg-neutral-900/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-400">
        No assets available. Please adjust filters or try again later.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {assets.map((asset) => {
        const change = asset.priceChangePercent24h ?? null;
        const priceChange = asset.priceChange24h ?? null;
        const changeClass =
          change == null
            ? "text-neutral-400"
            : change >= 0
            ? "text-success-500"
            : "text-danger-500";

        const typeColors = {
          STOCK: "bg-blue-500/10 text-blue-400 border-blue-500/30",
          CRYPTO: "bg-gold-500/10 text-gold-400 border-gold-500/30",
        };

        return (
          <Link key={asset.id} href={`/trade/${asset.symbol}`}>
            <div className="flex items-center justify-between p-4 rounded border border-neutral-800/50 bg-neutral-900/30 hover:border-gold-600/30 hover:bg-neutral-900/50 transition cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={`relative w-11 h-11 rounded flex items-center justify-center text-sm font-bold ${
                  asset.type === "CRYPTO" 
                    ? "bg-gold-500/10 text-gold-400" 
                    : "bg-blue-500/10 text-blue-400"
                }`}>
                  {asset.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold transition ${
                      asset.type === "CRYPTO" 
                        ? "text-white group-hover:text-gold-500" 
                        : "text-white group-hover:text-blue-400"
                    }`}>
                      {asset.symbol}
                    </p>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${typeColors[asset.type]}`}>
                      {asset.type === "CRYPTO" ? "Crypto" : "Stock"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 max-w-[200px] truncate">{asset.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold text-white">
                    {asset.currentPrice != null ? formatCurrency(asset.currentPrice) : "—"}
                  </p>
                  {change != null && (
                    <div className={`flex items-center justify-end gap-1 text-xs font-semibold ${changeClass}`}>
                      <span className={change >= 0 ? "rotate-0" : "rotate-180"}>
                        {change !== 0 && "▲"}
                      </span>
                      <span>
                        {priceChange != null && `${priceChange >= 0 ? "+" : ""}${formatCurrency(Math.abs(priceChange))} `}
                        ({formatPercent(change)})
                      </span>
                    </div>
                  )}
                </div>
                <WatchlistStar symbol={asset.symbol} size="sm" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
