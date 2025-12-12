import Link from "next/link";
import type { Asset } from "@/types";

interface AssetListProps {
  assets: Asset[];
  isLoading?: boolean;
}

/**
 * AssetList Component
 * Displays list of tradable assets with current prices.
 * 
 * TODO: Implement asset list with prices
 * TODO: Add loading skeleton
 * TODO: Add empty state
 * TODO: Format currency and percentage values
 * TODO: Color code price changes
 */
export function AssetList({ assets, isLoading }: AssetListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-8">No assets available</div>
    );
  }

  return (
    <div className="space-y-2">
      {assets.map((asset) => (
        <Link key={asset.id} href={`/trade/${asset.symbol}`}>
          <div className="flex items-center justify-between p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-4">
              {/* Logo placeholder */}
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-bold">
                  {asset.symbol.slice(0, 2)}
                </span>
              </div>

              <div>
                <p className="font-medium">{asset.symbol}</p>
                <p className="text-sm text-gray-500">{asset.name}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-medium">
                {asset.currentPrice ? `$${asset.currentPrice}` : "—"}
              </p>
              {asset.priceChangePercent24h !== undefined && (
                <p
                  className={`text-sm ${
                    asset.priceChangePercent24h >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {asset.priceChangePercent24h >= 0 ? "+" : ""}
                  {asset.priceChangePercent24h.toFixed(2)}%
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
