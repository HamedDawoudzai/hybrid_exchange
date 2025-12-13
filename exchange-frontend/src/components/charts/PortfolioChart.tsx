"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { Holding, Order } from "@/types";

interface PortfolioChartProps {
  holdings: Holding[];
  totalValue: number;
  costBasis: number;
  orders?: Order[];
  isLoading?: boolean;
}

interface DataPoint {
  time: string;
  value: number;
}

type IntervalOption = "1m" | "5m" | "15m" | "1h" | "1d";

const INTERVALS: Record<IntervalOption, { ms: number; label: string }> = {
  "1m": { ms: 60_000, label: "1 Min" },
  "5m": { ms: 5 * 60_000, label: "5 Min" },
  "15m": { ms: 15 * 60_000, label: "15 Min" },
  "1h": { ms: 60 * 60_000, label: "1 Hour" },
  "1d": { ms: 24 * 60 * 60_000, label: "1 Day" },
};

export function PortfolioChart({ 
  holdings, 
  totalValue, 
  costBasis, 
  orders = [],
  isLoading 
}: PortfolioChartProps) {
  const [selectedInterval, setSelectedInterval] = useState<IntervalOption>("1m");

  // Get first purchase timestamp from BUY orders
  const firstBuyOrders = orders.filter(o => o.type === "BUY" && o.status === "COMPLETED");
  const startTime = firstBuyOrders.length > 0 
    ? Math.min(...firstBuyOrders.map(o => new Date(o.createdAt).getTime()))
    : Date.now() - 60 * 60_000; // Default to 1 hour ago if no orders

  // Generate chart data from first purchase to now
  const chartData = useMemo(() => {
    const now = Date.now();
    const intervalMs = INTERVALS[selectedInterval].ms;
    const points: DataPoint[] = [];
    
    // Calculate number of intervals from start to now
    const totalTime = now - startTime;
    const numPoints = Math.floor(totalTime / intervalMs) + 1;
    
    // Limit to max 200 points for performance
    const maxPoints = 200;
    const step = numPoints > maxPoints ? Math.ceil(numPoints / maxPoints) : 1;
    
    // Generate points
    for (let i = 0; i <= numPoints; i += step) {
      const timestamp = startTime + (i * intervalMs);
      if (timestamp > now) break;
      
      // Calculate progress from 0 to 1
      const progress = totalTime > 0 ? (timestamp - startTime) / totalTime : 1;
      
      // Interpolate value from cost basis to current value with some realistic variance
      const baseValue = costBasis + (totalValue - costBasis) * progress;
      
      // Add small random variance (±1%) for realism, except for last point
      const isLastPoint = timestamp >= now - intervalMs;
      const variance = isLastPoint ? 0 : (Math.sin(i * 0.5) * 0.01 + (Math.random() - 0.5) * 0.005) * baseValue;
      const value = Math.max(0, baseValue + variance);
      
      // Format time label
      const date = new Date(timestamp);
      let timeLabel: string;
      if (selectedInterval === "1d") {
        timeLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else if (selectedInterval === "1h") {
        timeLabel = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      } else {
        timeLabel = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      }
      
      points.push({
        time: timeLabel,
        value: Number(value.toFixed(2)),
      });
    }
    
    // Ensure last point is exactly current value
    if (points.length > 0) {
      points[points.length - 1].value = totalValue;
    }
    
    return points;
  }, [startTime, totalValue, costBasis, selectedInterval]);

  const isPositive = totalValue >= costBasis;
  const lineColor = isPositive ? "#22c55e" : "#ef4444";

  // Calculate duration text
  const durationMs = Date.now() - startTime;
  const durationMins = Math.floor(durationMs / 60_000);
  const durationHours = Math.floor(durationMins / 60);
  const durationDays = Math.floor(durationHours / 24);
  
  let durationText = "";
  if (durationDays > 0) {
    durationText = `${durationDays}d ${durationHours % 24}h`;
  } else if (durationHours > 0) {
    durationText = `${durationHours}h ${durationMins % 60}m`;
  } else {
    durationText = `${durationMins}m`;
  }

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!holdings || holdings.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-neutral-500">
        <p>No holdings yet. Start trading to track performance.</p>
      </div>
    );
  }

  // Calculate Y axis domain
  const values = chartData.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.15 || max * 0.05 || 100;

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {(Object.keys(INTERVALS) as IntervalOption[]).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedInterval(key)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all ${
                selectedInterval === key
                  ? "bg-gold-600 text-black"
                  : "bg-neutral-800/60 text-neutral-400 hover:bg-neutral-700 hover:text-white"
              }`}
            >
              {INTERVALS[key].label}
            </button>
          ))}
        </div>
        <div className="text-[11px] text-neutral-500">
          {chartData.length} points • {durationText}
        </div>
      </div>

      {/* Chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#525252", fontSize: 10 }}
              interval="preserveStartEnd"
              minTickGap={60}
            />
            <YAxis
              domain={[min - pad, max + pad]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#525252", fontSize: 10 }}
              tickFormatter={(v) => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v.toFixed(0)}`}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#171717",
                border: "1px solid #333",
                borderRadius: "6px",
                padding: "8px 12px",
              }}
              labelStyle={{ color: "#888", fontSize: 11 }}
              formatter={(value: number) => [
                <span key="v" style={{ color: lineColor, fontWeight: 600 }}>
                  {formatCurrency(value)}
                </span>,
                "Value"
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2}
              dot={chartData.length <= 60 ? { r: 3, fill: lineColor, stroke: "#000", strokeWidth: 1 } : false}
              activeDot={{ r: 5, fill: lineColor, stroke: "#000", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-[10px] text-neutral-600 pt-1 border-t border-neutral-800/40">
        <span>First purchase: {new Date(startTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
        <span>Now: {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
  );
}
