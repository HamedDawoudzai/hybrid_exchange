import type { Holding } from "@/types";

interface HoldingsListProps {
  holdings: Holding[];
  isLoading?: boolean;
}

/**
 * HoldingsList Component
 * Displays list of portfolio holdings with current values.
 * 
 * TODO: Implement holdings table/list
 * TODO: Add loading skeleton
 * TODO: Add empty state
 * TODO: Format currency and percentage values
 * TODO: Color code profit/loss
 */
export function HoldingsList({ holdings, isLoading }: HoldingsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (holdings.length === 0) {
    return (
      <div className="text-center py-8">
        No holdings yet. Start trading to build your portfolio!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 px-4 py-2 text-sm">
        <span>Asset</span>
        <span className="text-right">Quantity</span>
        <span className="text-right">Avg Price</span>
        <span className="text-right">Current</span>
        <span className="text-right">Value</span>
        <span className="text-right">P/L</span>
      </div>

      {/* Holdings - TODO: Implement holding rows */}
      {holdings.map((holding) => (
        <div
          key={holding.id}
          className="grid grid-cols-6 gap-4 px-4 py-3 rounded-lg items-center"
        >
          <div>
            <p className="font-medium">{holding.symbol}</p>
            <p className="text-xs">{holding.assetName}</p>
          </div>
          <span className="text-right">{holding.quantity}</span>
          <span className="text-right">${holding.averageBuyPrice}</span>
          <span className="text-right">${holding.currentPrice ?? "-"}</span>
          <span className="text-right">${holding.currentValue ?? "-"}</span>
          <span className="text-right">{holding.profitLossPercent ?? "-"}%</span>
        </div>
      ))}
    </div>
  );
}
