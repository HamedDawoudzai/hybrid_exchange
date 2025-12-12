"use client";

import type { PriceData } from "@/types";

interface PriceChartProps {
  data: PriceData[];
  isLoading?: boolean;
}

/**
 * PriceChart Component
 * Displays price history using Recharts.
 * 
 * TODO: Implement line chart with Recharts
 * TODO: Add loading skeleton
 * TODO: Add empty state
 * TODO: Style chart with theme colors
 * TODO: Add tooltip
 */
export function PriceChart({ data, isLoading }: PriceChartProps) {
  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div>Loading chart...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div>No data available</div>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      {/* TODO: Implement Recharts LineChart */}
      <div className="flex items-center justify-center h-full">
        <p>Chart implementation pending</p>
        <p className="text-sm text-gray-500">{data.length} data points</p>
      </div>
    </div>
  );
}
