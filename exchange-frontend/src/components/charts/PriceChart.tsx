"use client";

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

interface PriceChartProps {
  data: PriceData[];
  isLoading?: boolean;
}

export function PriceChart({ data, isLoading }: PriceChartProps) {
  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center text-slate-300">
        Loading chart...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-slate-400">
        No data available
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    // Ensure timestamp is a readable label; if backend sends ISO strings, this will format nicely
    label: new Date(d.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={70}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(148,163,184,0.3)",
              borderRadius: "0.75rem",
              color: "#e2e8f0",
            }}
            labelStyle={{ color: "#cbd5e1" }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={{ r: 4, stroke: "#c7d2fe", strokeWidth: 1 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}