import Link from "next/link";
import type { Asset } from "@/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

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
            className="h-16 rounded-lg border border-slate-800/70 bg-slate-900/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="text-center py-8 text-slate-300">
        No assets available. Please adjust filters or try again later.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {assets.map((asset) => {
        const change = asset.priceChangePercent24h ?? null;
        const changeClass =
          change == null
            ? "text-slate-300"
            : change >= 0
            ? "text-emerald-400"
            : "text-rose-400";

        return (
          <Link key={asset.id} href={`/trade/${asset.symbol}`}>
            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-800/70 bg-slate-900/60 hover:border-indigo-500/40 hover:bg-slate-900/80 transition cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-100 text-sm font-semibold">
                  {asset.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-slate-50">{asset.symbol}</p>
                  <p className="text-xs text-slate-400">{asset.name}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-slate-100">
                  {asset.currentPrice != null ? formatCurrency(asset.currentPrice) : "—"}
                </p>
                {change != null && (
                  <p className={`text-xs font-semibold ${changeClass}`}>
                    {formatPercent(change)}
                  </p>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}