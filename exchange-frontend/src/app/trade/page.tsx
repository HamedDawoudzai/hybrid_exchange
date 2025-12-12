"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AssetList } from "@/components/trade/AssetList";
import { useAssets } from "@/hooks/useAssets";
import { toast } from "sonner";

type Tab = "all" | "stocks" | "crypto";

export default function TradePage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");

  const { assets, isLoading, error } = useAssets({
    filter: activeTab === "all" ? "all" : activeTab === "stocks" ? "STOCK" : "CRYPTO",
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load assets. Please try again.");
    }
  }, [error]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return assets.filter((a) => {
      const matchesTerm =
        !term ||
        a.symbol.toLowerCase().includes(term) ||
        (a.name ?? "").toLowerCase().includes(term);
      return matchesTerm;
    });
  }, [assets, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Markets</p>
            <h1 className="text-3xl font-semibold text-slate-50">Trade</h1>
            <p className="text-sm text-slate-400">
              Browse stocks and crypto, view prices, and jump into trading.
            </p>
          </div>
          <div className="w-full md:w-72">
            <input
              className="w-full rounded-lg border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search symbols or names"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <Card className="border border-slate-800/70 bg-white/5 backdrop-blur-xl shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-slate-100">
              <span>Assets</span>
            </CardTitle>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["all", "stocks", "crypto"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition border border-slate-800/70 ${
                    activeTab === tab
                      ? "bg-indigo-500/20 text-indigo-200"
                      : "bg-slate-900/50 text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <AssetList assets={filtered} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}