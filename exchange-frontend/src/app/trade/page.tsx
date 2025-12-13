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

  const { assets, isLoading, isFetching, error, dataUpdatedAt } = useAssets({
    filter: activeTab === "all" ? "all" : activeTab === "stocks" ? "STOCK" : "CRYPTO",
    refetchInterval: 30_000,
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

  const lastUpdate = dataUpdatedAt 
    ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gold-600/3 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/3 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-px bg-gold-600/50"></span>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600">Markets</p>
            </div>
            <h1 className="text-3xl font-serif font-light text-white">Trade</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Browse stocks and crypto, view prices, and jump into trading.
            </p>
          </div>
          <div className="w-full md:w-72">
            <input
              className="w-full rounded border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:border-gold-600/50 focus:outline-none focus:ring-1 focus:ring-gold-600/20 transition-all duration-200"
              placeholder="Search symbols or names"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <Card className="border border-neutral-800/50 bg-neutral-950/50">
          <CardHeader className="pb-2 border-b border-neutral-800/50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-gold-600/10 text-gold-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </span>
                <span className="font-serif">Assets</span>
              </div>
              {/* Live indicator */}
              <div className="flex items-center gap-3 text-xs">
                {isFetching && !isLoading && (
                  <span className="flex items-center gap-1 text-gold-500">
                    <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                    Updating...
                  </span>
                )}
                {lastUpdate && !isFetching && (
                  <span className="text-neutral-600">
                    Updated {lastUpdate}
                  </span>
                )}
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-success-500/10 text-success-500 border border-success-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
                  LIVE
                </span>
              </div>
            </CardTitle>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["all", "stocks", "crypto"] as Tab[]).map((tab) => {
                const counts = {
                  all: assets.length,
                  stocks: assets.filter(a => a.type === "STOCK").length,
                  crypto: assets.filter(a => a.type === "CRYPTO").length,
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded px-4 py-2 text-sm font-medium transition border ${
                      activeTab === tab
                        ? "bg-gold-600/10 text-gold-500 border-gold-600/30"
                        : "bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-300"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    <span className="ml-2 text-xs opacity-60">({counts[tab]})</span>
                  </button>
                );
              })}
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
