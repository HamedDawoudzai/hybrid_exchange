"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PriceData } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface PriceChartProps {
  data: PriceData[];
  isLoading?: boolean;
}

export function PriceChart({ data, isLoading }: PriceChartProps) {
  // Calculate price trend for gradient color
  const { chartData, isPositive, minPrice, maxPrice } = useMemo(() => {
    if (!data || data.length === 0) {
      return { chartData: [], isPositive: true, minPrice: 0, maxPrice: 0 };
    }

    // Determine if data spans multiple days (use date labels) or same day (use time labels)
    const firstDate = new Date(data[0].timestamp);
    const lastDate = new Date(data[data.length - 1].timestamp);
    const spansDays = lastDate.getTime() - firstDate.getTime() > 24 * 60 * 60 * 1000;

    const mapped = data.map((d, idx) => {
      const date = new Date(d.timestamp);
      // For multi-day data, show "Mon 12" format; for same-day, show "14:30" format
      const label = spansDays
        ? date.toLocaleDateString([], { month: "short", day: "numeric" })
        : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
      
      return {
        ...d,
        label,
        fullDate: date.toLocaleString([], { 
          month: "short", 
          day: "numeric", 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
        index: idx,
      };
    });

    const prices = mapped.map(d => d.price).filter(p => p != null);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const firstPrice = prices[0] ?? 0;
    const lastPrice = prices[prices.length - 1] ?? 0;

    return {
      chartData: mapped,
      isPositive: lastPrice >= firstPrice,
      minPrice: min,
      maxPrice: max,
    };
  }, [data]);

  // Add 5% padding to domain
  const yDomain = useMemo(() => {
    if (minPrice === maxPrice) return [minPrice * 0.95, maxPrice * 1.05];
    const padding = (maxPrice - minPrice) * 0.1;
    return [Math.max(0, minPrice - padding), maxPrice + padding];
  }, [minPrice, maxPrice]);

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Loading chart...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-slate-400">
        <div className="text-center">
          <p className="text-lg font-medium">No price data available</p>
          <p className="text-sm mt-1">Try adjusting the time range</p>
        </div>
      </div>
    );
  }

  const strokeColor = isPositive ? "#10b981" : "#ef4444";
  const gradientId = isPositive ? "priceGradientUp" : "priceGradientDown";

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradientUp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="priceGradientDown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#475569"
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={50}
          />
          <YAxis
            stroke="#475569"
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={75}
            domain={yDomain}
            tickFormatter={(value) => {
              if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
              if (value >= 1) return `$${value.toFixed(2)}`;
              return `$${value.toFixed(4)}`;
            }}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(71,85,105,0.5)",
              borderRadius: "0.75rem",
              padding: "12px 16px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            }}
            labelStyle={{ color: "#94a3b8", marginBottom: "4px", fontSize: "12px" }}
            labelFormatter={(_, payload) => {
              if (payload && payload[0]?.payload?.fullDate) {
                return payload[0].payload.fullDate;
              }
              return "";
            }}
            formatter={(value: number) => [
              <span key="price" className="font-semibold text-white">
                {formatCurrency(value)}
              </span>,
              "Price"
            ]}
            cursor={{ stroke: "#475569", strokeWidth: 1, strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ 
              r: 5, 
              stroke: strokeColor, 
              strokeWidth: 2,
              fill: "#0f172a"
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}